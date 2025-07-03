import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Settings as SettingsIcon, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  Users,
  Save,
  Pause,
  Play
} from 'lucide-react';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const { currentGroup, currentUser, updateGroupSettings, pauseGroup, resumeGroup } = useStore();
  const [formData, setFormData] = useState({
    name: currentGroup?.name || '',
    description: currentGroup?.description || '',
    dailyAmount: currentGroup?.dailyAmount || 0,
    deadlineTime: currentGroup?.deadlineTime || '20:00',
    penaltyAmount: currentGroup?.penaltyAmount || 0,
  });
  const [pauseReason, setPauseReason] = useState('');
  const [showPauseModal, setShowPauseModal] = useState(false);

  if (currentUser?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto text-warning-500 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
        <p className="text-gray-600">Only group administrators can access settings.</p>
      </div>
    );
  }

  if (!currentGroup) {
    return (
      <div className="text-center py-12">
        <SettingsIcon className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No group selected</h3>
        <p className="text-gray-600">Please select a group to manage settings.</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateGroupSettings(currentGroup.id, {
      name: formData.name,
      description: formData.description,
      dailyAmount: formData.dailyAmount,
      deadlineTime: formData.deadlineTime,
      penaltyAmount: formData.penaltyAmount,
    });
    
    toast.success('Group settings updated successfully!');
  };

  const handlePauseGroup = () => {
    if (!pauseReason.trim()) {
      toast.error('Please provide a reason for pausing the group');
      return;
    }
    
    pauseGroup(currentGroup.id, pauseReason);
    setShowPauseModal(false);
    setPauseReason('');
    toast.success('Group has been paused');
  };

  const handleResumeGroup = () => {
    resumeGroup(currentGroup.id);
    toast.success('Group has been resumed');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Group Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage settings for {currentGroup.name}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {currentGroup.isPaused ? (
            <button
              onClick={handleResumeGroup}
              className="flex items-center space-x-2 bg-success-600 text-white px-4 py-2 rounded-lg hover:bg-success-700 transition-colors"
            >
              <Play size={16} />
              <span>Resume Group</span>
            </button>
          ) : (
            <button
              onClick={() => setShowPauseModal(true)}
              className="flex items-center space-x-2 bg-warning-600 text-white px-4 py-2 rounded-lg hover:bg-warning-700 transition-colors"
            >
              <Pause size={16} />
              <span>Pause Group</span>
            </button>
          )}
        </div>
      </div>

      {/* Group Status */}
      {currentGroup.isPaused && (
        <div className="bg-warning-50 border border-warning-200 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Pause className="text-warning-600" size={20} />
            <h3 className="font-medium text-warning-800">Group is Paused</h3>
          </div>
          <p className="text-warning-700 mt-1">
            Reason: {currentGroup.pauseReason || 'No reason provided'}
          </p>
        </div>
      )}

      {/* Settings Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Basic Settings</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Daily Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline mr-1" size={16} />
                Daily Contribution Amount (KES)
              </label>
              <input
                type="number"
                value={formData.dailyAmount}
                onChange={(e) => setFormData({ ...formData, dailyAmount: Number(e.target.value) })}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertTriangle className="inline mr-1" size={16} />
                Penalty Amount (KES)
              </label>
              <input
                type="number"
                value={formData.penaltyAmount}
                onChange={(e) => setFormData({ ...formData, penaltyAmount: Number(e.target.value) })}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Deadline Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline mr-1" size={16} />
              Daily Deadline Time
            </label>
            <input
              type="time"
              value={formData.deadlineTime}
              onChange={(e) => setFormData({ ...formData, deadlineTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Members will be reminded 1 hour before this time
            </p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Group Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Group Statistics</h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="text-primary-600" size={24} />
              </div>
              <p className="text-2xl font-bold text-primary-600">{currentGroup.members.length}</p>
              <p className="text-sm text-gray-600">Total Members</p>
            </div>
            
            <div className="text-center">
              <div className="bg-success-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="text-success-600" size={24} />
              </div>
              <p className="text-2xl font-bold text-success-600">
                KES {(currentGroup.dailyAmount * currentGroup.members.length).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Daily Pool</p>
            </div>
            
            <div className="text-center">
              <div className="bg-warning-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="text-warning-600" size={24} />
              </div>
              <p className="text-2xl font-bold text-warning-600">{currentGroup.members.length}</p>
              <p className="text-sm text-gray-600">Days per Cycle</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pause Modal */}
      {showPauseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pause Group</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for pausing the group contributions:
            </p>
            <textarea
              value={pauseReason}
              onChange={(e) => setPauseReason(e.target.value)}
              placeholder="e.g., Holiday break, Emergency, etc."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-4"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPauseModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePauseGroup}
                className="flex-1 px-4 py-2 bg-warning-600 text-white rounded-lg hover:bg-warning-700 transition-colors"
              >
                Pause Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;