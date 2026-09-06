const express = require("express");
const router = express.Router();
const { getUsuarios } = require("./db");

// GET /api/monitoreo/anomalias — monitor liviano de reglas de negocio
//
// No lee logs ni depende de una excepción: chequea patrones conocidos que
// "no deberían pasar" según la regla de negocio esperada, y devuelve una
// alerta puntual si encuentra algún caso. Es el equivalente simulado a un
// analista notando un número raro en un dashboard, o un chequeo de calidad
// de datos corriendo cada tanto (un cron liviano, no una auditoría de logs).
//
// Así es como se detecta el Bug 3 (lógica de negocio ambigua): no tira 500,
// pero sí genera una señal puntual y acotada que el simulador (Módulo 2)
// puede convertir directamente en un webhook hacia n8n, sin que el agente
// tenga que inspeccionar nada manualmente para enterarse de que hay un
// caso a diagnosticar.
router.get("/anomalias", (req, res) => {
  const alertas = getUsuarios()
    .filter((u) => u.compras >= 10 && u.edad < 18)
    .map((u) => ({
      tipo: "nivel_cliente_inconsistente",
      usuario_id: u.id,
      descripcion: `Usuario con ${u.compras} compras (alto valor) pero nivel forzado a "regular" por ser menor de edad. Revisar si la regla de negocio en /nivel-cliente es intencional.`,
      endpoint_afectado: `/api/usuarios/${u.id}/nivel-cliente`,
      severity: "medium",
    }));

  res.json({ anomalias_detectadas: alertas.length, alertas });
});

module.exports = router;
