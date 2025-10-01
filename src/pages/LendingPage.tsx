import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Shield, Clock } from 'lucide-react';

const LendingPage: React.FC = () => {
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
            Lend Bitcoin & Earn Interest
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Start earning competitive returns by lending your Bitcoin to verified borrowers with our AI-powered risk assessment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lending Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="card">
              <h2 className="text-2xl font-semibold text-white mb-6">Lending Opportunities</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-6 w-6 text-green-400" />
                      <span className="text-white font-medium">0.5 BTC Loan Request</span>
                    </div>
                    <span className="text-green-400 font-semibold">4.8% APY</span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    Business loan • 6 months • High reputation borrower
                  </div>
                </div>
                
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-6 w-6 text-blue-400" />
                      <span className="text-white font-medium">0.25 BTC Loan Request</span>
                    </div>
                    <span className="text-blue-400 font-semibold">5.5% APY</span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    Personal loan • 3 months • Verified borrower
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full btn btn-primary">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Start Lending
                </button>
                <button className="w-full btn btn-outline">
                  <Shield className="h-4 w-4 mr-2" />
                  View Risk Analysis
                </button>
                <button className="w-full btn btn-outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Auto-Lend Settings
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Your Lending Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Lent</span>
                  <span className="text-white">0.0 BTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Loans</span>
                  <span className="text-white">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Earned</span>
                  <span className="text-white">0.0 BTC</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LendingPage;
