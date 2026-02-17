import express from "express";
import cors from "cors";
import { Pool } from "pg";

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    host: "dpg-d6adpg7gi27c73d28ti0-a.virginia-postgres.render.com",
    database: "votos_db_mc7x",
    user: "votos_db_mc7x_user",
    password: "TU_PASSWORD",
    port: 5432,
});

// Endpoint para votar
app.post("/votar", async (req, res) => {
    try {
        const { candidato } = req.body;
        if (!candidato) return res.status(400).json({ success: false });

        await pool.query(
            "INSERT INTO votos (candidato, ip_usuario) VALUES ($1, $2)",
            [candidato, req.ip]
        );

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API lista en puerto ${PORT}`));
