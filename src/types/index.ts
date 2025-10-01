// Core platform types for P³ Lending Platform

export interface User {
  id: string;
  walletAddress: string;
  email?: string;
  reputationScore: number;
  kycStatus: KYCStatus;
  profile: UserProfile;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  totalLent: number;
  totalBorrowed: number;
  successfulLoans: number;
  defaultedLoans: number;
  averageRepaymentTime: number;
  riskLevel: RiskLevel;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  country: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  socialLinks?: SocialLinks;
  preferences: UserPreferences;
}

export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface UserPreferences {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  language: string;
  currency: string;
  theme: 'light' | 'dark';
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  loanUpdates: boolean;
  reputationChanges: boolean;
  marketAlerts: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  transactionHistory: 'public' | 'private';
  reputationScore: 'public' | 'private';
}

export enum KYCStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  NOT_STARTED = 'not_started'
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

export interface Loan {
  id: string;
  borrowerId: string;
  lenderId?: string;
  amount: number; // in BTC
  interestRate: number; // APY percentage
  duration: number; // in days
  collateralAmount?: number; // in BTC
  collateralRatio?: number; // percentage
  status: LoanStatus;
  purpose: LoanPurpose;
  description: string;
  createdAt: Date;
  fundedAt?: Date;
  dueDate?: Date;
  repaidAt?: Date;
  defaultedAt?: Date;
  smartContractAddress?: string;
  transactionHash?: string;
  repaymentSchedule: RepaymentSchedule[];
  riskAssessment: RiskAssessment;
  borrowerProfile: UserProfile;
  lenderProfile?: UserProfile;
  reviews: Review[];
  disputes: Dispute[];
}

export enum LoanStatus {
  PENDING = 'pending',
  FUNDED = 'funded',
  ACTIVE = 'active',
  REPAID = 'repaid',
  DEFAULTED = 'defaulted',
  CANCELLED = 'cancelled',
  DISPUTED = 'disputed'
}

export enum LoanPurpose {
  BUSINESS = 'business',
  PERSONAL = 'personal',
  INVESTMENT = 'investment',
  EDUCATION = 'education',
  MEDICAL = 'medical',
  EMERGENCY = 'emergency',
  DEBT_CONSOLIDATION = 'debt_consolidation',
  HOME_IMPROVEMENT = 'home_improvement',
  OTHER = 'other'
}

export interface RepaymentSchedule {
  id: string;
  loanId: string;
  dueDate: Date;
  amount: number;
  principal: number;
  interest: number;
  status: RepaymentStatus;
  paidAt?: Date;
  transactionHash?: string;
}

export enum RepaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  PARTIAL = 'partial'
}

export interface RiskAssessment {
  score: number; // 0-100
  level: RiskLevel;
  factors: RiskFactor[];
  aiAnalysis: AIAnalysis;
  blockchainAnalysis: BlockchainAnalysis;
  marketAnalysis: MarketAnalysis;
  lastUpdated: Date;
}

export interface RiskFactor {
  type: RiskFactorType;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number; // 0-1
  description: string;
  source: string;
}

export enum RiskFactorType {
  REPUTATION = 'reputation',
  COLLATERAL = 'collateral',
  MARKET_VOLATILITY = 'market_volatility',
  BORROWER_HISTORY = 'borrower_history',
  LOAN_AMOUNT = 'loan_amount',
  DURATION = 'duration',
  PURPOSE = 'purpose',
  EXTERNAL_FACTORS = 'external_factors'
}

export interface AIAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number; // 0-1
  keyInsights: string[];
  recommendations: string[];
  newsImpact: NewsImpact[];
  socialSentiment: SocialSentiment;
}

export interface NewsImpact {
  source: string;
  headline: string;
  impact: 'positive' | 'negative' | 'neutral';
  relevance: number; // 0-1
  publishedAt: Date;
}

export interface SocialSentiment {
  twitter: SentimentData;
  reddit: SentimentData;
  telegram: SentimentData;
  overall: SentimentData;
}

export interface SentimentData {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number; // -1 to 1
  volume: number;
  lastUpdated: Date;
}

export interface BlockchainAnalysis {
  addressActivity: AddressActivity;
  transactionPatterns: TransactionPattern[];
  networkHealth: NetworkHealth;
  feeAnalysis: FeeAnalysis;
}

export interface AddressActivity {
  totalTransactions: number;
  averageTransactionSize: number;
  frequency: 'low' | 'medium' | 'high';
  lastActivity: Date;
  suspiciousActivity: boolean;
}

export interface TransactionPattern {
  type: 'incoming' | 'outgoing' | 'internal';
  frequency: number;
  averageAmount: number;
  timePattern: string;
  riskScore: number;
}

export interface NetworkHealth {
  hashRate: number;
  difficulty: number;
  mempoolSize: number;
  averageFee: number;
  congestionLevel: 'low' | 'medium' | 'high';
}

export interface FeeAnalysis {
  currentFee: number;
  recommendedFee: number;
  priority: 'low' | 'medium' | 'high';
  estimatedConfirmationTime: number; // in minutes
}

