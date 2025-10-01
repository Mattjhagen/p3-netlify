import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Shield, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  Plus,
  Minus,
  Activity,
  PieChart,
  BarChart3
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useLoanStore } from '@/store/loanStore';
import { apiService } from '@/services/api';
import { Loan, PlatformMetrics } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { loans, userLoans, activeLoans, setLoans, setUserLoans, setActiveLoans } = useLoanStore();
  
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBalances, setShowBalances] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load platform metrics
      const metricsResponse = await apiService.getPlatformMetrics();
      if (metricsResponse.success && metricsResponse.data) {
        setMetrics(metricsResponse.data);
      }

      // Load user loans
      const loansResponse = await apiService.getLoans({ 
        borrowerId: user?.id,
        limit: 10 
      });
      if (loansResponse.success && loansResponse.data) {
        setUserLoans(loansResponse.data.data);
      }

      // Load active loans for lending
      const activeLoansResponse = await apiService.getLoans({ 
        status: 'active',
        limit: 10 
      });
      if (activeLoansResponse.success && activeLoansResponse.data) {
        setActiveLoans(activeLoansResponse.data.data);
      }

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const portfolioStats = [
    {
      label: 'Total Portfolio Value',
      value: showBalances ? '$12,450.32' : '••••••',
      change: '+2.4%',
      changeType: 'positive' as const,
      icon: DollarSign
    },
    {
      label: 'Active Loans',
      value: userLoans.filter(loan => loan.status === 'active').length.toString(),
      change: '+1',
      changeType: 'positive' as const,
      icon: Users
    },
    {
      label: 'Reputation Score',
      value: user?.reputationScore.toString() || '0',
      change: '+5',
      changeType: 'positive' as const,
      icon: Shield
    },
    {
      label: 'Total Earned',
      value: showBalances ? '$1,234.56' : '••••••',
      change: '+12.3%',
      changeType: 'positive' as const,
      icon: TrendingUp
    }
  ];

  const recentActivity = [
    {
      type: 'loan_repayment',
      title: 'Loan Repayment Received',
      amount: '+0.05 BTC',
      time: '2 hours ago',
      status: 'success'
    },
    {
      type: 'loan_funded',
      title: 'Loan Funded',
      amount: '-0.1 BTC',
      time: '5 hours ago',
      status: 'success'
    },
    {
      type: 'reputation_update',
      title: 'Reputation Score Updated',
      amount: '+5 points',
      time: '1 day ago',
      status: 'success'
    },
    {
      type: 'kyc_verified',
      title: 'KYC Verification Complete',
      amount: '',
      time: '2 days ago',
      status: 'success'
    }
  ];

  const quickActions = [
    {
      title: 'Lend Bitcoin',
      description: 'Earn interest by lending your Bitcoin',
      icon: Plus,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      action: () => window.location.href = '/lend'
    },
    {
      title: 'Request Loan',
      description: 'Borrow Bitcoin with competitive rates',
      icon: Minus,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      action: () => window.location.href = '/borrow'
    },
    {
      title: 'View Portfolio',
      description: 'Track your lending performance',
      icon: PieChart,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      action: () => window.location.href = '/portfolio'
    },
    {
      title: 'Market Analysis',
      description: 'AI-powered risk insights',
      icon: BarChart3,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      action: () => window.location.href = '/analytics'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {user?.profile?.firstName || 'User'}!
            </h1>
            <p className="text-gray-400 mt-1">
              Here's what's happening with your portfolio today
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowBalances(!showBalances)}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              {showBalances ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
            
            <div className="flex bg-gray-800 rounded-lg p-1">
              {['24h', '7d', '30d', '1y'].map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedTimeframe === timeframe
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Portfolio Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {portfolioStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="card card-hover">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm ${
                    stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.changeType === 'positive' ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={action.title}
                onClick={action.action}
                className="card card-hover text-left group"
              >
                <div className={`p-3 rounded-lg ${action.bgColor} mb-4 w-fit group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-6 w-6 ${action.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {action.description}
                </p>
              </button>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Loans */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Active Loans</h2>
                <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {activeLoans.length > 0 ? (
                  activeLoans.map((loan) => (
                    <div key={loan.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary-500/20 rounded-lg">
                          <DollarSign className="h-5 w-5 text-primary-400" />
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {loan.amount} BTC
                          </div>
                          <div className="text-gray-400 text-sm">
                            {loan.purpose} • {loan.duration} days
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-medium">
                          {loan.interestRate}% APY
                        </div>
                        <div className="text-gray-400 text-sm">
                          {loan.status}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No active loans found</p>
                    <button className="btn btn-primary btn-sm mt-4">
                      Start Lending
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
                <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Activity className="h-4 w-4 text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">
                        {activity.title}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {activity.time}
                      </div>
                    </div>
                    {activity.amount && (
                      <div className="text-green-400 text-sm font-medium">
                        {activity.amount}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Market Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Market Overview</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Updated 2 minutes ago</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {metrics ? `$${(metrics.totalValueLocked / 1000000).toFixed(1)}M` : '$24.5M'}
              </div>
              <div className="text-gray-400 text-sm">Total Value Locked</div>
              <div className="text-green-400 text-xs mt-1">+2.4%</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {metrics ? metrics.totalUsers.toLocaleString() : '12,847'}
              </div>
              <div className="text-gray-400 text-sm">Active Users</div>
              <div className="text-green-400 text-xs mt-1">+156</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {metrics ? `${metrics.averageInterestRate.toFixed(1)}%` : '5.2%'}
              </div>
              <div className="text-gray-400 text-sm">Average APY</div>
              <div className="text-red-400 text-xs mt-1">-0.1%</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
