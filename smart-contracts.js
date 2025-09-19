/**
 * P3 Lending Smart Contract Integration
 * This file contains the JavaScript functions to interact with the P3 Lending smart contracts
 */

// Smart Contract Addresses (Example addresses - replace with actual deployed contracts)
const CONTRACT_ADDRESSES = {
  LENDING_POOL: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b8',
  REPUTATION_SYSTEM: '0x8ba1f109551bD432803012645Hac136c4b4d8b8',
  COLLATERAL_MANAGER: '0x9ca1f109551bD432803012645Hac136c4b4d8b8',
  CHARITY_POOL: '0x7ca1f109551bD432803012645Hac136c4b4d8b8'
};

// ABI definitions for smart contracts
const LENDING_POOL_ABI = [
  {
    "inputs": [
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "uint256", "name": "duration", "type": "uint256"},
      {"internalType": "uint256", "name": "collateralAmount", "type": "uint256"},
      {"internalType": "string", "name": "purpose", "type": "string"}
    ],
    "name": "createLoanRequest",
    "outputs": [{"internalType": "uint256", "name": "loanId", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "loanId", "type": "uint256"}
    ],
    "name": "fundLoan",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "loanId", "type": "uint256"}
    ],
    "name": "repayLoan",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "loanId", "type": "uint256"}
    ],
    "name": "liquidateCollateral",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "loanId", "type": "uint256"}
    ],
    "name": "getLoanDetails",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "borrower", "type": "address"},
          {"internalType": "address", "name": "lender", "type": "address"},
          {"internalType": "uint256", "name": "amount", "type": "uint256"},
          {"internalType": "uint256", "name": "collateralAmount", "type": "uint256"},
          {"internalType": "uint256", "name": "interestRate", "type": "uint256"},
          {"internalType": "uint256", "name": "duration", "type": "uint256"},
          {"internalType": "uint256", "name": "startTime", "type": "uint256"},
          {"internalType": "enum LoanStatus", "name": "status", "type": "uint8"}
        ],
        "internalType": "struct LoanDetails",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const REPUTATION_SYSTEM_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"}
    ],
    "name": "getReputationScore",
    "outputs": [{"internalType": "uint256", "name": "score", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"},
      {"internalType": "uint256", "name": "loanId", "type": "uint256"},
      {"internalType": "bool", "name": "successful", "type": "bool"}
    ],
    "name": "updateReputation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"}
    ],
    "name": "getReputationHistory",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "score", "type": "uint256"},
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
          {"internalType": "string", "name": "reason", "type": "string"}
        ],
        "internalType": "struct ReputationEvent[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Web3 and contract instances
let web3;
let lendingPoolContract;
let reputationContract;
let userAccount;

/**
 * Initialize Web3 and connect to wallet
 */
async function initializeWeb3() {
  try {
    // Check if Web3 is available
    if (typeof window.ethereum !== 'undefined') {
      web3 = new Web3(window.ethereum);
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      userAccount = accounts[0];
      
      // Initialize contracts
      lendingPoolContract = new web3.eth.Contract(LENDING_POOL_ABI, CONTRACT_ADDRESSES.LENDING_POOL);
      reputationContract = new web3.eth.Contract(REPUTATION_SYSTEM_ABI, CONTRACT_ADDRESSES.REPUTATION_SYSTEM);
      
      console.log('Web3 initialized successfully');
      console.log('Connected account:', userAccount);
      
      return true;
    } else {
      throw new Error('MetaMask or Web3 provider not found');
    }
  } catch (error) {
    console.error('Error initializing Web3:', error);
    return false;
  }
}

/**
 * Create a new loan request
 * @param {Object} loanData - Loan application data
 * @returns {Promise<number>} - Loan ID
 */
