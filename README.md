# solace
GLOBAL DISPATCH – NewCron
Este proyecto implementa un sistema distribuido para procesar solicitudes de transporte de vehículos utilizando Solace Cloud como plataforma de mensajería. Cada componente funciona como un microservicio independiente en Node.js y se comunica mediante tópicos.

El sistema valida solicitudes, las enruta según su estado, permite que los carriers acepten o rechacen cargas y devuelve el resultado final al shipper.

---------------------------------------------------------------------------------------------------------------------------------------------------

Descripción del sistema
NewCron recibe solicitudes de transporte generadas por un simulador.
Cada solicitud pasa por un proceso:

-Validación de reglas de negocio.
-Enrutamiento según el resultado.
-Aceptación o rechazo por parte del carrier.
-Notificación final al shipper.

El archivo start.js ejecuta todos los módulos y muestra los resultados en la consola principal.

---------------------------------------------------------------------------------------------------------------------------------------------------

Arquitectura

Simulador → Validator → Router → Carrier → Shipper
                         ↓
                      Dashboard

----------------------------------------------------------------------------------------------------------------------------------------------------

Estructura del proyecto

Solace/
│
├── config.js
├── solace.js
├── start.js
│
├── simulator/
│     └── simulator.js
│
├── validator/
│     └── validator.js
│
├── router/
│     └── router.js
│
├── carrier/
│     └── carrier.js
│
├── shipper/
│     └── shipper.js
│
└── dashboard/
      └── dashboard.js

---------------------------------------------------------------------------------------------------------------------------------------------------

