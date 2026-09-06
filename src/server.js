const express = require("express");
const usuariosRouter = require("./usuarios");
const monitoreoRouter = require("./monitoreo");

const app = express();
app.use(express.json());

app.use(express.static(require("path").join(__dirname, "..", "public")));

app.use("/api/usuarios", usuariosRouter);
app.use("/api/monitoreo", monitoreoRouter);

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
