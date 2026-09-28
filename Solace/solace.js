const solace = require('solclientjs').debug;
const { solace: cfg } = require('./config');

solace.SolclientFactory.init({
  profile: solace.SolclientFactoryProfiles.version10
});

function createSession() {
  return solace.SolclientFactory.createSession({
    url: cfg.host,
    vpnName: cfg.vpn,
    userName: cfg.user,
    password: cfg.pass
  });
}

module.exports = { solace, createSession };
