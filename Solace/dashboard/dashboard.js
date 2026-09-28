const { solace, createSession } = require('../solace');
const { topics } = require('../config');

const session = createSession();

session.on(solace.SessionEventCode.UP_NOTICE, () => {
  console.log("[DASHBOARD] Conectado.");

  Object.values(topics).forEach(t => {
    session.subscribe(
      solace.SolclientFactory.createTopicDestination(t),
      true,
      t,
      10000
    );
    console.log(`[DASHBOARD] Suscrito a: ${t}`);
  });
});

session.on(solace.SessionEventCode.MESSAGE, (msg) => {
  const topic = msg.getDestination().getName();
  const payload = JSON.parse(msg.getBinaryAttachment().toString());

  console.log("\n--- EVENTO ---");
  console.log("Topic:", topic);
  console.log("Payload:", payload);
  console.log("--------------\n");
});

session.connect();
