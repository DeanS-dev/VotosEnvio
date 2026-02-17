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
    password: "ePqfI17J7gwMv7iK3tnH8iPdefKk2Rzy",
    port: 5432,
});

app.post("/votar", async (req, res) => {
    try {
        console.log("Recibido voto:", req.body);

        const { candidato } = req.body;
        if (!candidato) return res.status(400).json({ success: false, msg: "Falta candidato" });

        const ipUsuario = req.ip || req.headers["x-forwarded-for"] || "desconocido";

        await pool.query(
            "INSERT INTO votos (candidato, ip_usuario) VALUES ($1, $2)",
            [candidato, ipUsuario]
        );

        res.json({ success: true, msg: `Voto por ${candidato} registrado` });
    } catch (err) {
        console.error("Error en /votar:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API lista en puerto ${PORT}`));
