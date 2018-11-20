const fetch = require('node-fetch');

class PaySafeCard {
  constructor(options) {
    if(!options) {
      throw new Error('No options provided in class constructor');
    }
    if(!options.key) {
      throw new Error('Please provide "key" parameter in options');
    }
    this.keyEncoded = Buffer.from(options.key).toString('base64');


    if(!options.environment) {
      throw new Error('Please specify environment in options');
    }

    if(options.environment == 'PRODUCTION') {
      this.host = "https://api.paysafecard.com/v1/";
    } else {
      this.host = "https://apitest.paysafecard.com/v1";
    }
  }

  async request(method, route, data) {
    if(!data) {
      data = {};
    }
    const url = this.host + route;
    const headers = {
      'accept-language': 'en',
      'authorization': `Basic ${this.keyEncoded}`,
      'content-type': 'application/json'
    };

    let body;

    if(method == 'POST' && data) {
      body = JSON.stringify(data);
    }
    const req = await fetch(url, {
      method,
      headers,
      body
    });

    const res = await req.json();
    if(req.status < 200 || req.status >= 300) {
      throw new Error(res.code);
    }
    return res;
  }

  async createPayment(options) {
    let customer = {};

    if(options.customer) {
      customer = {
        id: options.customer.id,
        min_age: options.customer.migAge || undefined,
        kyc_level: options.customer.kycRestriction || undefined,
        country_restriction: options.customer.countryRestriction || undefined
      }
    }
    const res = await this.request('POST', '/payments', {
      currency: options.currency,
      amount: options.amount,
      customer: options.customer,
      redirect: {
        success_url: options.urls.redirectSuccess,
        failure_url: options.urls.redirectFailure
      },
      type: 'PAYSAFECARD',
      notification_url: options.urls.notification,
      shop_id: options.shopId || ""
    });
    return res;
  }

  async getPaymentInfo(id) {
    return await this.request('GET', `/payments/${id}`);
  }

  async capturePayment(id) {
    return await this.request('POST', `/payments/${id}/capture`);
  }
}

module.exports = PaySafeCard;
