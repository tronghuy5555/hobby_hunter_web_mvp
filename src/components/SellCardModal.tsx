import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSellCardController } from '@/controller/SellCardController';
import { X, ArrowRight } from 'lucide-react';

interface SellCardModalProps {
  cardId: number;
  isOpen: boolean;
  onClose: () => void;
  onSellComplete?: () => void;
}

const SellCardModal = ({ cardId, isOpen, onClose, onSellComplete }: SellCardModalProps) => {
  const {
    // State
    isProcessing,
    error,
    sellCardDetails,
    
    // Data
    balancePreview,
    cardAttributes,
    
    // Validation
    canProceedWithSale,
    
    // Actions
    handleCancel,
    handleShipInstead,
    handleConfirmSell,
    
    // Utils
    clearError
  } = useSellCardController({ 
    cardId, 
    onSellComplete, 
    onCancel: onClose 
  });

  if (!isOpen || !sellCardDetails) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Sell card</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="text-red-600 text-sm">{error}</div>
                <button
                  onClick={clearError}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Card Details */}
          <div className="flex space-x-4">
            {/* Card Image Placeholder */}
            <div className="w-24 h-32 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center flex-shrink-0">
              <div className="w-12 h-12 bg-gray-300 rounded flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Card Info */}
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Card: {sellCardDetails.card.cardName}
              </h3>
              
              <div className="space-y-1">
                <div className="text-sm">
                  <span className="text-gray-600">Instant Buyback offer: </span>
                  <span className="font-semibold text-lg">${sellCardDetails.instantBuybackOffer}</span>
                </div>
                
                <div className="text-sm text-gray-600">
                  Multiplier: {sellCardDetails.multiplier}
                </div>
                
                <div className="text-xs text-gray-500">
                  *Price source: {sellCardDetails.priceSource}
                </div>
              </div>
            </div>
          </div>

          {/* Card Attributes */}
          <div className="flex flex-wrap gap-2">
            {cardAttributes.map((attr, index) => (
              <Badge
                key={index}
                className={`${attr.color} text-white text-xs px-3 py-1`}
              >
                {attr.label}: {attr.value}
              </Badge>
            ))}
          </div>

          {/* Balance Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Balance preview</h4>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Current balance</span>
                <span className="font-medium">${balancePreview.currentBalance}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Credit from sale</span>
                <span className="font-medium text-green-600">+${balancePreview.creditFromSale}</span>
              </div>
              
              <hr className="my-2" />
              
              <div className="flex justify-between text-base font-semibold">
                <span className="text-gray-900">New balance</span>
                <span className="text-gray-900">${balancePreview.newBalance}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleConfirmSell}
              disabled={!canProceedWithSale}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Confirm Sell'
              )}
            </Button>
          </div>

          {/* Ship Alternative */}
          <div className="text-center">
            <button
              onClick={handleShipInstead}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center space-x-1"
              disabled={isProcessing}
            >
              <span>Prefer to keep it? Ship this card instead</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellCardModal;