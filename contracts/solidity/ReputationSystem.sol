// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title ReputationSystem
 * @dev Smart contract for managing user reputation and credit scoring
 * @author P³ Lending Platform
 */
contract ReputationSystem is ReentrancyGuard, Pausable, Ownable {
    using SafeMath for uint256;

    // Events
    event ReputationUpdated(
        address indexed user,
        uint256 oldScore,
        uint256 newScore,
        string reason
    );
    
    event ReputationFactorAdded(
        address indexed user,
        ReputationFactorType factorType,
        int256 impact,
        string description
    );
    
    event MicroLoanGranted(
        address indexed user,
        uint256 amount,
        uint256 maxAmount
    );
    
    event CreditTierUpgraded(
        address indexed user,
        CreditTier oldTier,
        CreditTier newTier
    );

    // Structs
    struct ReputationProfile {
        uint256 score; // 0-1000
        CreditTier tier;
        uint256 totalLoans;
        uint256 successfulLoans;
        uint256 defaultedLoans;
        uint256 totalLent;
        uint256 totalBorrowed;
        uint256 averageRepaymentTime;
        uint256 lastActivity;
        bool isActive;
        uint256 microLoanLimit;
        uint256 unsecuredLoanLimit;
    }

    struct ReputationFactor {
        ReputationFactorType factorType;
        int256 impact; // positive or negative impact on score
        uint256 weight; // 0-100, importance of this factor
        string description;
        uint256 timestamp;
        bool isActive;
    }

    struct MicroLoan {
        uint256 id;
        address borrower;
        uint256 amount;
        uint256 interestRate;
        uint256 duration;
        uint256 createdAt;
        uint256 dueDate;
        bool isRepaid;
        uint256 repaidAt;
    }

    // Enums
    enum CreditTier {
        BRONZE,    // 0-200: New users, micro-loans only
        SILVER,    // 201-400: Small unsecured loans
        GOLD,      // 401-600: Medium unsecured loans
        PLATINUM,  // 601-800: Large unsecured loans
        DIAMOND    // 801-1000: Premium rates, highest limits
    }

    enum ReputationFactorType {
        LOAN_REPAYMENT,
        LOAN_DEFAULT,
        LATE_PAYMENT,
        EARLY_REPAYMENT,
        COLLATERAL_PROVIDED,
        REVIEW_RECEIVED,
        REVIEW_GIVEN,
        DISPUTE_PARTICIPATION,
        PLATFORM_ACTIVITY,
        KYC_VERIFICATION,
        REFERRAL_BONUS,
        COMMUNITY_CONTRIBUTION
    }

    // State variables
    uint256 public constant MAX_SCORE = 1000;
    uint256 public constant MIN_SCORE = 0;
    uint256 public constant MICRO_LOAN_BASE_AMOUNT = 0.001 ether; // 0.001 BTC equivalent
    uint256 public constant MICRO_LOAN_MAX_AMOUNT = 0.01 ether; // 0.01 BTC equivalent
    uint256 public constant MICRO_LOAN_DURATION = 30 days;
    uint256 public constant MICRO_LOAN_INTEREST_RATE = 500; // 5% APY in basis points

    // Mappings
    mapping(address => ReputationProfile) public reputationProfiles;
    mapping(address => ReputationFactor[]) public userReputationFactors;
    mapping(address => MicroLoan[]) public userMicroLoans;
    mapping(CreditTier => uint256) public tierLimits;
    mapping(CreditTier => uint256) public tierInterestRates;
    
    // Arrays
    address[] public registeredUsers;
    MicroLoan[] public allMicroLoans;
    
    // Counters
    uint256 public nextMicroLoanId = 1;
    uint256 public totalMicroLoans = 0;
    uint256 public totalReputationUpdates = 0;

    // Modifiers
    modifier onlyRegisteredUser(address user) {
        require(reputationProfiles[user].isActive, "User not registered");
        _;
    }

    modifier validScore(uint256 score) {
        require(score >= MIN_SCORE && score <= MAX_SCORE, "Invalid score");
        _;
    }

    constructor() {
        _initializeTierLimits();
        _initializeTierInterestRates();
    }

    /**
     * @dev Register a new user with initial reputation
     * @param user User address to register
     */
    function registerUser(address user) external onlyOwner {
        require(!reputationProfiles[user].isActive, "User already registered");
        
        reputationProfiles[user] = ReputationProfile({
            score: 100, // Starting score for new users
            tier: CreditTier.BRONZE,
            totalLoans: 0,
            successfulLoans: 0,
            defaultedLoans: 0,
            totalLent: 0,
            totalBorrowed: 0,
            averageRepaymentTime: 0,
            lastActivity: block.timestamp,
            isActive: true,
            microLoanLimit: MICRO_LOAN_BASE_AMOUNT,
            unsecuredLoanLimit: 0
        });
        
        registeredUsers.push(user);
        
        // Add initial reputation factor for registration
        _addReputationFactor(user, ReputationFactorType.PLATFORM_ACTIVITY, 10, "User registration");
        
        emit ReputationUpdated(user, 0, 100, "Initial registration");
    }

    /**
     * @dev Update user reputation based on loan performance
     * @param user User address
     * @param loanAmount Loan amount
     * @param wasSuccessful Whether loan was successful
     * @param repaymentTime Time taken to repay (0 if defaulted)
     */
    function updateLoanReputation(
        address user,
        uint256 loanAmount,
        bool wasSuccessful,
        uint256 repaymentTime
    ) external onlyOwner onlyRegisteredUser(user) {
        ReputationProfile storage profile = reputationProfiles[user];
        
        profile.totalLoans = profile.totalLoans.add(1);
        profile.lastActivity = block.timestamp;
        
        if (wasSuccessful) {
            profile.successfulLoans = profile.successfulLoans.add(1);
            profile.totalBorrowed = profile.totalBorrowed.add(loanAmount);
            
            // Calculate reputation impact based on repayment time
            int256 timeImpact = _calculateTimeImpact(repaymentTime);
            _addReputationFactor(user, ReputationFactorType.LOAN_REPAYMENT, timeImpact, "Successful loan repayment");
            
            // Bonus for early repayment
            if (repaymentTime < 7 days) {
                _addReputationFactor(user, ReputationFactorType.EARLY_REPAYMENT, 20, "Early repayment bonus");
            }
        } else {
            profile.defaultedLoans = profile.defaultedLoans.add(1);
            _addReputationFactor(user, ReputationFactorType.LOAN_DEFAULT, -50, "Loan default");
        }
        
        // Update average repayment time
        if (wasSuccessful && repaymentTime > 0) {
            profile.averageRepaymentTime = profile.averageRepaymentTime
                .mul(profile.successfulLoans.sub(1))
                .add(repaymentTime)
                .div(profile.successfulLoans);
        }
        
        _updateCreditTier(user);
    }

    /**
     * @dev Update lending reputation
     * @param lender Lender address
     * @param loanAmount Amount lent
     * @param wasSuccessful Whether the loan was successful
     */
    function updateLendingReputation(
        address lender,
        uint256 loanAmount,
        bool wasSuccessful
    ) external onlyOwner onlyRegisteredUser(lender) {
        ReputationProfile storage profile = reputationProfiles[lender];
        
        profile.totalLent = profile.totalLent.add(loanAmount);
        profile.lastActivity = block.timestamp;
        
        if (wasSuccessful) {
            _addReputationFactor(lender, ReputationFactorType.LOAN_REPAYMENT, 15, "Successful lending");
        } else {
            _addReputationFactor(lender, ReputationFactorType.LOAN_DEFAULT, -10, "Borrower default");
        }
        
        _updateCreditTier(lender);
    }

    /**
     * @dev Add a review-based reputation factor
     * @param user User address
     * @param rating Review rating (1-5)
     * @param isLender Whether the user was the lender
     */
    function addReviewReputation(
        address user,
        uint256 rating,
        bool isLender
    ) external onlyOwner onlyRegisteredUser(user) {
        require(rating >= 1 && rating <= 5, "Invalid rating");
        
        int256 impact = int256(rating.sub(3)).mul(5); // -10 to +10 based on rating
        string memory description = isLender ? "Lender review received" : "Borrower review received";
        
        _addReputationFactor(user, ReputationFactorType.REVIEW_RECEIVED, impact, description);
        _updateCreditTier(user);
    }

    /**
     * @dev Grant a micro-loan to a new user
     * @param user User address
     * @param amount Loan amount (must be within micro-loan limits)
     */
    function grantMicroLoan(address user, uint256 amount) external onlyOwner onlyRegisteredUser(user) {
        ReputationProfile storage profile = reputationProfiles[user];
        require(profile.tier == CreditTier.BRONZE, "Not eligible for micro-loan");
        require(amount <= profile.microLoanLimit, "Amount exceeds micro-loan limit");
        require(amount >= MICRO_LOAN_BASE_AMOUNT, "Amount below minimum");
        
        uint256 microLoanId = nextMicroLoanId++;
        
        MicroLoan memory microLoan = MicroLoan({
            id: microLoanId,
            borrower: user,
            amount: amount,
            interestRate: MICRO_LOAN_INTEREST_RATE,
            duration: MICRO_LOAN_DURATION,
            createdAt: block.timestamp,
            dueDate: block.timestamp.add(MICRO_LOAN_DURATION),
            isRepaid: false,
            repaidAt: 0
        });
        
        userMicroLoans[user].push(microLoan);
        allMicroLoans.push(microLoan);
        totalMicroLoans = totalMicroLoans.add(1);
        
        emit MicroLoanGranted(user, amount, profile.microLoanLimit);
    }

    /**
     * @dev Repay a micro-loan
     * @param microLoanId Micro-loan ID
     */
    function repayMicroLoan(uint256 microLoanId) external payable {
        require(microLoanId < allMicroLoans.length, "Invalid micro-loan ID");
        MicroLoan storage microLoan = allMicroLoans[microLoanId];
        require(microLoan.borrower == msg.sender, "Not the borrower");
        require(!microLoan.isRepaid, "Already repaid");
        require(block.timestamp <= microLoan.dueDate.add(7 days), "Loan expired");
        
        uint256 totalOwed = _calculateMicroLoanTotal(microLoan);
        require(msg.value >= totalOwed, "Insufficient payment");
        
        microLoan.isRepaid = true;
        microLoan.repaidAt = block.timestamp;
        
        uint256 repaymentTime = block.timestamp.sub(microLoan.createdAt);
        bool wasEarly = repaymentTime < microLoan.duration;
        
        // Update reputation based on repayment
        updateLoanReputation(msg.sender, microLoan.amount, true, repaymentTime);
        
        // Increase micro-loan limit for successful repayment
        ReputationProfile storage profile = reputationProfiles[msg.sender];
        if (wasEarly && profile.microLoanLimit < MICRO_LOAN_MAX_AMOUNT) {
            profile.microLoanLimit = profile.microLoanLimit.mul(110).div(100); // 10% increase
        }
        
        // Return excess payment
        if (msg.value > totalOwed) {
            payable(msg.sender).transfer(msg.value.sub(totalOwed));
        }
    }

    /**
     * @dev Get user's current credit tier and limits
     * @param user User address
     */
    function getUserCreditInfo(address user) external view returns (
        CreditTier tier,
        uint256 score,
        uint256 microLoanLimit,
        uint256 unsecuredLoanLimit,
        uint256 interestRate
    ) {
        ReputationProfile memory profile = reputationProfiles[user];
        return (
            profile.tier,
            profile.score,
            profile.microLoanLimit,
            profile.unsecuredLoanLimit,
            tierInterestRates[profile.tier]
        );
    }

    /**
     * @dev Get user's reputation factors
     * @param user User address
     */
    function getUserReputationFactors(address user) external view returns (ReputationFactor[] memory) {
        return userReputationFactors[user];
    }

    /**
     * @dev Get user's micro-loans
     * @param user User address
     */
    function getUserMicroLoans(address user) external view returns (MicroLoan[] memory) {
        return userMicroLoans[user];
    }

    /**
     * @dev Check if user is eligible for unsecured loan
     * @param user User address
     * @param amount Requested amount
     */
    function isEligibleForUnsecuredLoan(address user, uint256 amount) external view returns (bool) {
        ReputationProfile memory profile = reputationProfiles[user];
        return profile.tier != CreditTier.BRONZE && amount <= profile.unsecuredLoanLimit;
    }

    // Internal functions
    function _addReputationFactor(
        address user,
        ReputationFactorType factorType,
        int256 impact,
        string memory description
    ) internal {
        ReputationFactor memory factor = ReputationFactor({
            factorType: factorType,
            impact: impact,
            weight: _getFactorWeight(factorType),
            description: description,
            timestamp: block.timestamp,
            isActive: true
        });
        
        userReputationFactors[user].push(factor);
        
        // Update reputation score
        uint256 oldScore = reputationProfiles[user].score;
        uint256 newScore = _calculateNewScore(user, impact, factor.weight);
        
        reputationProfiles[user].score = newScore;
        totalReputationUpdates = totalReputationUpdates.add(1);
        
        emit ReputationFactorAdded(user, factorType, impact, description);
        emit ReputationUpdated(user, oldScore, newScore, description);
    }

    function _calculateNewScore(address user, int256 impact, uint256 weight) internal view returns (uint256) {
        uint256 currentScore = reputationProfiles[user].score;
        int256 weightedImpact = impact.mul(int256(weight)).div(100);
        
        int256 newScore = int256(currentScore).add(weightedImpact);
        
        if (newScore < int256(MIN_SCORE)) {
            return MIN_SCORE;
        } else if (newScore > int256(MAX_SCORE)) {
            return MAX_SCORE;
        } else {
            return uint256(newScore);
        }
    }

    function _updateCreditTier(address user) internal {
        ReputationProfile storage profile = reputationProfiles[user];
        CreditTier oldTier = profile.tier;
        CreditTier newTier = _getCreditTier(profile.score);
        
        if (newTier != oldTier) {
            profile.tier = newTier;
            profile.unsecuredLoanLimit = tierLimits[newTier];
            emit CreditTierUpgraded(user, oldTier, newTier);
        }
    }

    function _getCreditTier(uint256 score) internal pure returns (CreditTier) {
        if (score >= 801) return CreditTier.DIAMOND;
        if (score >= 601) return CreditTier.PLATINUM;
        if (score >= 401) return CreditTier.GOLD;
        if (score >= 201) return CreditTier.SILVER;
        return CreditTier.BRONZE;
    }

    function _getFactorWeight(ReputationFactorType factorType) internal pure returns (uint256) {
        if (factorType == ReputationFactorType.LOAN_REPAYMENT) return 100;
        if (factorType == ReputationFactorType.LOAN_DEFAULT) return 100;
        if (factorType == ReputationFactorType.EARLY_REPAYMENT) return 80;
        if (factorType == ReputationFactorType.LATE_PAYMENT) return 60;
        if (factorType == ReputationFactorType.REVIEW_RECEIVED) return 40;
        if (factorType == ReputationFactorType.KYC_VERIFICATION) return 30;
        if (factorType == ReputationFactorType.PLATFORM_ACTIVITY) return 20;
        return 50; // Default weight
    }

    function _calculateTimeImpact(uint256 repaymentTime) internal pure returns (int256) {
        if (repaymentTime <= 1 days) return 30;
        if (repaymentTime <= 7 days) return 20;
        if (repaymentTime <= 30 days) return 10;
        if (repaymentTime <= 90 days) return 5;
        return 0;
    }

    function _calculateMicroLoanTotal(MicroLoan memory microLoan) internal view returns (uint256) {
        uint256 interest = microLoan.amount.mul(microLoan.interestRate).div(10000);
        return microLoan.amount.add(interest);
    }

    function _initializeTierLimits() internal {
        tierLimits[CreditTier.BRONZE] = 0; // No unsecured loans
        tierLimits[CreditTier.SILVER] = 0.1 ether; // 0.1 BTC
        tierLimits[CreditTier.GOLD] = 0.5 ether; // 0.5 BTC
        tierLimits[CreditTier.PLATINUM] = 2 ether; // 2 BTC
        tierLimits[CreditTier.DIAMOND] = 10 ether; // 10 BTC
    }

    function _initializeTierInterestRates() internal {
        tierInterestRates[CreditTier.BRONZE] = 1500; // 15% APY
        tierInterestRates[CreditTier.SILVER] = 1200; // 12% APY
        tierInterestRates[CreditTier.GOLD] = 900; // 9% APY
        tierInterestRates[CreditTier.PLATINUM] = 600; // 6% APY
        tierInterestRates[CreditTier.DIAMOND] = 300; // 3% APY
    }

    // Admin functions
    function setTierLimit(CreditTier tier, uint256 limit) external onlyOwner {
        tierLimits[tier] = limit;
    }

    function setTierInterestRate(CreditTier tier, uint256 rate) external onlyOwner {
        tierInterestRates[tier] = rate;
    }

    function emergencyUpdateReputation(address user, uint256 newScore) external onlyOwner validScore(newScore) {
        uint256 oldScore = reputationProfiles[user].score;
        reputationProfiles[user].score = newScore;
        _updateCreditTier(user);
        emit ReputationUpdated(user, oldScore, newScore, "Emergency update");
    }

    // Receive function to accept ETH
    receive() external payable {}
}
