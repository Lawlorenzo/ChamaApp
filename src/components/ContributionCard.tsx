import React from 'react';
import { CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';
import { Contribution, User } from '../types';
import { format } from 'date-fns';

interface ContributionCardProps {
  contribution: Contribution;
  user: User;
  expectedAmount: number;
}

const ContributionCard: React.FC<ContributionCardProps> = ({
  contribution,
  user,
  expectedAmount,
}) => {
  const getStatusIcon = () => {
    switch (contribution.status) {
      case 'paid':
        return <CheckCircle className="text-success-500" size={20} />;
      case 'late':
        return <AlertTriangle className="text-warning-500" size={20} />;
      case 'penalty':
        return <XCircle className="text-danger-500" size={20} />;
      default:
        return <Clock className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = () => {
    switch (contribution.status) {
      case 'paid':
        return 'bg-success-50 border-success-200';
      case 'late':
        return 'bg-warning-50 border-warning-200';
      case 'penalty':
        return 'bg-danger-50 border-danger-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getAmountColor = () => {
    if (contribution.amount > expectedAmount) return 'text-primary-600';
    if (contribution.amount < expectedAmount) return 'text-danger-600';
    return 'text-success-600';
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${getStatusColor()} transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-700 font-semibold text-sm">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.phone}</p>
          </div>
        </div>
        {getStatusIcon()}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Amount:</span>
          <span className={`font-semibold ${getAmountColor()}`}>
            KES {contribution.amount}
            {contribution.amount !== expectedAmount && (
              <span className="text-xs text-gray-500 ml-1">
                (Expected: {expectedAmount})
              </span>
            )}
          </span>
        </div>

        {contribution.penaltyAmount && contribution.penaltyAmount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Penalty:</span>
            <span className="font-semibold text-danger-600">
              KES {contribution.penaltyAmount}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Status:</span>
          <span className={`text-sm font-medium capitalize ${
            contribution.status === 'paid' ? 'text-success-600' :
            contribution.status === 'late' ? 'text-warning-600' :
            contribution.status === 'penalty' ? 'text-danger-600' :
            'text-gray-600'
          }`}>
            {contribution.status}
          </span>
        </div>

        {contribution.paidAt && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Paid at:</span>
            <span className="text-sm text-gray-900">
              {format(contribution.paidAt, 'HH:mm')}
            </span>
          </div>
        )}

        {contribution.paymentMethod && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Method:</span>
            <span className="text-sm text-gray-900">
              {contribution.paymentMethod}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributionCard;