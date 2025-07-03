import React from 'react';
import { useStore } from '../store/useStore';
import { Users, Phone, Mail, Calendar, Crown, User } from 'lucide-react';
import { format } from 'date-fns';

const Members: React.FC = () => {
  const { currentGroup, currentUser } = useStore();

  if (!currentGroup) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No group selected</h3>
        <p className="text-gray-600">Please select a group to view members.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-600 mt-1">
            Manage members of {currentGroup.name}
          </p>
        </div>
        
        {currentUser?.role === 'admin' && (
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
            Add Member
          </button>
        )}
      </div>

      {/* Group Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{currentGroup.members.length}</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-lg">
              <Users className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Members</p>
              <p className="text-2xl font-bold text-success-600">
                {currentGroup.members.filter(m => m.isActive).length}
              </p>
            </div>
            <div className="bg-success-100 p-3 rounded-lg">
              <User className="text-success-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-warning-600">
                {currentGroup.members.filter(m => m.role === 'admin').length}
              </p>
            </div>
            <div className="bg-warning-100 p-3 rounded-lg">
              <Crown className="text-warning-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Members</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {currentGroup.members.map((member, index) => (
            <div key={member.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-semibold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    {member.role === 'admin' && (
                      <div className="absolute -top-1 -right-1 bg-warning-500 rounded-full p-1">
                        <Crown className="text-white" size={12} />
                      </div>
                    )}
                  </div>

                  {/* Member Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      {member.id === currentUser?.id && (
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                          You
                        </span>
                      )}
                      {!member.isActive && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Mail size={14} />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone size={14} />
                        <span>{member.phone}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 mt-1 text-sm text-gray-500">
                      <Calendar size={14} />
                      <span>Joined {format(member.joinedAt, 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>

                {/* Member Position in Rotation */}
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Rotation Position</div>
                  <div className="text-lg font-bold text-primary-600">
                    #{currentGroup.rotationOrder.indexOf(member.id) + 1}
                  </div>
                  {currentGroup.rotationOrder[currentGroup.currentRecipientIndex] === member.id && (
                    <div className="text-xs bg-success-100 text-success-700 px-2 py-1 rounded-full mt-1">
                      Current Recipient
                    </div>
                  )}
                </div>

                {/* Actions */}
                {currentUser?.role === 'admin' && member.id !== currentUser.id && (
                  <div className="ml-4">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Members;