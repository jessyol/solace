module.exports = {
  solace: {
    host:  'wss://mr-connection-fsq8voip6jr.messaging.solace.cloud:443',
    vpn:   'newcron-dispatch-broker',
    user:  'solace-cloud-client',
    pass:  'tegj8647mbu07j7tsd00bmsvtv'
  },

  topics: {
    routerInput: "newcron/dispatch/router/in",
    validatorResults: "newcron/dispatch/validator",
    carrierRequests: "newcron/dispatch/requests",
    carrierResponses: "newcron/dispatch/responses",
    shipperResults: "newcron/dispatch/shipper"
  }
};
