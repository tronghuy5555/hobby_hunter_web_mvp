/**
 * Transaction Repository
 * 
 * Handles financial transactions, credit management, payment processing, and transaction history.
 * Provides comprehensive transaction functionality with mock data fallback.
 */

import { BaseRepository, RepositoryUtils } from './BaseRepository';
import { apiEndpoints } from '../api/config';
import type {
  Transaction,
  TransactionType,
  TransactionStatus,
  CreditPurchaseRequest,
  RefundRequest,
  PaymentMethod,
  CreateTransactionData,
  UpdateTransactionData,
} from '../types/domain';
import type {
  ApiResponse,
  PaginatedResponse,
  ListRequestParams,
} from '../api/types';

/**
 * Transaction repository for financial operations
 */
export class TransactionRepository extends BaseRepository<Transaction> {
  constructor() {
    super({
      baseEndpoint: apiEndpoints.transactions.list,
      featureFlag: 'useApiForTransactions',
      mockFallback: true,
    });
  }

  /**
   * Transform request data for API
   */
  protected transformRequest(data: any): any {
    // Convert UI format to API format
    return {
      ...data,
      user_id: data.userId,
      payment_method: data.paymentMethod,
      payment_id: data.paymentId,
      processed_at: data.processedAt,
      failure_reason: data.failureReason,
    };
  }

  /**
   * Transform API response to UI format
   */
  protected transformResponse(data: any): Transaction {
    // Convert API format to UI format
    return {
      ...data,
      userId: data.user_id || data.userId,
      paymentMethod: data.payment_method || data.paymentMethod,
      paymentId: data.payment_id || data.paymentId,
      processedAt: data.processed_at || data.processedAt,
      failureReason: data.failure_reason || data.failureReason,
    };
  }

  // ==================== Transaction Management Methods ====================

  /**
   * Get transactions for a user with filters
   */
  async getTransactions(
    userId: string,
    filters?: {
      type?: TransactionType[];
      status?: TransactionStatus[];
      dateFrom?: string;
      dateTo?: string;
      amountMin?: number;
      amountMax?: number;
    }
  ): Promise<PaginatedResponse<Transaction>> {
    return this.makeApiCall(
      'GET',
      apiEndpoints.transactions.list,
      undefined,
      { userId, ...filters },
      () => this.getMockTransactionsData(userId, filters)
    );
  }

  /**
   * Get transaction details by ID
   */
  async getTransactionDetails(transactionId: string): Promise<ApiResponse<Transaction & { receipt?: any }>> {
    return this.makeApiCall(
      'GET',
      this.buildUrl(apiEndpoints.transactions.details, { id: transactionId }),
      undefined,
      undefined,
      () => this.getMockTransactionDetailsData(transactionId)
    );
  }

  /**
   * Create a new transaction
   */
  async createTransaction(data: CreateTransactionData): Promise<ApiResponse<Transaction>> {
    return this.makeApiCall(
      'POST',
      apiEndpoints.transactions.create,
      data,
      undefined,
      () => this.getMockCreateTransactionData(data)
    );
  }

  /**
   * Update transaction status
   */
  async updateTransactionStatus(
    transactionId: string, 
    status: TransactionStatus,
    metadata?: Record<string, any>
  ): Promise<ApiResponse<Transaction>> {
    return this.makeApiCall(
      'PATCH',
      this.buildUrl(apiEndpoints.transactions.update, { id: transactionId }),
      { status, metadata },
      undefined,
      () => this.getMockUpdateTransactionStatusData(transactionId, status, metadata)
    );
  }

  // ==================== Credit Purchase Methods ====================

  /**
   * Purchase credits with payment method
   */
  async purchaseCredits(request: CreditPurchaseRequest): Promise<ApiResponse<{
    transaction: Transaction;
    paymentIntent?: any;
    requiresAction?: boolean;
  }>> {
    return this.makeApiCall(
      'POST',
      apiEndpoints.transactions.credits,
      request,
      undefined,
      () => this.getMockPurchaseCreditsData(request)
    );
  }

  /**
   * Validate credit purchase before processing
   */
  async validateCreditPurchase(request: CreditPurchaseRequest): Promise<ApiResponse<{
    valid: boolean;
    minimumAmount: number;
    maximumAmount: number;
    fees: {
      processingFee: number;
      platformFee: number;
      totalFees: number;
    };
    errors?: string[];
  }>> {
    return this.makeApiCall(
      'POST',
      '/transactions/credits/validate',
      request,
      undefined,
      () => this.getMockValidateCreditPurchaseData(request)
    );
  }

