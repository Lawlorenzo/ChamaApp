import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { 
  Users, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  TrendingUp,
  Pause,
  Play
} from 'lucide-react';
import { format, isToday, addDays } from 'date-fns';
import PaymentModal from '../components/PaymentModal';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { 
    currentUser, 
    currentGroup, 
    contributions, 
    addContribution,
    addNotification,
    pauseGroup,
    resumeGroup
  } = useStore();
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [timeUntilDeadline, setTimeUntilDeadline] = useState('');

  // Calculate today's recipient
  const getTodaysRecipient = () => {
    if (!currentGroup) return null;
    const recipientId = currentGroup.rotationOrder[currentGroup.currentRecipientIndex];
    return currentGroup.members.find(m => m.id === recipientId);
  };

  // Calculate contribution stats
  const todaysContributions = contributions.filter(c => 
    isToday(c.date) && c.groupId === currentGroup?.id
  );

  const myTodayContribution = todaysContributions.find(c => c.userId === currentUser?.id);
  const totalCollected = todaysContributions.reduce((sum, c) => sum + c.amount, 0);
  const expectedTotal = (currentGroup?.members.length || 0) * (currentGroup?.dailyAmount || 0);
  const paidMembers = todaysContributions.length;
  const pendingMembers = (currentGroup?.members.length || 0) - paidMembers;

  // Update countdown timer
  useEffect(() => {
    if (!currentGroup) return;

    const updateTimer = () => {
      const now = new Date();
      const [hours, minutes] = currentGroup.deadlineTime.split(':').map(Number);
      const deadline = new Date();
      deadline.setHours(hours, minutes, 0, 0);
      
      if (deadline < now) {
        deadline.setDate(deadline.getDate() + 1);
      }

      const diff = deadline.getTime() - now.getTime();
      const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
      const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeUntilDeadline(`${hoursLeft}h ${minutesLeft}m`);

      // Send reminder notification 1 hour before deadline
      if (hoursLeft === 1 && minutesLeft === 0 && !myTodayContribution) {
        addNotification({
          userId: currentUser?.id || '',
          groupId: currentGroup.id,
          type: 'reminder',
          title: 'Contribution Reminder',
          message: `Don't forget to make your daily contribution of KES ${currentGroup.dailyAmount}. Deadline is at ${currentGroup.deadlineTime}.`,
          isRead: false,
          createdAt: new Date(),
        });
        toast('⏰ Contribution reminder: 1 hour left!', {
          duration: 6000,
          style: {
            background: '#f59e0b',
            color: '#fff',
          },
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [currentGroup, myTodayContribution, currentUser, addNotification]);

  const handlePayment = (paymentMethod: string, transactionId: string) => {
    if (!currentUser || !currentGroup) return;

    const now = new Date();
    const [hours, minutes] = currentGroup.deadlineTime.split(':').map(Number);
    const deadline = new Date();
    deadline.setHours(hours, minutes, 0, 0);

    let status: 'paid' | 'late' = 'paid';
    let penaltyAmount = 0;

    if (now > deadline) {
      status = 'late';
      penaltyAmount = currentGroup.penaltyAmount;
    }

    addContribution({
      userId: currentUser.id,
      groupId: currentGroup.id,
      amount: currentGroup.dailyAmount + penaltyAmount,
      date: new Date(),
      status,
      paymentMethod,
      transactionId,
      paidAt: new Date(),
      penaltyAmount: penaltyAmount > 0 ? penaltyAmount : undefined,
    });

    addNotification({
      userId: currentUser.id,
      groupId: currentGroup.id,
      type: 'system',
      title: 'Payment Confirmed',
      message: `Your contribution of KES ${currentGroup.dailyAmount}${penaltyAmount > 0 ? ` + KES ${penaltyAmount} penalty` : ''} has been recorded.`,
      isRead: false,
      createdAt: new Date(),
    });
  };

  const handlePauseResume = () => {
    if (!currentGroup || currentUser?.role !== 'admin') return;

    if (currentGroup.isPaused) {
      resumeGroup(currentGroup.id);
      toast.success('Group contributions resumed');
    } else {
      const reason = prompt('Enter reason for pausing contributions:');
      if (reason) {
        pauseGroup(currentGroup.id, reason);
        toast.success('Group contributions paused');
      }
    }
  };

  const todaysRecipient = getTodaysRecipient();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {currentUser?.name}! Here's your group overview.
          </p>
        </div>
        
        {currentUser?.role === 'admin' && (
          <button
            onClick={handlePauseResume}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentGroup?.isPaused
                ? 'bg-success-100 text-success-700 hover:bg-success-200'
                : 'bg-warning-100 text-warning-700 hover:bg-warning-200'
            }`}
          >
            {currentGroup?.isPaused ? <Play size={16} /> : <Pause size={16} />}
            <span>{currentGroup?.isPaused ? 'Resume' : 'Pause'} Group</span>
          </button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{currentGroup?.members.length || 0}</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-lg">
              <Users className="text-primary-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Daily Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                KES {currentGroup?.dailyAmount || 0}
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
              <p className="text-sm font-medium text-gray-600">Time Left</p>
              <p className="text-2xl font-bold text-gray-900">{timeUntilDeadline}</p>
            </div>
            <div className="bg-warning-100 p-3 rounded-lg">
              <Clock className="text-warning-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Collection</p>
              <p className="text-2xl font-bold text-gray-900">
                KES {totalCollected}
              </p>
              <p className="text-sm text-gray-500">of KES {expectedTotal}</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-lg">
              <TrendingUp className="text-primary-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Recipient & My Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Recipient */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="mr-2 text-primary-600" size={20} />
            Today's Recipient
          </h2>
          
          {todaysRecipient ? (
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-bold text-lg">
                  {todaysRecipient.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{todaysRecipient.name}</h3>
                <p className="text-gray-600">{todaysRecipient.phone}</p>
                <p className="text-sm text-gray-500">
                  Expected to receive: KES {expectedTotal}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-lg font-bold text-primary-600">
                  {Math.round((totalCollected / expectedTotal) * 100)}%
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No recipient scheduled for today</p>
          )}
        </div>

        {/* My Contribution Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            My Contribution Status
          </h2>
          
          {myTodayContribution ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-success-500" size={24} />
                <div>
                  <p className="font-medium text-success-700">Payment Completed</p>
                  <p className="text-sm text-gray-600">
                    Paid at {format(myTodayContribution.paidAt!, 'HH:mm')}
                  </p>
                </div>
              </div>
              
              <div className="bg-success-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-success-700">Amount Paid:</span>
                  <span className="font-semibold text-success-900">
                    KES {myTodayContribution.amount}
                  </span>
                </div>
                
                {myTodayContribution.penaltyAmount && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-danger-700">Penalty:</span>
                    <span className="font-semibold text-danger-900">
                      KES {myTodayContribution.penaltyAmount}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-success-700">Method:</span>
                  <span className="text-sm text-success-900">
                    {myTodayContribution.paymentMethod}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="text-warning-500" size={24} />
                <div>
                  <p className="font-medium text-warning-700">Payment Pending</p>
                  <p className="text-sm text-gray-600">
                    Deadline: {currentGroup?.deadlineTime}
                  </p>
                </div>
              </div>
              
              <div className="bg-warning-50 p-4 rounded-lg">
                <p className="text-sm text-warning-700 mb-3">
                  Amount due: KES {currentGroup?.dailyAmount}
                </p>
                
                {!currentGroup?.isPaused ? (
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    Make Payment
                  </button>
                ) : (
                  <div className="bg-gray-100 p-3 rounded border-l-4 border-gray-400">
                    <p className="text-sm text-gray-600">
                      Contributions are currently paused
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Today's Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-success-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="text-success-600" size={24} />
            </div>
            <p className="text-2xl font-bold text-success-600">{paidMembers}</p>
            <p className="text-sm text-gray-600">Members Paid</p>
          </div>
          
          <div className="text-center">
            <div className="bg-warning-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="text-warning-600" size={24} />
            </div>
            <p className="text-2xl font-bold text-warning-600">{pendingMembers}</p>
            <p className="text-sm text-gray-600">Pending Payments</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="text-primary-600" size={24} />
            </div>
            <p className="text-2xl font-bold text-primary-600">
              {Math.round((totalCollected / expectedTotal) * 100)}%
            </p>
            <p className="text-sm text-gray-600">Collection Progress</p>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={currentGroup?.dailyAmount || 0}
        onPayment={handlePayment}
      />
    </div>
  );
};

export default Dashboard;