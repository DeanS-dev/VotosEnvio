import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 5
});

// ENDPOINT PARA VOTAR
app.post("/votar", async (req, res) => {
  try {
    const { candidato } = req.body;

    if (!candidato) {
      return res.status(400).json({ success: false });
    }

    const conn = await pool.getConnection();
    await conn.execute(
      "INSERT INTO votos (candidato, ip_usuario) VALUES (?, ?)",
      [candidato, req.ip]
    );
    conn.release();

    res.json({ success: true });
 } catch (err) {
    console.error("MYSQL ERROR:", err);
    res.status(500).json({
        success: false,
        error: err.message,
        code: err.code
    });
}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("API lista en puerto", PORT);
});