  // ==================== Payment Methods ====================

  /**
   * Get user's saved payment methods
   */
  async getPaymentMethods(userId: string): Promise<PaginatedResponse<PaymentMethod>> {
    return this.makeApiCall(
      'GET',
      apiEndpoints.transactions.payments,
      undefined,
      { userId },
      () => this.getMockPaymentMethodsData(userId)
    );
  }

  /**
   * Add new payment method
   */
  async addPaymentMethod(
    userId: string,
    paymentMethodData: {
      type: PaymentMethod['type'];
      token: string;
      nickname?: string;
      setAsDefault?: boolean;
    }
  ): Promise<ApiResponse<PaymentMethod>> {
    return this.makeApiCall(
      'POST',
      apiEndpoints.transactions.payments,
      { userId, ...paymentMethodData },
      undefined,
      () => this.getMockAddPaymentMethodData(userId, paymentMethodData)
    );
  }

  /**
   * Remove payment method
   */
  async removePaymentMethod(paymentMethodId: string): Promise<ApiResponse<void>> {
    return this.makeApiCall(
      'DELETE',
      `/transactions/payments/${paymentMethodId}`,
      undefined,
      undefined,
      () => this.getMockRemovePaymentMethodData(paymentMethodId)
    );
  }

  /**
   * Update payment method (set as default, change nickname)
   */
  async updatePaymentMethod(
    paymentMethodId: string,
    updates: { nickname?: string; isDefault?: boolean }
  ): Promise<ApiResponse<PaymentMethod>> {
    return this.makeApiCall(
      'PATCH',
      `/transactions/payments/${paymentMethodId}`,
      updates,
      undefined,
      () => this.getMockUpdatePaymentMethodData(paymentMethodId, updates)
    );
  }

  // ==================== Refund Processing ====================

  /**
   * Process refund for a transaction
   */
  async processRefund(request: RefundRequest): Promise<ApiResponse<{
    refundTransaction: Transaction;
    originalTransaction: Transaction;
    refundAmount: number;
    estimatedCompletion: string;
  }>> {
    return this.makeApiCall(
      'POST',
      this.buildUrl(apiEndpoints.transactions.refund, { id: request.transactionId }),
      { amount: request.amount, reason: request.reason },
      undefined,
      () => this.getMockProcessRefundData(request)
    );
  }

  /**
   * Get refund status
   */
  async getRefundStatus(refundTransactionId: string): Promise<ApiResponse<{
    status: TransactionStatus;
    refundAmount: number;
    estimatedCompletion?: string;
    actualCompletion?: string;
    reason?: string;
  }>> {
    return this.makeApiCall(
      'GET',
      `/transactions/refunds/${refundTransactionId}`,
      undefined,
      undefined,
      () => this.getMockRefundStatusData(refundTransactionId)
    );
  }

  // ==================== Transaction Receipts ====================

  /**
   * Get transaction receipt
   */
  async getTransactionReceipt(transactionId: string, format: 'json' | 'pdf' = 'json'): Promise<ApiResponse<{
    receipt: any;
    downloadUrl?: string;
  }>> {
    return this.makeApiCall(
      'GET',
      this.buildUrl(apiEndpoints.transactions.receipt, { id: transactionId }),
      undefined,
      { format },
      () => this.getMockTransactionReceiptData(transactionId, format)
    );
  }

  // ==================== Analytics and Reporting ====================

  /**
   * Get user spending analytics
   */
  async getUserSpendingAnalytics(
    userId: string,
    period: 'month' | 'quarter' | 'year' = 'month'
  ): Promise<ApiResponse<{
    totalSpent: number;
    totalEarned: number;
    netAmount: number;
    transactionCount: number;
    averageTransaction: number;
    spendingByCategory: Record<TransactionType, number>;
    spendingTrend: Array<{ date: string; amount: number }>;
  }>> {
    return this.makeApiCall(
      'GET',
      `/transactions/analytics/spending`,
      undefined,
      { userId, period },
      () => this.getMockSpendingAnalyticsData(userId, period)
    );
  }

  /**
   * Get pending transactions for a user
   */
  async getPendingTransactions(userId: string): Promise<PaginatedResponse<Transaction>> {
    return this.makeApiCall(
      'GET',
      apiEndpoints.transactions.list,
      undefined,
      { userId, status: ['pending', 'processing'] },
      () => this.getMockPendingTransactionsData(userId)
    );
  }

