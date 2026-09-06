# README interno — Bugs plantados

Este documento es **solo para el equipo**, sirve para verificar durante las pruebas
que el diagnóstico del agente coincide con el bug real. No se muestra en la demo.

| # | Endpoint | Tipo | Gravedad | Bug real | Cómo se detecta | Comportamiento esperado del agente |
|---|----------|------|----------|----------|-------------------|-------------------------------------|
| 1 | `GET /api/usuarios/:id/es-mayor-de-edad` | Typo / variable mal escrita | Bajo riesgo | `src/usuarios.js` usa `usuarioo.edad` (typo) en vez de `usuario.edad`. Tira `ReferenceError` → 500. | Excepción real: la agarra el simulador de errores (Módulo 2) como haría Sentry/Datadog. | Diagnostica y aplica el fix solo. |
| 2 | `POST /api/usuarios` | Falta validación de null / input vacío | Bajo riesgo | `src/usuarios.js` llama `.trim()` sobre `datos.nombre` y `datos.email` sin chequear que existan. Tira `TypeError` → 500. | Excepción real, igual que el Bug 1. | Diagnostica y aplica el fix solo (agregar validación de campos requeridos, responder 400). |
| 3 | `GET /api/usuarios/:id/nivel-cliente` | Lógica de negocio ambigua | Alto riesgo | Un cliente con 10+ compras pero menor de 18 años queda forzado a nivel `"regular"` en vez de `"vip"`. No hay excepción — el endpoint responde 200 con un resultado "raro". | No tira error. Se detecta con `GET /api/monitoreo/anomalias`, un chequeo liviano de patrones de negocio conocidos (sin revisar logs) que devuelve la alerta puntual si encuentra el caso. | Diagnostica pero **escala a un humano**, no toca el código (o aplica el fix con `confianza: "baja"`, según la variante que estén usando en el Módulo 5). |

## Cómo disparar cada bug manualmente (para pruebas antes de la demo)

```bash
# Bug 1 — cualquier id existente (1 a 5) tira 500 por el ReferenceError
curl http://localhost:3000/api/usuarios/2/es-mayor-de-edad

# Bug 2 — mandar un body sin "nombre" o sin "email"
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"edad": 25}'

# Bug 3 — no se dispara, se CONSULTA: el monitor ya detecta a Sofía (id 5)
# porque está precargada con 14 compras y 16 años.
curl http://localhost:3000/api/monitoreo/anomalias
```

## Payload sugerido para el simulador de errores (Módulo 2)

Para Bug 1 y Bug 2, capturar el stack trace real del error 500 y armar el
payload según el formato definido en el plan:

```json
{
  "error_id": "uuid-generado",
  "timestamp": "2026-09-04T10:00:00Z",
  "stack_trace": "<stack real capturado del endpoint que falló>",
  "endpoint": "/api/usuarios/:id/es-mayor-de-edad",
  "severity": "low",
  "repo_path": "/ruta/al/repo-victima"
}
```

Para Bug 3, como no hay stack trace, el payload usa el campo `descripcion`
de la alerta que devuelve `/api/monitoreo/anomalias` en vez de `stack_trace`:

```json
{
  "error_id": "uuid-generado",
  "timestamp": "2026-09-04T10:00:00Z",
  "descripcion": "Usuario con 14 compras (alto valor) pero nivel forzado a \"regular\" por ser menor de edad. Revisar si la regla de negocio en /nivel-cliente es intencional.",
  "endpoint": "/api/usuarios/5/nivel-cliente",
  "severity": "medium",
  "repo_path": "/ruta/al/repo-victima"
}
```
