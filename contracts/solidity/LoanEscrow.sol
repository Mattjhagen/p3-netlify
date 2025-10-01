// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title LoanEscrow
 * @dev Smart contract for managing peer-to-peer Bitcoin lending with escrow functionality
 * @author P³ Lending Platform
 */
contract LoanEscrow is ReentrancyGuard, Pausable, Ownable {
    using SafeMath for uint256;

    // Events
    event LoanCreated(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount,
        uint256 interestRate,
        uint256 duration,
        uint256 collateralAmount
    );
    
    event LoanFunded(
        uint256 indexed loanId,
        address indexed lender,
        uint256 amount
    );
    
    event LoanRepaid(
        uint256 indexed loanId,
        uint256 principal,
        uint256 interest,
        uint256 totalRepaid
    );
    
    event LoanDefaulted(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 collateralSeized
    );
    
    event CollateralDeposited(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount
    );
    
    event CollateralWithdrawn(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount
    );
    
    event DisputeCreated(
        uint256 indexed loanId,
        address indexed initiator,
        string reason
    );
    
    event DisputeResolved(
        uint256 indexed loanId,
        address indexed arbitrator,
        uint8 decision
    );

    // Structs
    struct Loan {
        uint256 id;
        address borrower;
        address lender;
        uint256 amount;
        uint256 interestRate; // APY in basis points (100 = 1%)
        uint256 duration; // in days
        uint256 collateralAmount;
        uint256 collateralRatio; // in basis points (15000 = 150%)
        uint256 createdAt;
        uint256 fundedAt;
        uint256 dueDate;
        uint256 repaidAmount;
        LoanStatus status;
        bool hasDispute;
        string purpose;
        string description;
    }

    struct RepaymentSchedule {
        uint256 dueDate;
        uint256 amount;
        bool paid;
        uint256 paidAt;
    }

    struct Dispute {
        address initiator;
        address respondent;
        string reason;
        string description;
        DisputeStatus status;
        address arbitrator;
        uint256 createdAt;
        uint256 resolvedAt;
        uint8 decision; // 0: favor initiator, 1: favor respondent, 2: partial, 3: no fault
    }

    // Enums
    enum LoanStatus {
        PENDING,
        FUNDED,
        ACTIVE,
        REPAID,
        DEFAULTED,
        CANCELLED,
        DISPUTED
    }

    enum DisputeStatus {
        OPEN,
        UNDER_REVIEW,
        RESOLVED,
        CLOSED
    }

    // State variables
    uint256 public nextLoanId = 1;
    uint256 public platformFeeRate = 100; // 1% in basis points
    uint256 public insurancePoolRate = 50; // 0.5% in basis points
    uint256 public constant BASIS_POINTS = 10000;
    
    // Mappings
    mapping(uint256 => Loan) public loans;
    mapping(uint256 => RepaymentSchedule[]) public repaymentSchedules;
    mapping(uint256 => Dispute) public disputes;
    mapping(address => uint256[]) public userLoans;
    mapping(address => uint256) public userReputation;
    mapping(address => bool) public authorizedArbitrators;
    
    // Platform funds
    uint256 public platformFees;
    uint256 public insurancePool;
    uint256 public totalValueLocked;

    // Modifiers
    modifier onlyBorrower(uint256 loanId) {
        require(loans[loanId].borrower == msg.sender, "Not the borrower");
        _;
    }
    
    modifier onlyLender(uint256 loanId) {
        require(loans[loanId].lender == msg.sender, "Not the lender");
        _;
    }
    
    modifier onlyArbitrator() {
        require(authorizedArbitrators[msg.sender], "Not authorized arbitrator");
        _;
    }
    
    modifier loanExists(uint256 loanId) {
        require(loans[loanId].id != 0, "Loan does not exist");
        _;
    }

    constructor() {
        // Initialize with owner as first arbitrator
        authorizedArbitrators[msg.sender] = true;
    }

    /**
     * @dev Create a new loan request
     * @param amount Loan amount in wei
     * @param interestRate APY in basis points
     * @param duration Loan duration in days
     * @param collateralAmount Collateral amount in wei
     * @param purpose Loan purpose
     * @param description Loan description
     */
    function createLoan(
        uint256 amount,
        uint256 interestRate,
        uint256 duration,
        uint256 collateralAmount,
        string memory purpose,
        string memory description
    ) external whenNotPaused nonReentrant returns (uint256) {
        require(amount > 0, "Amount must be greater than 0");
        require(interestRate >= 100 && interestRate <= 5000, "Invalid interest rate"); // 1% to 50%
        require(duration >= 1 && duration <= 365, "Invalid duration"); // 1 day to 1 year
        require(collateralAmount >= 0, "Invalid collateral amount");
        
        uint256 loanId = nextLoanId++;
        
        loans[loanId] = Loan({
            id: loanId,
            borrower: msg.sender,
            lender: address(0),
            amount: amount,
            interestRate: interestRate,
            duration: duration,
            collateralAmount: collateralAmount,
            collateralRatio: collateralAmount > 0 ? collateralAmount.mul(BASIS_POINTS).div(amount) : 0,
            createdAt: block.timestamp,
            fundedAt: 0,
            dueDate: 0,
            repaidAmount: 0,
            status: LoanStatus.PENDING,
            hasDispute: false,
            purpose: purpose,
            description: description
        });
        
        userLoans[msg.sender].push(loanId);
        
        emit LoanCreated(loanId, msg.sender, amount, interestRate, duration, collateralAmount);
        
        return loanId;
    }

    /**
     * @dev Fund a loan
     * @param loanId ID of the loan to fund
     */
    function fundLoan(uint256 loanId) external payable whenNotPaused nonReentrant loanExists(loanId) {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.PENDING, "Loan not available for funding");
        require(loan.borrower != msg.sender, "Cannot fund your own loan");
        require(msg.value >= loan.amount, "Insufficient funds");
        
        // Calculate fees
        uint256 platformFee = loan.amount.mul(platformFeeRate).div(BASIS_POINTS);
        uint256 insuranceFee = loan.amount.mul(insurancePoolRate).div(BASIS_POINTS);
        uint256 netAmount = loan.amount.sub(platformFee).sub(insuranceFee);
        
        // Update loan
        loan.lender = msg.sender;
        loan.fundedAt = block.timestamp;
        loan.dueDate = block.timestamp.add(loan.duration.mul(1 days));
        loan.status = LoanStatus.ACTIVE;
        
        // Update platform metrics
        platformFees = platformFees.add(platformFee);
        insurancePool = insurancePool.add(insuranceFee);
        totalValueLocked = totalValueLocked.add(loan.amount);
        
        // Create repayment schedule
        _createRepaymentSchedule(loanId);
        
        // Transfer funds to borrower
        payable(loan.borrower).transfer(netAmount);
        
        emit LoanFunded(loanId, msg.sender, loan.amount);
    }

    /**
     * @dev Repay a loan
     * @param loanId ID of the loan to repay
     */
    function repayLoan(uint256 loanId) external payable whenNotPaused nonReentrant loanExists(loanId) {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.ACTIVE, "Loan not active");
        require(loan.borrower == msg.sender, "Not the borrower");
        
        uint256 totalOwed = _calculateTotalOwed(loanId);
        require(msg.value >= totalOwed, "Insufficient repayment amount");
        
        // Calculate fees for repayment
        uint256 platformFee = totalOwed.mul(platformFeeRate).div(BASIS_POINTS);
        uint256 insuranceFee = totalOwed.mul(insurancePoolRate).div(BASIS_POINTS);
        uint256 netRepayment = totalOwed.sub(platformFee).sub(insuranceFee);
        
        // Update loan
        loan.repaidAmount = loan.repaidAmount.add(totalOwed);
        loan.status = LoanStatus.REPAID;
        
        // Update platform metrics
        platformFees = platformFees.add(platformFee);
        insurancePool = insurancePool.add(insuranceFee);
        totalValueLocked = totalValueLocked.sub(loan.amount);
        
        // Update reputation
        userReputation[loan.borrower] = userReputation[loan.borrower].add(10);
        userReputation[loan.lender] = userReputation[loan.lender].add(5);
        
        // Transfer funds to lender
        payable(loan.lender).transfer(netRepayment);
        
        // Return excess payment
        if (msg.value > totalOwed) {
            payable(msg.sender).transfer(msg.value.sub(totalOwed));
        }
        
        emit LoanRepaid(loanId, loan.amount, totalOwed.sub(loan.amount), totalOwed);
    }

    /**
     * @dev Deposit collateral for a loan
     * @param loanId ID of the loan
     */
    function depositCollateral(uint256 loanId) external payable whenNotPaused nonReentrant loanExists(loanId) onlyBorrower(loanId) {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.PENDING || loan.status == LoanStatus.ACTIVE, "Invalid loan status");
        require(msg.value > 0, "Amount must be greater than 0");
        
        loan.collateralAmount = loan.collateralAmount.add(msg.value);
        loan.collateralRatio = loan.collateralAmount.mul(BASIS_POINTS).div(loan.amount);
        
        emit CollateralDeposited(loanId, msg.sender, msg.value);
    }

    /**
     * @dev Withdraw excess collateral
     * @param loanId ID of the loan
     * @param amount Amount to withdraw
     */
    function withdrawCollateral(uint256 loanId, uint256 amount) external whenNotPaused nonReentrant loanExists(loanId) onlyBorrower(loanId) {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.REPAID, "Loan must be repaid first");
        require(amount <= loan.collateralAmount, "Insufficient collateral");
        
        loan.collateralAmount = loan.collateralAmount.sub(amount);
        
        payable(msg.sender).transfer(amount);
        
        emit CollateralWithdrawn(loanId, msg.sender, amount);
    }

    /**
     * @dev Create a dispute for a loan
     * @param loanId ID of the loan
     * @param reason Reason for dispute
     * @param description Detailed description
     */
    function createDispute(
        uint256 loanId,
        string memory reason,
        string memory description
    ) external whenNotPaused nonReentrant loanExists(loanId) {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.ACTIVE, "Loan must be active");
        require(msg.sender == loan.borrower || msg.sender == loan.lender, "Not authorized");
        require(!loan.hasDispute, "Dispute already exists");
        
        loan.hasDispute = true;
        loan.status = LoanStatus.DISPUTED;
        
        disputes[loanId] = Dispute({
            initiator: msg.sender,
            respondent: msg.sender == loan.borrower ? loan.lender : loan.borrower,
            reason: reason,
            description: description,
            status: DisputeStatus.OPEN,
            arbitrator: address(0),
            createdAt: block.timestamp,
            resolvedAt: 0,
            decision: 0
        });
        
        emit DisputeCreated(loanId, msg.sender, reason);
    }

    /**
     * @dev Resolve a dispute (only arbitrators)
     * @param loanId ID of the loan
     * @param decision Dispute resolution decision
     * @param reasoning Explanation of the decision
     */
    function resolveDispute(
        uint256 loanId,
        uint8 decision,
        string memory reasoning
    ) external whenNotPaused nonReentrant loanExists(loanId) onlyArbitrator {
        Dispute storage dispute = disputes[loanId];
        require(dispute.status == DisputeStatus.OPEN, "Dispute not open");
        
        dispute.status = DisputeStatus.RESOLVED;
        dispute.arbitrator = msg.sender;
        dispute.resolvedAt = block.timestamp;
        dispute.decision = decision;
        
        // Handle dispute resolution based on decision
        _handleDisputeResolution(loanId, decision);
        
        emit DisputeResolved(loanId, msg.sender, decision);
    }

    /**
     * @dev Mark loan as defaulted
     * @param loanId ID of the loan
     */
    function markDefaulted(uint256 loanId) external whenNotPaused nonReentrant loanExists(loanId) {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.ACTIVE, "Loan not active");
        require(block.timestamp > loan.dueDate, "Loan not yet due");
        
        loan.status = LoanStatus.DEFAULTED;
        totalValueLocked = totalValueLocked.sub(loan.amount);
        
        // Seize collateral and distribute
        if (loan.collateralAmount > 0) {
            uint256 lenderShare = loan.collateralAmount.mul(80).div(100); // 80% to lender
            uint256 platformShare = loan.collateralAmount.mul(20).div(100); // 20% to platform
            
            payable(loan.lender).transfer(lenderShare);
            platformFees = platformFees.add(platformShare);
        }
        
        // Update reputation
        userReputation[loan.borrower] = userReputation[loan.borrower] > 20 ? userReputation[loan.borrower].sub(20) : 0;
        
        emit LoanDefaulted(loanId, loan.borrower, loan.collateralAmount);
    }

    // Internal functions
    function _createRepaymentSchedule(uint256 loanId) internal {
        Loan storage loan = loans[loanId];
        uint256 totalInterest = loan.amount.mul(loan.interestRate).div(BASIS_POINTS).mul(loan.duration).div(365);
        uint256 totalRepayment = loan.amount.add(totalInterest);
        
        // For simplicity, create a single repayment at the end
        // In a real implementation, you might want multiple installments
        repaymentSchedules[loanId].push(RepaymentSchedule({
            dueDate: loan.dueDate,
            amount: totalRepayment,
            paid: false,
            paidAt: 0
        }));
    }

    function _calculateTotalOwed(uint256 loanId) internal view returns (uint256) {
        Loan storage loan = loans[loanId];
        uint256 daysElapsed = block.timestamp.sub(loan.fundedAt).div(1 days);
        uint256 interest = loan.amount.mul(loan.interestRate).div(BASIS_POINTS).mul(daysElapsed).div(365);
        return loan.amount.add(interest);
    }

    function _handleDisputeResolution(uint256 loanId, uint8 decision) internal {
        Loan storage loan = loans[loanId];
        
        if (decision == 0) { // Favor initiator
            // Return funds to initiator
            payable(disputes[loanId].initiator).transfer(loan.amount);
        } else if (decision == 1) { // Favor respondent
            // Continue with normal loan terms
            loan.status = LoanStatus.ACTIVE;
        } else if (decision == 2) { // Partial resolution
            // Split funds between parties
            uint256 halfAmount = loan.amount.div(2);
            payable(disputes[loanId].initiator).transfer(halfAmount);
            payable(disputes[loanId].respondent).transfer(halfAmount);
        }
        // decision == 3 (no fault) - no action needed
    }

    // View functions
    function getLoan(uint256 loanId) external view returns (Loan memory) {
        return loans[loanId];
    }

    function getUserLoans(address user) external view returns (uint256[] memory) {
        return userLoans[user];
    }

    function getUserReputation(address user) external view returns (uint256) {
        return userReputation[user];
    }

    function getRepaymentSchedule(uint256 loanId) external view returns (RepaymentSchedule[] memory) {
        return repaymentSchedules[loanId];
    }

    function getDispute(uint256 loanId) external view returns (Dispute memory) {
        return disputes[loanId];
    }

    function getPlatformMetrics() external view returns (
        uint256 _totalValueLocked,
        uint256 _platformFees,
        uint256 _insurancePool,
        uint256 _totalLoans
    ) {
        return (totalValueLocked, platformFees, insurancePool, nextLoanId - 1);
    }

    // Admin functions
    function setPlatformFeeRate(uint256 newRate) external onlyOwner {
        require(newRate <= 1000, "Fee rate too high"); // Max 10%
        platformFeeRate = newRate;
    }

    function setInsurancePoolRate(uint256 newRate) external onlyOwner {
        require(newRate <= 500, "Insurance rate too high"); // Max 5%
        insurancePoolRate = newRate;
    }

    function addArbitrator(address arbitrator) external onlyOwner {
        authorizedArbitrators[arbitrator] = true;
    }

    function removeArbitrator(address arbitrator) external onlyOwner {
        authorizedArbitrators[arbitrator] = false;
    }

    function withdrawPlatformFees(uint256 amount) external onlyOwner {
        require(amount <= platformFees, "Insufficient platform fees");
        platformFees = platformFees.sub(amount);
        payable(owner()).transfer(amount);
    }

    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Receive function to accept ETH
    receive() external payable {}
}
