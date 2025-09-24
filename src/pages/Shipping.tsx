import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useShippingController } from '@/controller/ShippingController';
import { ChevronRight } from 'lucide-react';

const Shipping = () => {
  const {
    // State
    formData,
    selectedShipping,
    isSubmitting,
    isLoading,
    error,
    card,
    
    // Data
    shippingOptions,
    breadcrumbData,
    selectedShippingOption,
    totalShippingCost,
    
    // Validation
    isFormValid,
    
    // Actions
    handleInputChange,
    handleShippingOptionChange,
    handleSubmit,
    
    // Utils
    clearError
  } = useShippingController();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold text-foreground">Loading shipping information...</h1>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-600 mb-8">
          <span>{breadcrumbData.cardName}</span>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-900 font-medium">{breadcrumbData.currentPage}</span>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-600 text-sm">{error}</div>
              <button
                onClick={clearError}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Shipping Information */}
          <div className="bg-white rounded-lg border p-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Shipping information</h2>
            
            <div className="max-w-md mx-auto space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full name*
                </label>
                <Input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address*
                </label>
                <Input
                  type="email"
                  value={formData.emailAddress}
                  onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone number*
                </label>
                <Input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address*
                </label>
                <Input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full"
                  placeholder="Street address, city, state, ZIP code"
                  required
                />
              </div>
            </div>
          </div>

          {/* Shipping Rates */}
          <div className="bg-white rounded-lg border p-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Shipping rates</h2>
            
            <div className="max-w-2xl mx-auto space-y-4">
              {shippingOptions.map((option) => (
                <div 
                  key={option.id}
                  className={`border rounded-lg p-6 cursor-pointer transition-colors ${
                    selectedShipping === option.id
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => handleShippingOptionChange(option.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900">{option.name}</h3>
                        <p className="text-sm text-gray-600">{option.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{option.features}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">${option.price.toFixed(2)}</div>
                      {option.originalPrice && (
                        <>
                          <div className="text-sm text-gray-500 line-through">${option.originalPrice.toFixed(2)} retail</div>
                          <div className="text-sm text-green-600 font-medium">{option.discount}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium rounded-lg min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Continue to shipping'
              )}
            </Button>
          </div>
        </form>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shipping;