  // ==================== Mock Data Methods ====================

  protected async getMockListData(params?: ListRequestParams): Promise<PaginatedResponse<Transaction>> {
    await RepositoryUtils.simulateDelay();
    
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        userId: 'user1',
        type: 'credit_purchase',
        amount: 100,
        currency: 'USD',
        status: 'completed',
        description: 'Credit purchase - $100',
        paymentMethod: 'card',
        processedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return RepositoryUtils.createPaginatedResponse(mockTransactions, {
      page: params?.page || 1,
      limit: params?.limit || 10,
      total: mockTransactions.length,
    });
  }

  protected async getMockByIdData(id: string): Promise<ApiResponse<Transaction>> {
    await RepositoryUtils.simulateDelay();
    
    const mockTransaction: Transaction = {
      id,
      userId: 'user1',
      type: 'credit_purchase',
      amount: 100,
      currency: 'USD',
      status: 'completed',
      description: 'Credit purchase - $100',
      paymentMethod: 'card',
      paymentId: 'pay_12345',
      processedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return RepositoryUtils.createSuccessResponse(mockTransaction);
  }

  protected async getMockCreateData(data: CreateTransactionData): Promise<ApiResponse<Transaction>> {
    await RepositoryUtils.simulateDelay();
    
    const mockTransaction: Transaction = {
      id: RepositoryUtils.generateMockId(),
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return RepositoryUtils.createSuccessResponse(mockTransaction);
  }

  protected async getMockUpdateData(id: string, data: UpdateTransactionData): Promise<ApiResponse<Transaction>> {
    await RepositoryUtils.simulateDelay();
    
    const existingTransaction = await this.getMockByIdData(id);
    const updatedTransaction: Transaction = {
      ...existingTransaction.data!,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return RepositoryUtils.createSuccessResponse(updatedTransaction);
  }

  protected async getMockDeleteData(id: string): Promise<ApiResponse<void>> {
    await RepositoryUtils.simulateDelay();
    return RepositoryUtils.createSuccessResponse(undefined, 'Transaction deleted successfully');
  }

  // ==================== Transaction Management Mock Data ====================

  private async getMockTransactionsData(
    userId: string,
    filters?: any
  ): Promise<PaginatedResponse<Transaction>> {
    await RepositoryUtils.simulateDelay();
    
    let mockTransactions: Transaction[] = [
      {
        id: '1',
        userId,
        type: 'credit_purchase',
        amount: 100,
        currency: 'USD',
        status: 'completed',
        description: 'Credit purchase - $100',
        paymentMethod: 'card',
        processedAt: new Date(Date.now() - 86400000).toISOString(),
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '2',
        userId,
        type: 'pack_purchase',
        amount: 25,
        currency: 'USD',
        status: 'completed',
        description: 'Pack purchase - Final Fantasy MTG',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: '3',
        userId,
        type: 'card_sale',
        amount: 80,
        currency: 'USD',
        status: 'pending',
        description: 'Card sale - Cloud Strife',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Apply filters
    if (filters) {
      if (filters.type && filters.type.length > 0) {
        mockTransactions = mockTransactions.filter(t => filters.type.includes(t.type));
      }
      if (filters.status && filters.status.length > 0) {
        mockTransactions = mockTransactions.filter(t => filters.status.includes(t.status));
      }
      if (filters.amountMin) {
        mockTransactions = mockTransactions.filter(t => t.amount >= filters.amountMin);
      }
      if (filters.amountMax) {
        mockTransactions = mockTransactions.filter(t => t.amount <= filters.amountMax);
      }
    }

    return RepositoryUtils.createPaginatedResponse(mockTransactions, {
      page: 1,
      limit: 10,
      total: mockTransactions.length,
    });
  }

  private async getMockTransactionDetailsData(transactionId: string): Promise<Transaction & { receipt?: any }> {
    await RepositoryUtils.simulateDelay();
    
    const baseTransaction = await this.getMockByIdData(transactionId);
    const receipt = {
      transactionId,
      items: [
        { description: 'Credit purchase', amount: 100 },
      ],
      fees: [
        { description: 'Processing fee', amount: 3.50 },
      ],
      total: 103.50,
      currency: 'USD',
      issuedAt: new Date().toISOString(),
    };

    return {
      ...baseTransaction.data!,
      receipt,
    };
  }

  private async getMockCreateTransactionData(data: CreateTransactionData): Promise<Transaction> {
    await RepositoryUtils.simulateDelay();
    
    return {
      id: RepositoryUtils.generateMockId(),
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private async getMockUpdateTransactionStatusData(
    transactionId: string,
    status: TransactionStatus,
    metadata?: Record<string, any>
  ): Promise<Transaction> {
    await RepositoryUtils.simulateDelay();
    
    const existingTransaction = await this.getMockByIdData(transactionId);
    return {
      ...existingTransaction.data!,
      status,
      metadata: { ...existingTransaction.data!.metadata, ...metadata },
      processedAt: status === 'completed' ? new Date().toISOString() : existingTransaction.data!.processedAt,
      updatedAt: new Date().toISOString(),
    };
  }

  // ==================== Credit Purchase Mock Data ====================

  private async getMockPurchaseCreditsData(request: CreditPurchaseRequest): Promise<{
    transaction: Transaction;
    paymentIntent?: any;
    requiresAction?: boolean;
  }> {
    await RepositoryUtils.simulateDelay(1000, 2000);
    
    const transaction: Transaction = {
      id: RepositoryUtils.generateMockId(),
      userId: 'user1',
      type: 'credit_purchase',
      amount: request.amount,
      currency: request.currency,
      status: 'completed',
      description: `Credit purchase - ${request.currency} ${request.amount}`,
      paymentMethod: request.paymentMethod,
      processedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      transaction,
      requiresAction: false,
    };
  }

  private async getMockValidateCreditPurchaseData(request: CreditPurchaseRequest): Promise<{
    valid: boolean;
    minimumAmount: number;
    maximumAmount: number;
    fees: { processingFee: number; platformFee: number; totalFees: number };
    errors?: string[];
  }> {
    await RepositoryUtils.simulateDelay();
    
    const minimumAmount = 10;
    const maximumAmount = 1000;
    const processingFee = request.amount * 0.035; // 3.5%
    const platformFee = 0.5;
    const totalFees = processingFee + platformFee;

    const errors: string[] = [];
    if (request.amount < minimumAmount) {
      errors.push(`Minimum purchase amount is ${request.currency} ${minimumAmount}`);
    }
    if (request.amount > maximumAmount) {
      errors.push(`Maximum purchase amount is ${request.currency} ${maximumAmount}`);
    }

    return {
      valid: errors.length === 0,
      minimumAmount,
      maximumAmount,
      fees: { processingFee, platformFee, totalFees },
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  // ==================== Payment Methods Mock Data ====================

  private async getMockPaymentMethodsData(userId: string): Promise<PaginatedResponse<PaymentMethod>> {
    await RepositoryUtils.simulateDelay();
    
    const mockPaymentMethods: PaymentMethod[] = [
      {
        id: '1',
        type: 'card',
        last4: '4242',
        brand: 'visa',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true,
        nickname: 'Primary Card',
      },
      {
        id: '2',
        type: 'paypal',
        isDefault: false,
        nickname: 'PayPal Account',
      },
    ];

    return RepositoryUtils.createPaginatedResponse(mockPaymentMethods, {
      page: 1,
      limit: 10,
      total: mockPaymentMethods.length,
    });
  }

  private async getMockAddPaymentMethodData(
    userId: string,
    paymentMethodData: any
  ): Promise<PaymentMethod> {
    await RepositoryUtils.simulateDelay();
    
    return {
      id: RepositoryUtils.generateMockId(),
      type: paymentMethodData.type,
      last4: '1234',
      brand: 'mastercard',
      expiryMonth: 6,
      expiryYear: 2026,
      isDefault: paymentMethodData.setAsDefault || false,
      nickname: paymentMethodData.nickname || 'New Payment Method',
    };
  }

  private async getMockRemovePaymentMethodData(paymentMethodId: string): Promise<void> {
    await RepositoryUtils.simulateDelay();
    // Mock removal - no return value needed
  }

  private async getMockUpdatePaymentMethodData(
    paymentMethodId: string,
    updates: any
  ): Promise<PaymentMethod> {
    await RepositoryUtils.simulateDelay();
    
    return {
      id: paymentMethodId,
      type: 'card',
      last4: '4242',
      brand: 'visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: updates.isDefault || false,
      nickname: updates.nickname || 'Updated Card',
    };
  }

  // ==================== Refund Processing Mock Data ====================

  private async getMockProcessRefundData(request: RefundRequest): Promise<{
    refundTransaction: Transaction;
    originalTransaction: Transaction;
    refundAmount: number;
    estimatedCompletion: string;
  }> {
    await RepositoryUtils.simulateDelay();
    
    const originalTransaction = await this.getMockByIdData(request.transactionId);
    const refundAmount = request.amount || originalTransaction.data!.amount;

    const refundTransaction: Transaction = {
      id: RepositoryUtils.generateMockId(),
      userId: originalTransaction.data!.userId,
      type: 'refund',
      amount: -refundAmount, // Negative for refund
      currency: originalTransaction.data!.currency,
      status: 'processing',
      description: `Refund for transaction ${request.transactionId}: ${request.reason}`,
      reference: request.transactionId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      refundTransaction,
      originalTransaction: originalTransaction.data!,
      refundAmount,
      estimatedCompletion: new Date(Date.now() + 3 * 86400000).toISOString(), // 3 days
    };
  }

  private async getMockRefundStatusData(refundTransactionId: string): Promise<{
    status: TransactionStatus;
    refundAmount: number;
    estimatedCompletion?: string;
    actualCompletion?: string;
    reason?: string;
  }> {
    await RepositoryUtils.simulateDelay();
    
    return {
      status: 'completed',
      refundAmount: 25,
      estimatedCompletion: new Date(Date.now() + 2 * 86400000).toISOString(),
      actualCompletion: new Date().toISOString(),
      reason: 'Customer requested refund',
    };
  }

  // ==================== Transaction Receipts Mock Data ====================

  private async getMockTransactionReceiptData(
    transactionId: string,
    format: 'json' | 'pdf'
  ): Promise<{ receipt: any; downloadUrl?: string }> {
    await RepositoryUtils.simulateDelay();
    
    const receipt = {
      transactionId,
      items: [
        { description: 'Credit purchase', amount: 100 },
      ],
      fees: [
        { description: 'Processing fee', amount: 3.50 },
      ],
      total: 103.50,
      currency: 'USD',
      issuedAt: new Date().toISOString(),
    };

    return {
      receipt,
      downloadUrl: format === 'pdf' ? `https://api.example.com/receipts/${transactionId}.pdf` : undefined,
    };
  }

  // ==================== Analytics Mock Data ====================

  private async getMockSpendingAnalyticsData(
    userId: string,
    period: string
  ): Promise<{
    totalSpent: number;
    totalEarned: number;
    netAmount: number;
    transactionCount: number;
    averageTransaction: number;
    spendingByCategory: Record<TransactionType, number>;
    spendingTrend: Array<{ date: string; amount: number }>;
  }> {
    await RepositoryUtils.simulateDelay();
    
    return {
      totalSpent: 250,
      totalEarned: 80,
      netAmount: -170,
      transactionCount: 5,
      averageTransaction: 50,
      spendingByCategory: {
        credit_purchase: 100,
        pack_purchase: 125,
        card_sale: 80,
        shipping_fee: 25,
        refund: 0,
        card_conversion: 0,
        bonus_credit: 0,
      },
      spendingTrend: [
        { date: new Date(Date.now() - 6 * 86400000).toISOString(), amount: 50 },
        { date: new Date(Date.now() - 5 * 86400000).toISOString(), amount: 25 },
        { date: new Date(Date.now() - 4 * 86400000).toISOString(), amount: 0 },
        { date: new Date(Date.now() - 3 * 86400000).toISOString(), amount: 100 },
        { date: new Date(Date.now() - 2 * 86400000).toISOString(), amount: 25 },
        { date: new Date(Date.now() - 1 * 86400000).toISOString(), amount: 80 },
        { date: new Date().toISOString(), amount: 0 },
      ],
    };
  }

  private async getMockPendingTransactionsData(userId: string): Promise<PaginatedResponse<Transaction>> {
    await RepositoryUtils.simulateDelay();
    
    const pendingTransactions: Transaction[] = [
      {
        id: '3',
        userId,
        type: 'card_sale',
        amount: 80,
        currency: 'USD',
        status: 'pending',
        description: 'Card sale - Cloud Strife',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return RepositoryUtils.createPaginatedResponse(pendingTransactions, {
      page: 1,
      limit: 10,
      total: pendingTransactions.length,
    });
  }
}

// Export singleton instance
export const transactionRepository = new TransactionRepository();