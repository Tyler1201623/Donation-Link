const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

app.get('/stripe-key', (req, res) => {
    res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});
const app = express();

app.post('/create-payment-intent', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Donation'
                    },
                    unit_amount: req.body.amount
                },
                quantity: 1
            }],
            mode: 'payment',
            success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.BASE_URL}/cancel`        });

        res.json({ id: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/success.html'));
});

app.get('/cancel', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/cancel.html'));
});
