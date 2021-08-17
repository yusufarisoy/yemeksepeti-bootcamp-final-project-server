const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Routers
const cityRouter = require('./routes/cityRoutes');
const userRouter = require('./routes/userRoutes');
const orderRouter = require('./routes/orderRoutes');
const ratingRouter = require('./routes/ratingRoutes');
const addressRouter = require('./routes/addressRoutes');
const districtRouter = require('./routes/districtRoutes');
const restaurantRouter = require('./routes/restaurantRoutes');
const paymentTypeRouter = require('./routes/paymentTypeRoutes');

app.use('/api/users', userRouter);
app.use('/api/cities', cityRouter);
app.use('/api/orders', orderRouter);
app.use('/api/ratings', ratingRouter);
app.use('/api/addresses', addressRouter);
app.use('/api/districts', districtRouter);
app.use('/api/restaurants', restaurantRouter);
app.use('/api/payment-types', paymentTypeRouter);

app.get('/', (_req, res) => {
    res.json({ success: true, message: 'Welcome!' });
});

const port = process.env.PORT || 3000;
app.listen(port);