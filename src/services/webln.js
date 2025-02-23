class WebLNService {
  constructor() {
    this.enabled = false;
    this.provider = null;
    this.init();
  }

  async init() {
    try {
      if (typeof window.webln !== 'undefined') {
        await window.webln.enable();
        this.provider = window.webln;
        this.enabled = true;
      }
    } catch (error) {
      console.error('WebLN initialization error:', error);
      this.enabled = false;
    }
  }

  async getInfo() {
    if (!this.enabled) {
      throw new Error('WebLN not available');
    }
    return await this.provider.getInfo();
  }

  async sendPayment(paymentRequest) {
    if (!this.enabled) {
      throw new Error('WebLN not available');
    }
    return await this.provider.sendPayment(paymentRequest);
  }

  async makeInvoice(args) {
    if (!this.enabled) {
      throw new Error('WebLN not available');
    }
    return await this.provider.makeInvoice(args);
  }

  async signMessage(message) {
    if (!this.enabled) {
      throw new Error('WebLN not available');
    }
    return await this.provider.signMessage(message);
  }

  async verifyMessage(signature, message) {
    if (!this.enabled) {
      throw new Error('WebLN not available');
    }
    return await this.provider.verifyMessage(signature, message);
  }
}

export const webln = new WebLNService(); 