const express = require("express");
const router = express.Router();

// GET /api/config — expone SOLO lo que es seguro que viaje al navegador.
// Nunca poner acá una clave "secret" de ningún servicio.
router.get("/", (req, res) => {
  res.json({
    n8nWebhookUrl: process.env.N8N_WEBHOOK_URL || null,
    supabaseUrl: process.env.SUPABASE_URL || null,
    supabaseKey: process.env.SUPABASE_PUBLISHABLE_KEY || null,
  });
});

module.exports = router;
