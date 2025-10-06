// api/payment.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    const { amount, shop_name, order_id, message, success_url, failure_url } = req.body;

    // Validations basiques
    if (amount == null || !shop_name || !order_id) {
      return res.status(400).json({ message: "Paramètres manquants (amount, shop_name, order_id requis)" });
    }

    const payload = {
      amount,
      shop_name,
      order_id,
      message: message || "",
      success_url: success_url || "",
      failure_url: failure_url || ""
    };

    const response = await fetch("https://api.lygosapp.com/v1/gateway", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.LYGOS_API_KEY
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erreur Lygos:", data);
      return res.status(response.status).json({ message: "Erreur lors de la création du paiement", details: data });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erreur serveur Lygos:", error.message);
    return res.status(500).json({ message: "Erreur serveur lors de la création du paiement", error: error.message });
  }
}
