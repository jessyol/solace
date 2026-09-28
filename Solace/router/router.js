const { solace, createSession } = require('../solace');
const { topics } = require('../config');

const session = createSession();

function publish(topic, payload) {
  const msg = solace.SolclientFactory.createMessage();
  msg.setDestination(solace.SolclientFactory.createTopicDestination(topic));
  msg.setBinaryAttachment(JSON.stringify(payload));
  session.send(msg);
}

session.on(solace.SessionEventCode.UP_NOTICE, () => {
  console.log("[ROUTER] Conectado.");

  session.subscribe(
    solace.SolclientFactory.createTopicDestination(topics.validatorResults),
    true,
    topics.validatorResults,
    10000
  );
});

session.on(solace.SessionEventCode.MESSAGE, (msg) => {
  const result = JSON.parse(msg.getBinaryAttachment().toString());

  if (result.status === "Accepted") {
    publish(topics.carrierRequests, result.originalPayload);
  } else {
    publish(topics.shipperResults, result);
  }
});

session.connect();
