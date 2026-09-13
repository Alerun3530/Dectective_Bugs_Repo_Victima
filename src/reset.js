const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { resetearDatos } = require("./db");

const CARPETA_ORIGINALES = path.join(__dirname, "..", "bugs-originales");
const CARPETA_SRC = __dirname;
const ARCHIVOS_CON_BUGS = ["usuarios.js", "db.js", "monitoreo.js"];

// POST /api/reset/datos — solo reinicia los usuarios en memoria (Sofía
// con 14 compras de vuelta, Luis con 17 años de vuelta si el Bug 1 se lo
// pisó, etc.). No toca el código, no hace falta reiniciar el servidor.
router.post("/datos", (req, res) => {
  resetearDatos();
  res.json({ ok: true, mensaje: "Datos reiniciados a los valores de fábrica." });
});

// POST /api/reset/codigo — restaura los 3 archivos con los bugs
// originales, pisando cualquier fix que el agente haya aplicado.
// IMPORTANTE: Node ya cargó el código viejo en memoria, así que esto
// NO alcanza solo con la llamada — hay que reiniciar el proceso
// (Ctrl+C y "npm start" de nuevo, o usar nodemon para que reinicie solo).
router.post("/codigo", (req, res) => {
  try {
    for (const archivo of ARCHIVOS_CON_BUGS) {
      const origen = path.join(CARPETA_ORIGINALES, archivo);
      const destino = path.join(CARPETA_SRC, archivo);
      fs.copyFileSync(origen, destino);
    }
    resetearDatos();
    res.json({
      ok: true,
      mensaje: "Código restaurado a la versión con bugs. Reiniciá el servidor (Ctrl+C y 'npm start') para que tome el cambio.",
      requiere_reinicio: true,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
