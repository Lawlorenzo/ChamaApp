import React from 'react';
import { useStore } from '../store/useStore';
import { Calendar, User, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { format, addDays, isToday, isPast, isFuture } from 'date-fns';

const Schedule: React.FC = () => {
  const { currentGroup } = useStore();

  if (!currentGroup) {
    return (
      <div className="text-center py-12">
        <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No group selected</h3>
        <p className="text-gray-600">Please select a group to view the schedule.</p>
      </div>
    );
  }

  // Generate schedule for the next 30 days
  const generateSchedule = () => {
    const schedule = [];
    const startDate = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = addDays(startDate, i);
      const recipientIndex = (currentGroup.currentRecipientIndex + i) % currentGroup.rotationOrder.length;
      const recipientId = currentGroup.rotationOrder[recipientIndex];
      const recipient = currentGroup.members.find(m => m.id === recipientId);
      
      if (recipient) {
        schedule.push({
          date,
          recipient,
          isToday: isToday(date),
          isPast: isPast(date) && !isToday(date),
          isFuture: isFuture(date),
          expectedAmount: currentGroup.dailyAmount * currentGroup.members.length,
        });
      }
    }
    
    return schedule;
  };

  const schedule = generateSchedule();

  const getDateStatus = (date: Date) => {
    if (isToday(date)) return 'today';
    if (isPast(date)) return 'past';
    return 'future';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'today':
        return 'bg-primary-50 border-primary-200 text-primary-900';
      case 'past':
        return 'bg-success-50 border-success-200 text-success-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'today':
        return <Clock className="text-primary-600" size={20} />;
      case 'past':
        return <CheckCircle className="text-success-600" size={20} />;
      default:
        return <ArrowRight className="text-gray-400" size={20} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payout Schedule</h1>
          <p className="text-gray-600 mt-1">
            View the rotation schedule for {currentGroup.name}
          </p>
        </div>
      </div>

      {/* Schedule Info */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="text-primary-600" size={24} />
            </div>
            <p className="text-2xl font-bold text-primary-600">{currentGroup.members.length}</p>
            <p className="text-sm text-gray-600">Total Members</p>
          </div>
          
          <div className="text-center">
            <div className="bg-success-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="text-success-600" size={24} />
            </div>
            <p className="text-2xl font-bold text-success-600">{currentGroup.members.length}</p>
            <p className="text-sm text-gray-600">Days per Cycle</p>
          </div>
          
          <div className="text-center">
            <div className="bg-warning-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="text-warning-600" size={24} />
            </div>
            <p className="text-2xl font-bold text-warning-600">
              KES {currentGroup.dailyAmount * currentGroup.members.length}
            </p>
            <p className="text-sm text-gray-600">Daily Payout</p>
          </div>
        </div>
      </div>

      {/* Schedule List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Schedule</h2>
          <p className="text-sm text-gray-600 mt-1">Next 30 days payout schedule</p>
        </div>

        <div className="divide-y divide-gray-200">
          {schedule.map((item, index) => {
            const status = getDateStatus(item.date);
            
            return (
              <div
                key={index}
                className={`p-6 transition-colors hover:bg-gray-50 ${
                  status === 'today' ? 'bg-primary-50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Date */}
                    <div className={`p-3 rounded-lg border-2 ${getStatusColor(status)}`}>
                      <div className="text-center">
                        <div className="text-lg font-bold">
                          {format(item.date, 'd')}
                        </div>
                        <div className="text-xs uppercase">
                          {format(item.date, 'MMM')}
                        </div>
                      </div>
                    </div>

                    {/* Recipient Info */}
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-700 font-semibold text-sm">
                          {item.recipient.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.recipient.name}</h3>
                        <p className="text-sm text-gray-600">{item.recipient.phone}</p>
                        <p className="text-xs text-gray-500">
                          {format(item.date, 'EEEE, MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Expected Amount */}
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Expected Payout</p>
                      <p className="text-lg font-bold text-gray-900">
                        KES {item.expectedAmount.toLocaleString()}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(status)}
                      {status === 'today' && (
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                          Today
                        </span>
                      )}
                      {status === 'past' && (
                        <span className="px-3 py-1 bg-success-100 text-success-700 text-sm font-medium rounded-full">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-primary-200 rounded"></div>
            <span className="text-sm text-gray-700">Today's recipient</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-success-200 rounded"></div>
            <span className="text-sm text-gray-700">Past recipients</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span className="text-sm text-gray-700">Future recipients</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;