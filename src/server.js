require("dotenv").config();

const express = require("express");
const usuariosRouter = require("./usuarios");
const monitoreoRouter = require("./monitoreo");
const resetRouter = require("./reset");
const configRouter = require("./config");

const app = express();
app.use(express.json());

app.use(express.static(require("path").join(__dirname, "..", "public")));

app.use("/api/usuarios", usuariosRouter);
app.use("/api/monitoreo", monitoreoRouter);
app.use("/api/reset", resetRouter);
app.use("/api/config", configRouter);

// historial.html vive en src/, no en public/, así que necesita su
// propia ruta explícita (express.static solo sirve lo que está en public/).
app.get("/historial.html", (req, res) => {
  res.sendFile(require("path").join(__dirname, "historial.html"));
});

// Manejador simple de errores no controlados, para que el simulador de
// errores (Módulo 2) tenga un stack_trace legible para mandar a n8n.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: err.message,
    stack: err.stack,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`repo-victima corriendo en http://localhost:${PORT}`);
});
