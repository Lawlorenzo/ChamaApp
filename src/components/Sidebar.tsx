import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Calendar,
  AlertCircle,
  Pause,
  Play
} from 'lucide-react';
import { useStore } from '../store/useStore';

const Sidebar: React.FC = () => {
  const { currentUser, currentGroup } = useStore();

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/contributions', icon: CreditCard, label: 'Contributions' },
    { to: '/members', icon: Users, label: 'Members' },
    { to: '/schedule', icon: Calendar, label: 'Schedule' },
    { to: '/reports', icon: BarChart3, label: 'Reports' },
  ];

  const adminItems = [
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-sm border-r border-gray-200">
      <div className="p-6">
        {/* Group Status */}
        {currentGroup && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">Group Status</h3>
              {currentGroup.isPaused ? (
                <Pause className="text-warning-500" size={16} />
              ) : (
                <Play className="text-success-500" size={16} />
              )}
            </div>
            <p className="text-sm text-gray-600">
              Daily: {currentGroup.currency} {currentGroup.dailyAmount}
            </p>
            <p className="text-sm text-gray-600">
              Deadline: {currentGroup.deadlineTime}
            </p>
            {currentGroup.isPaused && (
              <div className="mt-2 p-2 bg-warning-50 rounded border-l-4 border-warning-400">
                <p className="text-xs text-warning-800">
                  {currentGroup.pauseReason || 'Group is paused'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}

          {currentUser?.role === 'admin' && (
            <>
              <div className="my-4 border-t border-gray-200"></div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                Admin
              </div>
              {adminItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;