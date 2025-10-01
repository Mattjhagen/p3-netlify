import React from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Bell, Shield, CreditCard } from 'lucide-react';

const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Profile Settings
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Manage your account settings, preferences, and security options.
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
              <h2 className="text-2xl font-semibold text-white mb-6">Personal Information</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">First Name</label>
                    <input type="text" className="input" defaultValue="John" />
                  </div>
                  <div>
                    <label className="label">Last Name</label>
                    <input type="text" className="input" defaultValue="Doe" />
                  </div>
                </div>
                
                <div>
                  <label className="label">Email Address</label>
                  <input type="email" className="input" defaultValue="john.doe@example.com" />
                </div>

                <div>
                  <label className="label">Country</label>
                  <select className="input">
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>

                <div>
                  <label className="label">Bio</label>
                  <textarea
                    className="input h-24 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <button className="btn btn-primary">
                  <User className="h-4 w-4 mr-2" />
                  Update Profile
                </button>
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
              <h3 className="text-lg font-semibold text-white mb-4">Quick Settings</h3>
              <div className="space-y-4">
                <button className="w-full btn btn-outline flex items-center justify-start">
                  <Settings className="h-4 w-4 mr-3" />
                  Account Settings
                </button>
                <button className="w-full btn btn-outline flex items-center justify-start">
                  <Bell className="h-4 w-4 mr-3" />
                  Notifications
                </button>
                <button className="w-full btn btn-outline flex items-center justify-start">
                  <Shield className="h-4 w-4 mr-3" />
                  Security
                </button>
                <button className="w-full btn btn-outline flex items-center justify-start">
                  <CreditCard className="h-4 w-4 mr-3" />
                  Payment Methods
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Email Verified</span>
                  <span className="text-green-400">✓ Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">KYC Status</span>
                  <span className="text-yellow-400">Pending</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">2FA Enabled</span>
                  <span className="text-red-400">✗ Disabled</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Wallet Connected</span>
                  <span className="text-green-400">✓ Connected</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
