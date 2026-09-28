const { solace, createSession } = require('./solace');

const session = createSession();

session.on(solace.SessionEventCode.UP_NOTICE, () => {
  console.log("✅ Conectado a Solace correctamente (UP_NOTICE).");
});

session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, (e) => {
  console.log("❌ Error de conexión:", e.infoStr);
});

session.on(solace.SessionEventCode.DISCONNECTED, () => {
  console.log("⚠️ Sesión desconectada.");
});

session.connect();
