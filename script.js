import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false } // 🔑 CLAVE EN RENDER
});

app.post("/votar", async (req, res) => {
  try {
    const { candidato } = req.body;

    if (!candidato) {
      return res.status(400).json({ success: false, msg: "Falta candidato" });
    }

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    await pool.query(
      "INSERT INTO votos (candidato, ip_usuario) VALUES ($1, $2)",
      [candidato, ip]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("ERROR POST /votar:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API lista en puerto", PORT));
