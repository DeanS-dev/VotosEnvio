import express from "express";
import cors from "cors";
import { Pool } from "pg";

const app = express();
app.use(cors());
app.use(express.json());

// Pool usando variables de entorno
const pool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
});

app.post("/votar", async (req, res) => {
    try {
        console.log("Recibido voto:", req.body);

        const { candidato } = req.body;
        if (!candidato) return res.status(400).json({ success: false, msg: "Falta candidato" });

        // Solo insertamos el candidato
        await pool.query(
            "INSERT INTO votos (candidato) VALUES ($1)",
            [candidato]
        );

        res.json({ success: true, msg: `Voto por ${candidato} registrado` });
    } catch (err) {
        console.error("Error en /votar:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API lista en puerto ${PORT}`));
