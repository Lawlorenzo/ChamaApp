import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

const Reports: React.FC = () => {
  const { currentGroup, contributions } = useStore();
  const [dateRange, setDateRange] = useState('thisMonth');
  const [reportType, setReportType] = useState('overview');

  if (!currentGroup) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No group selected</h3>
        <p className="text-gray-600">Please select a group to view reports.</p>
      </div>
    );
  }

  // Calculate date range
  const getDateRange = () => {
    const now = new Date();
    switch (dateRange) {
      case 'today':
        return { start: now, end: now };
      case 'thisWeek':
        return { start: subDays(now, 7), end: now };
      case 'thisMonth':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'last30Days':
        return { start: subDays(now, 30), end: now };
      default:
        return { start: startOfMonth(now), end: endOfMonth(now) };
    }
  };

  const { start, end } = getDateRange();

  // Filter contributions by date range
  const filteredContributions = contributions.filter(c => {
    const contributionDate = new Date(c.date);
    return contributionDate >= start && contributionDate <= end && c.groupId === currentGroup.id;
  });

  // Calculate statistics
  const totalCollected = filteredContributions.reduce((sum, c) => sum + c.amount, 0);
  const totalPenalties = filteredContributions.reduce((sum, c) => sum + (c.penaltyAmount || 0), 0);
  const paidContributions = filteredContributions.filter(c => c.status === 'paid').length;
  const lateContributions = filteredContributions.filter(c => c.status === 'late').length;
  const totalContributions = filteredContributions.length;
  const onTimeRate = totalContributions > 0 ? Math.round((paidContributions / totalContributions) * 100) : 0;

  // Member performance
  const memberStats = currentGroup.members.map(member => {
    const memberContributions = filteredContributions.filter(c => c.userId === member.id);
    const totalPaid = memberContributions.reduce((sum, c) => sum + c.amount, 0);
    const onTimePayments = memberContributions.filter(c => c.status === 'paid').length;
    const latePayments = memberContributions.filter(c => c.status === 'late').length;
    const penalties = memberContributions.reduce((sum, c) => sum + (c.penaltyAmount || 0), 0);

    return {
      member,
      totalPaid,
      onTimePayments,
      latePayments,
      penalties,
      totalContributions: memberContributions.length,
      onTimeRate: memberContributions.length > 0 ? Math.round((onTimePayments / memberContributions.length) * 100) : 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">
            Detailed insights for {currentGroup.name}
          </p>
        </div>
        
        <button className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
          <Download size={16} />
          <span>Export Report</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="last30Days">Last 30 Days</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="overview">Overview</option>
              <option value="member">Member Performance</option>
              <option value="financial">Financial Summary</option>
            </select>
          </div>

          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              <p>Period: {format(start, 'MMM d')} - {format(end, 'MMM d, yyyy')}</p>
              <p>Total Records: {filteredContributions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Collected</p>
              <p className="text-2xl font-bold text-success-600">
                KES {totalCollected.toLocaleString()}
              </p>
            </div>
            <div className="bg-success-100 p-3 rounded-lg">
              <DollarSign className="text-success-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Penalties</p>
              <p className="text-2xl font-bold text-danger-600">
                KES {totalPenalties.toLocaleString()}
              </p>
            </div>
            <div className="bg-danger-100 p-3 rounded-lg">
              <TrendingUp className="text-danger-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On-Time Rate</p>
              <p className="text-2xl font-bold text-primary-600">{onTimeRate}%</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-lg">
              <Calendar className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Late Payments</p>
              <p className="text-2xl font-bold text-warning-600">{lateContributions}</p>
            </div>
            <div className="bg-warning-100 p-3 rounded-lg">
              <Users className="text-warning-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Member Performance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Member Performance</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  On Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Late
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Penalties
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  On-Time Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {memberStats.map((stat) => (
                <tr key={stat.member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary-700 font-semibold text-sm">
                          {stat.member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{stat.member.name}</div>
                        <div className="text-sm text-gray-500">{stat.member.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      KES {stat.totalPaid.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-success-600 font-medium">
                      {stat.onTimePayments}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-warning-600 font-medium">
                      {stat.latePayments}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-danger-600 font-medium">
                      KES {stat.penalties.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900 mr-2">
                        {stat.onTimeRate}%
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            stat.onTimeRate >= 80 ? 'bg-success-500' :
                            stat.onTimeRate >= 60 ? 'bg-warning-500' : 'bg-danger-500'
                          }`}
                          style={{ width: `${stat.onTimeRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;