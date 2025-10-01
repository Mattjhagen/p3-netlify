import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Shield, Award } from 'lucide-react';

const ReputationPage: React.FC = () => {
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
            Your Reputation Score
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Build your on-chain reputation through successful transactions and unlock better rates and larger loans.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="card">
              <h2 className="text-2xl font-semibold text-white mb-6">Reputation Overview</h2>
              <div className="text-center mb-8">
                <div className="text-6xl font-bold text-primary-400 mb-2">100</div>
                <div className="text-gray-400">Current Score</div>
                <div className="text-sm text-green-400 mt-2">+5 this week</div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <span className="text-white font-medium">Credit Tier</span>
                    </div>
                    <span className="text-yellow-400 font-semibold">Bronze</span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    Start with micro-loans to build your reputation
                  </div>
                </div>
                
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-green-400" />
                      <span className="text-white font-medium">Loan Limit</span>
                    </div>
                    <span className="text-green-400 font-semibold">0.01 BTC</span>
                  </div>
                  <div className="text-gray-400 text-sm">
                    Maximum unsecured loan amount
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Reputation Factors</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Successful Loans</span>
                  <span className="text-white">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">On-time Payments</span>
                  <span className="text-white">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Reviews Received</span>
                  <span className="text-white">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">KYC Verified</span>
                  <span className="text-white">No</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">How to Improve</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-300 text-sm">Complete KYC verification</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300 text-sm">Repay loans on time</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="text-gray-300 text-sm">Receive positive reviews</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReputationPage;
