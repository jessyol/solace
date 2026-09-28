const { solace, createSession } = require('./solace');
const { topics } = require('./config');

const session = createSession();

session.on(solace.SessionEventCode.UP_NOTICE, () => {
  console.log("[SUBSCRIBER] Conectado a Solace.");

  session.subscribe(
    solace.SolclientFactory.createTopicDestination(topics.subscribe),
    true,
    topics.subscribe,
    10000
  );
});

session.on(solace.SessionEventCode.MESSAGE, (msg) => {
  const body = msg.getBinaryAttachment().toString();
  console.log("[SUBSCRIBER] Mensaje recibido:", body);
});

session.connect();
