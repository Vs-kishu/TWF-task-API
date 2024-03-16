require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const { calculateCost,totalWeightAtCenter } = require('./utils/helperfunction');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send('welcome to API')
})
// API Endpoint
app.post('/calculateCost', async (req, res) => {
    try {
        const order = req.body;
        const orders = totalWeightAtCenter(order);
        const cost = await calculateCost(orders);
        res.json({ cost });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
