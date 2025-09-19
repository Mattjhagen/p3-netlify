/**
 * P3 Lending Configuration
 * Update these values for your deployment
 */

const CONFIG = {
  // Infura Project ID - Get yours at https://infura.io
  INFURA_PROJECT_ID: '6b945ed6e0494a1c9ce16b118cd60aac',
  
  // WalletConnect Project ID - Get yours at https://cloud.walletconnect.com
  WALLETCONNECT_PROJECT_ID: 'YOUR_WALLETCONNECT_PROJECT_ID',
  
  // RPC Endpoints
  RPC_ENDPOINTS: {
    1: 'https://mainnet.infura.io/v3/6b945ed6e0494a1c9ce16b118cd60aac', // Ethereum Mainnet
    11155111: 'https://sepolia.infura.io/v3/6b945ed6e0494a1c9ce16b118cd60aac', // Ethereum Sepolia
    137: 'https://polygon-rpc.com', // Polygon
    56: 'https://bsc-dataseed.binance.org', // BSC
    42161: 'https://arb1.arbitrum.io/rpc', // Arbitrum
    10: 'https://mainnet.optimism.io', // Optimism
  },
  
  // Default Chain ID
  DEFAULT_CHAIN_ID: 1, // Ethereum Mainnet
  
  // App Information
  APP_NAME: 'P3 Lending',
  APP_DESCRIPTION: 'Decentralized Peer-to-Peer Lending Platform',
  APP_URL: 'https://p3lend.netlify.app',
  APP_LOGO_URL: 'https://p3lend.netlify.app/logo.png',
  
  // Smart Contract Addresses (Update with deployed contracts)
  CONTRACTS: {
    LENDING_POOL: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b8',
    REPUTATION_SYSTEM: '0x8ba1f109551bD432803012645Hac136c4b4d8b8',
    COLLATERAL_MANAGER: '0x9ca1f109551bD432803012645Hac136c4b4d8b8',
    CHARITY_POOL: '0x7ca1f109551bD432803012645Hac136c4b4d8b8'
  },
  
  // Platform Settings
  PLATFORM: {
    MIN_LOAN_AMOUNT: 0.001, // BTC
    MAX_LOAN_AMOUNT: 10, // BTC
    DEFAULT_INTEREST_RATE: 5.2, // %
    PLATFORM_FEE: 0.5, // %
    CHARITY_PERCENTAGE: 2, // % of platform fees
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} else {
  window.CONFIG = CONFIG;
}
