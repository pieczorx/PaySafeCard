# PaySafeCard
Unofficial PaySafeCard Node.js wrapper

## Important
This module uses ES6 promises, so if you need older Node version support please use Babel.
## Install
```bash
npm i paysafecard
```

## Set api key and environment
```javascript
const PaySafeCard = require('paysafecard');

const psc = new PaySafeCard({
  key: 'psc_123456789012345678901-123456789', //Paste your api key here
  environment: 'TEST' //or PRODUCTION
});
```


## Usage
#### Create payment
```javascript
async () => {
  try {
    const response = await psc.createPayment({
      currency: 'USD',
      amount: 19.99,
      urls: {
        redirectSuccess: 'https://example.com/successUrl',
        redirectFailure: 'https://example.com/failureUrl',
        notification: 'https://example.com/notificationUrl'
      },
      customer: {
        id: '241', //Customer id from your system, can be anything
        minAge: null, //optional
        kycRestriction: null, //optional
        countryRestriction: null //optional
      },
      shopId: null //optional, read official docs for more info
    });
    console.log('Payment link generated! ', response.redirect.auth_url)
    const PAYMENT_ID = response.id
    console.log('Store this id in your database for future use: ', PAYMENT_ID)
  } catch(e) {
    //Handle error
  }
}
```

#### Check payment status & capture it if succeded
```javascript
async () => {
  try {
    //Check if payment is completed
    const info = await psc.getPaymentInfo(PAYMENT_ID) //Payment id from previous request
    if(info.status == 'AUTHORIZED') {
      //Capture payment
      const captureInfo = await psc.capturePayment(PAYMENT_ID)
      if(captureInfo.status == 'SUCCESS') {
        /*
        Payment completed, update your database here
        */
      }
    }
  } catch(e) {
    //Handle error
  }
}

```
