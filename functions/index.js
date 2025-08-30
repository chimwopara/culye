/**
 * Important: Make sure to install dependencies in your functions folder
 * by running `npm install stripe cors` in your terminal.
 * The firebase-functions and firebase-admin are already in your package.json.
 */
const functions = require("firebase-functions");
const {defineSecret} = require("firebase-functions/v2/params");
const stripePackage = require("stripe");
const cors = require("cors")({origin: true});
// Define the Stripe secret key using the new, recommended method.
// This tells Firebase that our function needs a secret named STRIPE_SECRET_KEY.
const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");
// To optimize performance, we'll initialize the Stripe client once.
let stripe;
/**
 * Creates a Stripe Payment Intent.
 * This is now a v2 function that is configured to access our defined secret.
 */
exports.createPaymentIntent = functions
    .runWith({secrets: [stripeSecretKey]})
    .https.onRequest((req, res) => {
        // Initialize the Stripe client on the first function invocation.
        if (!stripe) {
            stripe = stripePackage(stripeSecretKey.value());
        }
        // Use the cors middleware to handle requests from your website.
        cors(req, res, async () => {
            if (req.method !== "POST") {
                return res.status(405).send("Method Not Allowed");
            }
            try {
                const amount = 100000; // C$1000.00 in cents
                const currency = "cad";
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: amount,
                    currency: currency,
                    automatic_payment_methods: {
                        enabled: true,
                    },
                });
                res.status(200).send({
                    clientSecret: paymentIntent.client_secret,
                });
            } catch (error) {
                console.error("Error creating Payment Intent:", error);
                res.status(500).send({error: error.message});
            }
        });
    });