export interface MarketAnalysis {
  bitcoinPrice: number;
  priceChange24h: number;
  volatility: number;
  marketCap: number;
  volume24h: number;
  fearGreedIndex: number;
  correlationAnalysis: CorrelationData[];
}

export interface CorrelationData {
  asset: string;
  correlation: number; // -1 to 1
  significance: number; // 0-1
}

export interface Review {
  id: string;
  loanId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number; // 1-5
  comment: string;
  type: 'lender' | 'borrower';
  createdAt: Date;
  helpful: number;
  reported: boolean;
}

export interface Dispute {
  id: string;
  loanId: string;
  initiatorId: string;
  respondentId: string;
  reason: DisputeReason;
  description: string;
  status: DisputeStatus;
  evidence: Evidence[];
  resolution?: DisputeResolution;
  createdAt: Date;
  resolvedAt?: Date;
  arbitratorId?: string;
}

export enum DisputeReason {
  NON_PAYMENT = 'non_payment',
  LATE_PAYMENT = 'late_payment',
  TERMS_VIOLATION = 'terms_violation',
  FRAUD = 'fraud',
  MISREPRESENTATION = 'misrepresentation',
  TECHNICAL_ISSUE = 'technical_issue',
  OTHER = 'other'
}

export enum DisputeStatus {
  OPEN = 'open',
  UNDER_REVIEW = 'under_review',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  ESCALATED = 'escalated'
}

export interface Evidence {
  id: string;
  type: 'document' | 'screenshot' | 'transaction' | 'communication';
  url: string;
  description: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface DisputeResolution {
  decision: 'favor_initiator' | 'favor_respondent' | 'partial' | 'no_fault';
  amount: number;
  reasoning: string;
  arbitratorId: string;
  resolvedAt: Date;
}

export interface SmartContract {
  address: string;
  type: ContractType;
  version: string;
  deployedAt: Date;
  abi: any;
  bytecode: string;
  gasEstimate: number;
  isVerified: boolean;
}

export enum ContractType {
  LOAN_ESCROW = 'loan_escrow',
  REPUTATION = 'reputation',
  INSURANCE = 'insurance',
  GOVERNANCE = 'governance',
  ORACLE = 'oracle'
}

export interface PlatformMetrics {
  totalValueLocked: number;
  totalLoans: number;
  activeLoans: number;
  averageInterestRate: number;
  defaultRate: number;
  totalUsers: number;
  newUsersToday: number;
  platformRevenue: number;
  insurancePool: number;
  lastUpdated: Date;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  fromAddress: string;
  toAddress: string;
  amount: number;
  currency: 'BTC' | 'USD' | 'ETH';
  status: TransactionStatus;
  hash?: string;
  blockNumber?: number;
  gasUsed?: number;
  gasPrice?: number;
  createdAt: Date;
  confirmedAt?: Date;
  metadata?: any;
}

export enum TransactionType {
  LOAN_FUNDING = 'loan_funding',
  LOAN_REPAYMENT = 'loan_repayment',
  COLLATERAL_DEPOSIT = 'collateral_deposit',
  COLLATERAL_WITHDRAWAL = 'collateral_withdrawal',
  PLATFORM_FEE = 'platform_fee',
  INSURANCE_PAYOUT = 'insurance_payout',
  ARBITRATION_FEE = 'arbitration_fee',
  REFERRAL_BONUS = 'referral_bonus'
}

export enum TransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Web3Config {
  networkId: number;
  rpcUrl: string;
  chainId: number;
  blockExplorer: string;
  contracts: {
    loanEscrow: string;
    reputation: string;
    insurance: string;
    governance: string;
  };
}

export interface WalletConnection {
  address: string;
  chainId: number;
  isConnected: boolean;
  provider: any;
  signer?: any;
}

export interface KYCDocument {
  id: string;
  userId: string;
  type: DocumentType;
  status: DocumentStatus;
  url: string;
  metadata: DocumentMetadata;
  uploadedAt: Date;
  verifiedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
}

export enum DocumentType {
  PASSPORT = 'passport',
  DRIVERS_LICENSE = 'drivers_license',
  NATIONAL_ID = 'national_id',
  UTILITY_BILL = 'utility_bill',
  BANK_STATEMENT = 'bank_statement',
  PROOF_OF_ADDRESS = 'proof_of_address',
  SELFIE = 'selfie',
  VIDEO_VERIFICATION = 'video_verification'
}

export enum DocumentStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export interface DocumentMetadata {
  fileName: string;
  fileSize: number;
  mimeType: string;
  checksum: string;
  extractedData?: any;
}

// Event types for real-time updates
export interface PlatformEvent {
  type: EventType;
  data: any;
  timestamp: Date;
  userId?: string;
}

export enum EventType {
  LOAN_CREATED = 'loan_created',
  LOAN_FUNDED = 'loan_funded',
  LOAN_REPAID = 'loan_repaid',
  LOAN_DEFAULTED = 'loan_defaulted',
  REPUTATION_UPDATED = 'reputation_updated',
  DISPUTE_CREATED = 'dispute_created',
  DISPUTE_RESOLVED = 'dispute_resolved',
  USER_REGISTERED = 'user_registered',
  KYC_VERIFIED = 'kyc_verified',
  MARKET_ALERT = 'market_alert'
}
