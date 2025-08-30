require("dotenv").config();
const functions = require("firebase-functions");
const stripePackage = require("stripe");
const cors = require("cors")({origin: true});

// Initialize Stripe with environment variable (future-proof method)
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

/**
 * Creates a Stripe Payment Intent with dynamic pricing based on service type
 */
exports.createPaymentIntent = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    try {
      // Get service type from request body and calculate amount
      const {serviceType = "consultation"} = req.body;

      // Industry-standard pricing in CAD cents
      const pricingTable = {
        "Work in Canada": 500000, // $5,000 CAD
        "Study in Canada": 275000, // $2,750 CAD
        "Join Family": 500000, // $5,000 CAD
        "Visit Canada": 125000, // $1,250 CAD
        "Invest/Start a Business": 900000, // $9,000 CAD
        "consultation": 75000, // $750 CAD
        "Other": 75000, // $750 CAD
      };

      const amount = pricingTable[serviceType] || pricingTable["consultation"];
      const currency = "cad";

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          serviceType: serviceType,
          priceCAD: (amount / 100).toFixed(2),
        },
      });

      res.status(200).send({
        clientSecret: paymentIntent.client_secret,
        amount: amount,
        serviceType: serviceType,
      });
    } catch (error) {
      console.error("Error creating Payment Intent:", error);
      res.status(500).send({error: error.message});
    }
  });
});
