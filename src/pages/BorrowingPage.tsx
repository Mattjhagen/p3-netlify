import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Calculator, FileText, Clock } from 'lucide-react';

const BorrowingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Borrow Bitcoin with Competitive Rates
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Get the Bitcoin you need with our reputation-based lending system. Start with micro-loans to build your credit score.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Loan Request Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="card">
              <h2 className="text-2xl font-semibold text-white mb-6">Request a Loan</h2>
              <div className="space-y-6">
                <div>
                  <label className="label">Loan Amount (BTC)</label>
                  <input
                    type="number"
                    step="0.001"
                    className="input"
                    placeholder="0.001"
                  />
                </div>
                
                <div>
                  <label className="label">Loan Purpose</label>
                  <select className="input">
                    <option value="">Select purpose</option>
                    <option value="business">Business</option>
                    <option value="personal">Personal</option>
                    <option value="investment">Investment</option>
                    <option value="education">Education</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="label">Loan Duration (days)</label>
                  <input
                    type="number"
                    className="input"
                    placeholder="30"
                  />
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    className="input h-24 resize-none"
                    placeholder="Tell lenders about your loan purpose..."
                  />
                </div>

                <button className="w-full btn btn-primary btn-lg">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Submit Loan Request
                </button>
              </div>
            </div>
          </motion.div>

          {/* Loan Calculator & Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Loan Calculator</h3>
              <div className="space-y-4">
                <div>
                  <label className="label">Amount: 0.1 BTC</label>
                  <label className="label">Duration: 30 days</label>
                  <label className="label">Interest Rate: 5.2% APY</label>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Monthly Payment</span>
                    <span className="text-white">0.1004 BTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Interest</span>
                    <span className="text-white">0.0004 BTC</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Your Borrowing Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Reputation Score</span>
                  <span className="text-white">100/1000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Credit Tier</span>
                  <span className="text-white">Bronze</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Max Loan Amount</span>
                  <span className="text-white">0.01 BTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Loans</span>
                  <span className="text-white">0</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full btn btn-outline">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Loan
                </button>
                <button className="w-full btn btn-outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Requirements
                </button>
                <button className="w-full btn btn-outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Loan History
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BorrowingPage;
