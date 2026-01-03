// This is a mock Razorpay module for development/testing
const instance = {
  orders: {
    create: async (options) => {
      // Simulate order creation
      return {
        id: "order_test_123456",
        amount: options.amount,
        currency: options.currency,
        receipt: options.receipt,
        status: "created",
      };
    },
  },
};

export default instance;
