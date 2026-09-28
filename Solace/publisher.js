const { solace, createSession } = require('./solace');
const { topics } = require('./config');

const session = createSession();

session.on(solace.SessionEventCode.UP_NOTICE, () => {
  console.log("[PUBLISHER] Conectado a Solace.");

  const msg = solace.SolclientFactory.createMessage();
  msg.setDestination(solace.SolclientFactory.createTopicDestination(topics.publish));
  msg.setBinaryAttachment(JSON.stringify({
    orderId: "ORD-001",
    pickupDate: "2026-10-01",
    deliveryDate: "2026-10-05",
    price: 900
  }));

  session.send(msg);
  console.log("[PUBLISHER] Mensaje publicado.");
});

session.connect();
