import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, LoadingSpinner } from '../ui';
import type { ShippingAddress } from '../../types';

interface ShippingFormProps {
  initialData?: Partial<ShippingAddress>;
  onSubmit: (data: ShippingAddress) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  submitText?: string;
  showSetDefault?: boolean;
}

const shippingSchema = yup.object({
  firstName: yup
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .required('First name is required'),
  lastName: yup
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .required('Last name is required'),
  street: yup
    .string()
    .trim()
    .min(5, 'Street address must be at least 5 characters')
    .max(200, 'Street address must not exceed 200 characters')
    .required('Street address is required'),
  city: yup
    .string()
    .trim()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must not exceed 100 characters')
    .required('City is required'),
  state: yup
    .string()
    .trim()
    .min(2, 'State must be at least 2 characters')
    .max(50, 'State must not exceed 50 characters')
    .required('State is required'),
  zipCode: yup
    .string()
    .trim()
    .matches(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)')
    .required('ZIP code is required'),
  country: yup
    .string()
    .trim()
    .required('Country is required'),
  isDefault: yup.boolean().optional()
});

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];

const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'South Korea'
];

export const ShippingForm: React.FC<ShippingFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  submitText = 'Save Address',
  showSetDefault = true,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm<ShippingAddress>({
    resolver: yupResolver(shippingSchema) as any,
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      street: initialData?.street || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      zipCode: initialData?.zipCode || '',
      country: initialData?.country || 'United States',
      isDefault: initialData?.isDefault || false,
    },
  });

  const selectedCountry = watch('country');

  const handleFormSubmit = async (data: ShippingAddress) => {
    try {
      await onSubmit(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save address';
      setError('root', { message });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit as any)} className="space-y-6">
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
            First Name
          </label>
          <input
            {...register('firstName')}
            type="text"
            id="firstName"
            autoComplete="given-name"
            className={`w-full px-4 py-3 bg-background-card border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
              errors.firstName
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-600 focus:ring-primary-500'
            }`}
            placeholder="Enter first name"
            disabled={loading || isSubmitting}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-400">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
            Last Name
          </label>
          <input
            {...register('lastName')}
            type="text"
            id="lastName"
            autoComplete="family-name"
            className={`w-full px-4 py-3 bg-background-card border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
              errors.lastName
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-600 focus:ring-primary-500'
            }`}
            placeholder="Enter last name"
            disabled={loading || isSubmitting}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-400">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Street Address */}
      <div>
        <label htmlFor="street" className="block text-sm font-medium text-gray-300 mb-2">
          Street Address
        </label>
        <input
          {...register('street')}
          type="text"
          id="street"
          autoComplete="street-address"
          className={`w-full px-4 py-3 bg-background-card border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
            errors.street
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-600 focus:ring-primary-500'
          }`}
          placeholder="Enter street address"
          disabled={loading || isSubmitting}
        />
        {errors.street && (
          <p className="mt-1 text-sm text-red-400">{errors.street.message}</p>
        )}
      </div>

      {/* City, State, ZIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
            City
          </label>
          <input
            {...register('city')}
            type="text"
            id="city"
            autoComplete="address-level2"
            className={`w-full px-4 py-3 bg-background-card border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
              errors.city
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-600 focus:ring-primary-500'
            }`}
            placeholder="Enter city"
            disabled={loading || isSubmitting}
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-400">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-2">
            State
          </label>
          {selectedCountry === 'United States' ? (
            <select
              {...register('state')}
              id="state"
              autoComplete="address-level1"
              className={`w-full px-4 py-3 bg-background-card border rounded-lg text-white focus:outline-none focus:ring-2 transition-colors ${
                errors.state
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-600 focus:ring-primary-500'
              }`}
              disabled={loading || isSubmitting}
            >
              <option value="">Select state</option>
              {US_STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          ) : (
            <input
              {...register('state')}
              type="text"
              id="state"
              autoComplete="address-level1"
              className={`w-full px-4 py-3 bg-background-card border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.state
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-600 focus:ring-primary-500'
              }`}
              placeholder="Enter state/province"
              disabled={loading || isSubmitting}
            />
          )}
          {errors.state && (
            <p className="mt-1 text-sm text-red-400">{errors.state.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-300 mb-2">
            ZIP Code
          </label>
          <input
            {...register('zipCode')}
            type="text"
            id="zipCode"
            autoComplete="postal-code"
            className={`w-full px-4 py-3 bg-background-card border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
              errors.zipCode
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-600 focus:ring-primary-500'
            }`}
            placeholder="Enter ZIP code"
            disabled={loading || isSubmitting}
          />
          {errors.zipCode && (
            <p className="mt-1 text-sm text-red-400">{errors.zipCode.message}</p>
          )}
        </div>
      </div>

      {/* Country */}
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">
          Country
        </label>
        <select
          {...register('country')}
          id="country"
          autoComplete="country"
          className={`w-full px-4 py-3 bg-background-card border rounded-lg text-white focus:outline-none focus:ring-2 transition-colors ${
            errors.country
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-600 focus:ring-primary-500'
          }`}
          disabled={loading || isSubmitting}
        >
          {COUNTRIES.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        {errors.country && (
          <p className="mt-1 text-sm text-red-400">{errors.country.message}</p>
        )}
      </div>

      {/* Set as Default */}
      {showSetDefault && (
        <div className="flex items-center space-x-3">
          <input
            {...register('isDefault')}
            type="checkbox"
            id="isDefault"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-600 rounded bg-background-card"
            disabled={loading || isSubmitting}
          />
          <label htmlFor="isDefault" className="text-sm text-gray-300">
            Set as default shipping address
          </label>
        </div>
      )}

      {/* Error Message */}
      {errors.root && (
        <div className="p-3 bg-red-900/20 border border-red-500 rounded-lg">
          <p className="text-sm text-red-400">{errors.root.message}</p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex space-x-4 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading || isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          disabled={loading || isSubmitting}
          className="flex-1"
        >
          {(loading || isSubmitting) ? (
            <div className="flex items-center justify-center space-x-2">
              <LoadingSpinner size="sm" />
              <span>Saving...</span>
            </div>
          ) : (
            submitText
          )}
        </Button>
      </div>
    </form>
  );
};