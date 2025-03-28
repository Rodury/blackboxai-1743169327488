const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc'); // Test key

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// Mock database
let orders = [];

// Payment endpoint
app.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body;
    
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // in cents
            currency: 'usd',
        });
        
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Order endpoint
app.post('/api/orders', (req, res) => {
    const order = req.body;
    order.id = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
    order.date = new Date();
    orders.push(order);
    res.json({ success: true, orderId: order.id });
});

// Admin API
app.get('/api/orders', (req, res) => {
    if (!req.headers.authorization || req.headers.authorization !== 'Bearer admin123') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json(orders);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});