const { solace, createSession } = require('../solace');
const { topics } = require('../config');

const session = createSession();

session.on(solace.SessionEventCode.UP_NOTICE, () => {
  console.log("[SHIPPER] Conectado a Solace.");

  // Suscripción al topic donde llegan los resultados
  session.subscribe(
    solace.SolclientFactory.createTopicDestination(topics.shipperResults),
    true,
    topics.shipperResults,
    10000
  );

  console.log(`[SHIPPER] Escuchando resultados en: ${topics.shipperResults}`);
});

session.on(solace.SessionEventCode.MESSAGE, (msg) => {
  const result = JSON.parse(msg.getBinaryAttachment().toString());

  console.log("\n==============================");
  console.log("RESULTADO DEL SISTEMA");
  console.log("==============================");
  console.log(JSON.stringify(result, null, 2));
  console.log("==============================\n");
});

session.connect();
