const { solace, createSession } = require('../solace');
const { topics } = require('../config');

const session = createSession();

const colors = {
  info: "\x1b[36m",
  success: "\x1b[32m",
  warn: "\x1b[33m",
  error: "\x1b[31m",
  reset: "\x1b[0m"
};

function log(type, msg) {
  console.log(`${colors[type]}[${type.toUpperCase()}]${colors.reset} ${msg}`);
}

function createPayload() {
  return {
    shipperOrderId: "6600111",
    pickupDate: "2026-10-21",
    deliveryDate: "2026-10-22",
    price: 900,
    stops: [
      { stopNumber: 1, city: "Milford", state: "MA", postalCode: "01757" },
      { stopNumber: 2, city: "Shippensburg", state: "PA", postalCode: "17257" }
    ],
    vehicles: [
      { year: "2010", make: "Toyota", model: "Corolla" }
    ],
    transportationReleaseNotes:
      "Verify the pickup date; shipments cannot be delivered after 3:00 p.m. on the current date or on previous days."
  };

}

session.on(solace.SessionEventCode.UP_NOTICE, () => {
  log("success", "Simulador conectado a Solace.");
  log("info", "Enviando solicitud cada 5 segundos...");

  setInterval(() => {
    const payload = createPayload();
    const msg = solace.SolclientFactory.createMessage();
    msg.setDestination(solace.SolclientFactory.createTopicDestination(topics.routerInput));
    msg.setBinaryAttachment(JSON.stringify(payload));
    session.send(msg);

    log("success", `Payload enviado: ${JSON.stringify(payload)}`);
  }, 5000);
});

session.connect();
