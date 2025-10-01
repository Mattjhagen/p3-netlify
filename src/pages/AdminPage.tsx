import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, DollarSign, AlertTriangle, Settings } from 'lucide-react';

const AdminPage: React.FC = () => {
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
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Manage platform operations, resolve disputes, and monitor system health.
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
              <h2 className="text-2xl font-semibold text-white mb-6">Platform Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <Users className="h-6 w-6 text-blue-400" />
                    <span className="text-white font-medium">Total Users</span>
                  </div>
                  <div className="text-2xl font-bold text-white">12,847</div>
                  <div className="text-green-400 text-sm">+156 this week</div>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <DollarSign className="h-6 w-6 text-green-400" />
                    <span className="text-white font-medium">Total Value Locked</span>
                  </div>
                  <div className="text-2xl font-bold text-white">$24.5M</div>
                  <div className="text-green-400 text-sm">+2.4% this week</div>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <AlertTriangle className="h-6 w-6 text-yellow-400" />
                    <span className="text-white font-medium">Active Disputes</span>
                  </div>
                  <div className="text-2xl font-bold text-white">3</div>
                  <div className="text-yellow-400 text-sm">Requires attention</div>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <Shield className="h-6 w-6 text-purple-400" />
                    <span className="text-white font-medium">Platform Fees</span>
                  </div>
                  <div className="text-2xl font-bold text-white">$45,230</div>
                  <div className="text-green-400 text-sm">This month</div>
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
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full btn btn-primary">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Resolve Disputes
                </button>
                <button className="w-full btn btn-outline">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </button>
                <button className="w-full btn btn-outline">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Withdraw Fees
                </button>
                <button className="w-full btn btn-outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Platform Settings
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">API Status</span>
                  <span className="text-green-400">✓ Online</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Blockchain Sync</span>
                  <span className="text-green-400">✓ Synced</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Database</span>
                  <span className="text-green-400">✓ Healthy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">AI Service</span>
                  <span className="text-green-400">✓ Running</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
