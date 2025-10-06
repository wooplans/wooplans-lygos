import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/api/payment", async (req, res) => {
  try {
    const response = await fetch("https://api.lygos.net/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LYGOS_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Erreur Lygos:", error.message);
    res.status(500).json({ message: "Erreur lors de la création du paiement" });
  }
});

export default app;
