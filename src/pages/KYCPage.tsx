import React from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, AlertCircle, Camera } from 'lucide-react';

const KYCPage: React.FC = () => {
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
            Identity Verification (KYC)
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Complete your identity verification to unlock higher loan limits and better rates. Your information is encrypted and secure.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card"
        >
          <div className="space-y-8">
            {/* Status Overview */}
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-2">Not Started</div>
              <div className="text-gray-400">Complete verification to unlock full platform features</div>
            </div>

            {/* Document Upload */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white">Required Documents</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border-2 border-dashed border-gray-600 rounded-lg text-center hover:border-primary-500 transition-colors">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Government ID</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Upload a clear photo of your passport, driver's license, or national ID
                  </p>
                  <button className="btn btn-outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </button>
                </div>

                <div className="p-6 border-2 border-dashed border-gray-600 rounded-lg text-center hover:border-primary-500 transition-colors">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Selfie Verification</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Take a selfie to verify your identity matches your ID
                  </p>
                  <button className="btn btn-outline">
                    <Camera className="h-4 w-4 mr-2" />
                    Take Selfie
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Documents */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Additional Documents (Optional)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Proof of Address</span>
                    <AlertCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-gray-400 text-sm">
                    Utility bill or bank statement (not older than 3 months)
                  </p>
                </div>

                <div className="p-4 border border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Bank Statement</span>
                    <AlertCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-gray-400 text-sm">
                    Recent bank statement for income verification
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Benefits of KYC Verification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Higher loan limits</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Better interest rates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Priority support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Advanced features</span>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Security & Privacy</h3>
              <div className="space-y-2 text-gray-400 text-sm">
                <p>• All documents are encrypted and stored securely</p>
                <p>• We use bank-grade security measures</p>
                <p>• Your data is never shared with third parties</p>
                <p>• Verification typically takes 1-3 business days</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default KYCPage;
