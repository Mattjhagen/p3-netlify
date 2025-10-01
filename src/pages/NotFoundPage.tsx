import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, AlertTriangle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="relative">
              <div className="text-8xl font-bold text-primary-500/20">404</div>
              <AlertTriangle className="h-16 w-16 text-yellow-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-4">
              Page Not Found
            </h1>
            <p className="text-gray-400 text-lg">
              Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="btn btn-primary btn-lg flex items-center justify-center space-x-2"
              >
                <Home className="h-5 w-5" />
                <span>Go Home</span>
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="btn btn-outline btn-lg flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Go Back</span>
              </button>
            </div>

            <div className="pt-4">
              <Link
                to="/dashboard"
                className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center justify-center space-x-1"
              >
                <Search className="h-4 w-4" />
                <span>Or explore our platform</span>
              </Link>
            </div>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 p-6 bg-gray-800/50 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-white mb-3">
              Need Help?
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              If you're having trouble finding what you're looking for, we're here to help.
            </p>
            <div className="space-y-2">
              <Link
                to="/help"
                className="block text-primary-400 hover:text-primary-300 text-sm"
              >
                Visit our Help Center
              </Link>
              <Link
                to="/contact"
                className="block text-primary-400 hover:text-primary-300 text-sm"
              >
                Contact Support
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