async function createLoanRequest(loanData) {
  try {
    const { amount, duration, collateralAmount, purpose } = loanData;
    
    // Convert to Wei (assuming 18 decimals for BTC representation)
    const amountWei = web3.utils.toWei(amount.toString(), 'ether');
    const collateralWei = web3.utils.toWei(collateralAmount.toString(), 'ether');
    
    // Estimate gas
    const gasEstimate = await lendingPoolContract.methods
      .createLoanRequest(amountWei, duration, collateralWei, purpose)
      .estimateGas({ from: userAccount });
    
    // Create loan request
    const result = await lendingPoolContract.methods
      .createLoanRequest(amountWei, duration, collateralWei, purpose)
      .send({
        from: userAccount,
        gas: gasEstimate,
        gasPrice: await web3.eth.getGasPrice()
      });
    
    // Extract loan ID from transaction receipt
    const loanId = result.events.LoanRequestCreated.returnValues.loanId;
    
    console.log('Loan request created successfully:', loanId);
    return loanId;
    
  } catch (error) {
    console.error('Error creating loan request:', error);
    throw error;
  }
}

/**
 * Fund a loan
 * @param {number} loanId - ID of the loan to fund
 * @param {string} amount - Amount to fund in BTC
 */
async function fundLoan(loanId, amount) {
  try {
    const amountWei = web3.utils.toWei(amount.toString(), 'ether');
    
    // Estimate gas
    const gasEstimate = await lendingPoolContract.methods
      .fundLoan(loanId)
      .estimateGas({ from: userAccount, value: amountWei });
    
    // Fund the loan
    const result = await lendingPoolContract.methods
      .fundLoan(loanId)
      .send({
        from: userAccount,
        value: amountWei,
        gas: gasEstimate,
        gasPrice: await web3.eth.getGasPrice()
      });
    
    console.log('Loan funded successfully:', result);
    return result;
    
  } catch (error) {
    console.error('Error funding loan:', error);
    throw error;
  }
}

/**
 * Repay a loan
 * @param {number} loanId - ID of the loan to repay
 * @param {string} amount - Amount to repay in BTC
 */
async function repayLoan(loanId, amount) {
  try {
    const amountWei = web3.utils.toWei(amount.toString(), 'ether');
    
    // Estimate gas
    const gasEstimate = await lendingPoolContract.methods
      .repayLoan(loanId)
      .estimateGas({ from: userAccount, value: amountWei });
    
    // Repay the loan
    const result = await lendingPoolContract.methods
      .repayLoan(loanId)
      .send({
        from: userAccount,
        value: amountWei,
        gas: gasEstimate,
        gasPrice: await web3.eth.getGasPrice()
      });
    
    // Update reputation after successful repayment
    await updateUserReputation(userAccount, loanId, true);
    
    console.log('Loan repaid successfully:', result);
    return result;
    
  } catch (error) {
    console.error('Error repaying loan:', error);
    throw error;
  }
}

/**
 * Get user's reputation score
 * @param {string} userAddress - User's wallet address
 * @returns {Promise<number>} - Reputation score (0-100)
 */
async function getReputationScore(userAddress = userAccount) {
  try {
    const score = await reputationContract.methods
      .getReputationScore(userAddress)
      .call();
    
    return parseInt(score);
  } catch (error) {
    console.error('Error getting reputation score:', error);
    return 0;
  }
}

/**
 * Update user reputation after loan completion
 * @param {string} userAddress - User's wallet address
 * @param {number} loanId - ID of the completed loan
 * @param {boolean} successful - Whether the loan was successful
 */
async function updateUserReputation(userAddress, loanId, successful) {
  try {
    const gasEstimate = await reputationContract.methods
      .updateReputation(userAddress, loanId, successful)
      .estimateGas({ from: userAccount });
    
    const result = await reputationContract.methods
      .updateReputation(userAddress, loanId, successful)
      .send({
        from: userAccount,
        gas: gasEstimate,
        gasPrice: await web3.eth.getGasPrice()
      });
    
    console.log('Reputation updated successfully:', result);
    return result;
    
  } catch (error) {
    console.error('Error updating reputation:', error);
    throw error;
  }
}

/**
 * Get loan details
 * @param {number} loanId - ID of the loan
 * @returns {Promise<Object>} - Loan details
 */
