import React, { useState } from 'react';
import { X, CreditCard, Smartphone } from 'lucide-react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPayment: (paymentMethod: string, transactionId: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  onPayment,
}) => {
  const { paymentMethods } = useStore();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [transactionId, setTransactionId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (!selectedMethod || !transactionId.trim()) {
      toast.error('Please select payment method and enter transaction ID');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      onPayment(selectedMethod, transactionId);
      toast.success('Payment submitted successfully!');
      setIsProcessing(false);
      onClose();
      setSelectedMethod('');
      setTransactionId('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Make Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-primary-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-primary-700 mb-1">Amount to Pay</p>
            <p className="text-2xl font-bold text-primary-900">KES {amount}</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Payment Method
          </label>
          <div className="space-y-2">
            {paymentMethods.filter(method => method.isActive).map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.name)}
                className={`w-full p-3 rounded-lg border-2 transition-all flex items-center space-x-3 ${
                  selectedMethod === method.name
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{method.icon}</span>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{method.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{method.type} payment</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction ID / Reference Number
          </label>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Enter transaction ID"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the transaction ID from your payment confirmation
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing || !selectedMethod || !transactionId.trim()}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? 'Processing...' : 'Submit Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;