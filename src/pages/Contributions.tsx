import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Calendar, Filter, Download, Search } from 'lucide-react';
import { format, isToday, subDays, startOfWeek, endOfWeek } from 'date-fns';
import ContributionCard from '../components/ContributionCard';

const Contributions: React.FC = () => {
  const { currentGroup, contributions, currentUser } = useStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter contributions based on selected criteria
  const filteredContributions = contributions.filter(contribution => {
    const contributionDate = new Date(contribution.date);
    const isDateMatch = format(contributionDate, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
    const isStatusMatch = filterStatus === 'all' || contribution.status === filterStatus;
    
    let isSearchMatch = true;
    if (searchTerm) {
      const user = currentGroup?.members.find(m => m.id === contribution.userId);
      isSearchMatch = user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    }
    
    return isDateMatch && isStatusMatch && isSearchMatch && contribution.groupId === currentGroup?.id;
  });

  // Get user details for each contribution
  const contributionsWithUsers = filteredContributions.map(contribution => ({
    contribution,
    user: currentGroup?.members.find(m => m.id === contribution.userId)!,
  }));

  // Calculate summary stats for selected date
  const totalCollected = filteredContributions.reduce((sum, c) => sum + c.amount, 0);
  const expectedTotal = (currentGroup?.members.length || 0) * (currentGroup?.dailyAmount || 0);
  const paidCount = filteredContributions.length;
  const pendingCount = (currentGroup?.members.length || 0) - paidCount;

  const quickDateFilters = [
    { label: 'Today', date: new Date() },
    { label: 'Yesterday', date: subDays(new Date(), 1) },
    { label: 'This Week Start', date: startOfWeek(new Date()) },
    { label: 'This Week End', date: endOfWeek(new Date()) },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contributions</h1>
          <p className="text-gray-600 mt-1">
            Track and manage daily contributions for {currentGroup?.name}
          </p>
        </div>
        
        <button className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
          <Download size={16} />
          <span>Export</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="late">Late</option>
              <option value="penalty">With Penalty</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Member
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Filters
            </label>
            <div className="flex flex-wrap gap-1">
              {quickDateFilters.map((filter) => (
                <button
                  key={filter.label}
                  onClick={() => setSelectedDate(filter.date)}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Collected</h3>
          <p className="text-2xl font-bold text-success-600">KES {totalCollected}</p>
          <p className="text-sm text-gray-500">of KES {expectedTotal}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Members Paid</h3>
          <p className="text-2xl font-bold text-primary-600">{paidCount}</p>
          <p className="text-sm text-gray-500">of {currentGroup?.members.length || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Pending</h3>
          <p className="text-2xl font-bold text-warning-600">{pendingCount}</p>
          <p className="text-sm text-gray-500">members</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Collection Rate</h3>
          <p className="text-2xl font-bold text-primary-600">
            {expectedTotal > 0 ? Math.round((totalCollected / expectedTotal) * 100) : 0}%
          </p>
          <p className="text-sm text-gray-500">completion</p>
        </div>
      </div>

      {/* Contributions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Contributions for {format(selectedDate, 'MMMM d, yyyy')}
          </h2>
          {isToday(selectedDate) && (
            <p className="text-sm text-primary-600 mt-1">Today's contributions</p>
          )}
        </div>

        <div className="p-6">
          {contributionsWithUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contributionsWithUsers.map(({ contribution, user }) => (
                <ContributionCard
                  key={contribution.id}
                  contribution={contribution}
                  user={user}
                  expectedAmount={currentGroup?.dailyAmount || 0}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No contributions found</h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? `No contributions found for "${searchTerm}" on ${format(selectedDate, 'MMM d, yyyy')}`
                  : `No contributions recorded for ${format(selectedDate, 'MMM d, yyyy')}`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contributions;