async function getLoanDetails(loanId) {
  try {
    const loanDetails = await lendingPoolContract.methods
      .getLoanDetails(loanId)
      .call();
    
    return {
      borrower: loanDetails.borrower,
      lender: loanDetails.lender,
      amount: web3.utils.fromWei(loanDetails.amount, 'ether'),
      collateralAmount: web3.utils.fromWei(loanDetails.collateralAmount, 'ether'),
      interestRate: loanDetails.interestRate,
      duration: loanDetails.duration,
      startTime: new Date(loanDetails.startTime * 1000),
      status: loanDetails.status
    };
  } catch (error) {
    console.error('Error getting loan details:', error);
    throw error;
  }
}

/**
 * Get user's reputation history
 * @param {string} userAddress - User's wallet address
 * @returns {Promise<Array>} - Array of reputation events
 */
async function getReputationHistory(userAddress = userAccount) {
  try {
    const history = await reputationContract.methods
      .getReputationHistory(userAddress)
      .call();
    
    return history.map(event => ({
      score: parseInt(event.score),
      timestamp: new Date(event.timestamp * 1000),
      reason: event.reason
    }));
  } catch (error) {
    console.error('Error getting reputation history:', error);
    return [];
  }
}

/**
 * Calculate loan interest based on reputation and amount
 * @param {number} reputationScore - User's reputation score
 * @param {number} loanAmount - Loan amount in BTC
 * @param {number} duration - Loan duration in months
 * @returns {number} - Interest rate percentage
 */
function calculateInterestRate(reputationScore, loanAmount, duration) {
  let baseRate = 5.2; // Base rate for lowest reputation
  
  // Adjust based on reputation score
  if (reputationScore >= 90) baseRate = 3.5;
  else if (reputationScore >= 80) baseRate = 4.2;
  else if (reputationScore >= 70) baseRate = 4.8;
  else if (reputationScore >= 60) baseRate = 5.0;
  
  // Adjust based on loan amount (larger loans get better rates)
  if (loanAmount >= 2.0) baseRate -= 0.5;
  else if (loanAmount >= 1.0) baseRate -= 0.3;
  else if (loanAmount >= 0.5) baseRate -= 0.1;
  
  // Adjust based on duration (longer loans get slightly higher rates)
  if (duration >= 18) baseRate += 0.2;
  else if (duration >= 12) baseRate += 0.1;
  
  return Math.max(baseRate, 2.0); // Minimum 2% interest rate
}

/**
 * Calculate monthly payment for a loan
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (as decimal)
 * @param {number} months - Loan duration in months
 * @returns {number} - Monthly payment amount
 */
function calculateMonthlyPayment(principal, annualRate, months) {
  const monthlyRate = annualRate / 12;
  if (monthlyRate === 0) return principal / months;
  
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
         (Math.pow(1 + monthlyRate, months) - 1);
}

/**
 * Liquidate collateral for defaulted loan
 * @param {number} loanId - ID of the loan to liquidate
 */
async function liquidateCollateral(loanId) {
  try {
    const gasEstimate = await lendingPoolContract.methods
      .liquidateCollateral(loanId)
      .estimateGas({ from: userAccount });
    
    const result = await lendingPoolContract.methods
      .liquidateCollateral(loanId)
      .send({
        from: userAccount,
        gas: gasEstimate,
        gasPrice: await web3.eth.getGasPrice()
      });
    
    console.log('Collateral liquidated successfully:', result);
    return result;
    
  } catch (error) {
    console.error('Error liquidating collateral:', error);
    throw error;
  }
}

/**
 * Get platform statistics
 * @returns {Promise<Object>} - Platform statistics
 */
async function getPlatformStats() {
  try {
    // This would typically come from a separate contract or API
    // For now, return mock data
    return {
      totalValueLocked: '24.5', // BTC
      activeUsers: 12847,
      repaymentRate: 98.7, // percentage
      averageAPY: 5.2 // percentage
    };
  } catch (error) {
    console.error('Error getting platform stats:', error);
    return null;
  }
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeWeb3,
    createLoanRequest,
    fundLoan,
    repayLoan,
    getReputationScore,
    updateUserReputation,
    getLoanDetails,
    getReputationHistory,
    calculateInterestRate,
    calculateMonthlyPayment,
    liquidateCollateral,
    getPlatformStats
  };
}
