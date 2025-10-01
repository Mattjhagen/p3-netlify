import { create } from 'zustand';
import { Loan, Transaction, Review, Dispute } from '@/types';

interface LoanState {
  // State
  loans: Loan[];
  userLoans: Loan[];
  activeLoans: Loan[];
  transactions: Transaction[];
  reviews: Review[];
  disputes: Dispute[];
  isLoading: boolean;
  error: string | null;
  filters: {
    status?: string;
    minAmount?: number;
    maxAmount?: number;
    minInterestRate?: number;
    maxInterestRate?: number;
    purpose?: string;
  };

  // Actions
  setLoans: (loans: Loan[]) => void;
  setUserLoans: (loans: Loan[]) => void;
  setActiveLoans: (loans: Loan[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setReviews: (reviews: Review[]) => void;
  setDisputes: (disputes: Dispute[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<LoanState['filters']>) => void;
  addLoan: (loan: Loan) => void;
  updateLoan: (loanId: string, updates: Partial<Loan>) => void;
  removeLoan: (loanId: string) => void;
  addTransaction: (transaction: Transaction) => void;
  addReview: (review: Review) => void;
  addDispute: (dispute: Dispute) => void;
  updateDispute: (disputeId: string, updates: Partial<Dispute>) => void;
  clearError: () => void;
  reset: () => void;
}

export const useLoanStore = create<LoanState>((set, get) => ({
  // Initial state
  loans: [],
  userLoans: [],
  activeLoans: [],
  transactions: [],
  reviews: [],
  disputes: [],
  isLoading: false,
  error: null,
  filters: {},

  // Actions
  setLoans: (loans: Loan[]) => {
    set({ loans });
  },

  setUserLoans: (loans: Loan[]) => {
    set({ userLoans: loans });
  },

  setActiveLoans: (loans: Loan[]) => {
    set({ activeLoans: loans });
  },

  setTransactions: (transactions: Transaction[]) => {
    set({ transactions });
  },

  setReviews: (reviews: Review[]) => {
    set({ reviews });
  },

  setDisputes: (disputes: Dispute[]) => {
    set({ disputes });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setFilters: (filters: Partial<LoanState['filters']>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  addLoan: (loan: Loan) => {
    set((state) => ({
      loans: [...state.loans, loan],
      userLoans: [...state.userLoans, loan]
    }));
  },

  updateLoan: (loanId: string, updates: Partial<Loan>) => {
    set((state) => ({
      loans: state.loans.map(loan => 
        loan.id === loanId ? { ...loan, ...updates } : loan
      ),
      userLoans: state.userLoans.map(loan => 
        loan.id === loanId ? { ...loan, ...updates } : loan
      ),
      activeLoans: state.activeLoans.map(loan => 
        loan.id === loanId ? { ...loan, ...updates } : loan
      )
    }));
  },

  removeLoan: (loanId: string) => {
    set((state) => ({
      loans: state.loans.filter(loan => loan.id !== loanId),
      userLoans: state.userLoans.filter(loan => loan.id !== loanId),
      activeLoans: state.activeLoans.filter(loan => loan.id !== loanId)
    }));
  },

  addTransaction: (transaction: Transaction) => {
    set((state) => ({
      transactions: [transaction, ...state.transactions]
    }));
  },

  addReview: (review: Review) => {
    set((state) => ({
      reviews: [...state.reviews, review]
    }));
  },

  addDispute: (dispute: Dispute) => {
    set((state) => ({
      disputes: [...state.disputes, dispute]
    }));
  },

  updateDispute: (disputeId: string, updates: Partial<Dispute>) => {
    set((state) => ({
      disputes: state.disputes.map(dispute => 
        dispute.id === disputeId ? { ...dispute, ...updates } : dispute
      )
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({
      loans: [],
      userLoans: [],
      activeLoans: [],
      transactions: [],
      reviews: [],
      disputes: [],
      isLoading: false,
      error: null,
      filters: {}
    });
  }
}));
