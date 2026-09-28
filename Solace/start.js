const { exec } = require("child_process");
const { solace, createSession } = require("./solace");
const { topics } = require("./config");

// Módulos que se lanzarán
const modules = [
  "dashboard/dashboard.js",
  "router/router.js",
  "validator/validator.js",
  "carrier/carrier.js",
  "shipper/shipper.js",
  "simulator/simulator.js"
];

// Lanzar todos los módulos como procesos hijos
function launchAllModules() {
  console.log("Iniciando todos los módulos...\n");

  modules.forEach((path) => {
    const process = exec(`node ${path}`);

    process.stdout.on("data", (data) => {
      console.log(`[${path}] ${data}`);
    });

    process.stderr.on("data", (data) => {
      console.error(`[ERROR en ${path}] ${data}`);
    });
  });
}

// SUPER VISOR: escucha resultados en tiempo real
function startResultViewer() {
  const session = createSession();

  session.on(solace.SessionEventCode.UP_NOTICE, () => {
    console.log("\n=== GLOBAL DISPATCH RESULT VIEWER ===");
    console.log("Conectado a Solace...");
    console.log("Escuchando resultados en:", topics.shipperResults);

    session.subscribe(
      solace.SolclientFactory.createTopicDestination(topics.shipperResults),
      true,
      topics.shipperResults,
      10000
    );
  });

 session.on(solace.SessionEventCode.MESSAGE, (msg) => {
  const payload = JSON.parse(msg.getBinaryAttachment().toString());

  console.log("\n------------------------------");
  console.log("RESULTADO DEL SISTEMA");
  console.log("Estado:", payload.status);
  console.log("Payload:");
  console.log(JSON.stringify(payload, null, 2));
  console.log("------------------------------\n");
});


  session.connect();
}

// Ejecutar todo automáticamente
launchAllModules();
startResultViewer();
