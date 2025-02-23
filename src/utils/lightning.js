// Lightning Network payment utilities
import { webln } from '../services/webln';

export async function generatePaymentRequest(amountSats) {
  try {
    // Generate a unique payment hash
    const paymentHash = crypto.randomUUID();
    
    // Create an invoice with your Lightning backend
    const response = await fetch('/api/lightning/invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amountSats,
        memo: 'Monthly Subscription',
        paymentHash
      })
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error);
    }

    return {
      paymentRequest: data.invoice,
      paymentHash: data.paymentHash,
      expiresAt: data.expiresAt
    };
  } catch (error) {
    console.error('Error generating payment request:', error);
    throw new Error('Failed to generate payment request');
  }
}

export async function verifyPayment(paymentHash) {
  try {
    const response = await fetch(`/api/lightning/verify/${paymentHash}`);
    const data = await response.json();
    return data.paid;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return false;
  }
}

export async function handleWebLNPayment(paymentRequest) {
  try {
    // Check if WebLN is available
    if (!webln.enabled) {
      throw new Error('WebLN not available');
    }

    // Request user permission
    await webln.enable();

    // Send payment
    const result = await webln.sendPayment(paymentRequest);
    return {
      success: true,
      preimage: result.preimage
    };
  } catch (error) {
    console.error('WebLN payment error:', error);
    throw new Error('Payment failed');
  }
}

export async function checkLightningConnection() {
  try {
    if (!webln.enabled) {
      return {
        connected: false,
        error: 'WebLN not available'
      };
    }

    await webln.enable();
    return {
      connected: true,
      nodeInfo: await webln.getInfo()
    };
  } catch (error) {
    console.error('Lightning connection error:', error);
    return {
      connected: false,
      error: error.message
    };
  }
} 