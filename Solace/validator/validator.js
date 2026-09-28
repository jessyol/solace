const { solace, createSession } = require('../solace');
const { topics } = require('../config');

const session = createSession();

function publish(topic, payload) {
  const msg = solace.SolclientFactory.createMessage();
  msg.setDestination(solace.SolclientFactory.createTopicDestination(topic));
  msg.setBinaryAttachment(JSON.stringify(payload));
  session.send(msg);
}

function validate(payload) {
  const now = new Date();
  const pickup = new Date(payload.pickupDate);
  const delivery = new Date(payload.deliveryDate);

  // Regla 1: pickup no puede ser anterior a hoy
  if (pickup < now.setHours(0,0,0,0)) {
    return {
      shipperOrderId: payload.shipperOrderId,
      status: "Cancelled",
      notes: "Pickup date cannot be earlier than the current date."
    };
  }

  // Regla 2: si pickup es hoy, no puede ser después de las 3pm
  const today = new Date();
  if (pickup.toDateString() === today.toDateString()) {
    if (today.getHours() >= 15) {
      return {
        shipperOrderId: payload.shipperOrderId,
        status: "Cancelled",
        notes: "Pickup date cannot be today after 3pm."
      };
    }
  }

  // Regla 3: delivery debe ser mayor que pickup
  if (delivery <= pickup) {
    return {
      shipperOrderId: payload.shipperOrderId,
      status: "Cancelled",
      notes: "Delivery date must be after pickup date."
    };
  }

  // Regla 4: debe haber al menos 1 día de diferencia
  const diffDays = (delivery - pickup) / (1000 * 60 * 60 * 24);
  if (diffDays < 1) {
    return {
      shipperOrderId: payload.shipperOrderId,
      status: "Cancelled",
      notes: "Delivery date must be at least one day after pickup."
    };
  }

  // Si todo está bien → Accepted
  return {
    shipperOrderId: payload.shipperOrderId,
    status: "Accepted",
    notes: "You will receive an email when a carrier accepts this dispatch request",
    originalPayload: payload
  };
}

session.on(solace.SessionEventCode.UP_NOTICE, () => {
  console.log("[VALIDATOR] Conectado.");
  session.subscribe(
    solace.SolclientFactory.createTopicDestination(topics.routerInput),
    true,
    topics.routerInput,
    10000
  );
});

session.on(solace.SessionEventCode.MESSAGE, (msg) => {
  const payload = JSON.parse(msg.getBinaryAttachment().toString());
  const result = validate(payload);

  publish(topics.validatorResults, result);
});

session.connect();
