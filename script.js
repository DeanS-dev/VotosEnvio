import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: "btkmixmmet5yos9cgwzc-mysql.services.clever-cloud.com",
    user: "ubr8pl2an3d5wsyg",
    password: "ZDrrttGCCPfxcuE5V2bd",
    database: "btkmixmmet5yos9cgwzc",
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
        conn.release(); // 🔒 cierre inmediato

        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API lista en puerto", PORT));
