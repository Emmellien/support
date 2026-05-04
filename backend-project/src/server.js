const express = require('express');
const cors = require('cors');
require("dotenv").config();

const app = express();

app.use(express.json()); 
app.use(cors());

const db = require("./config/db");
const authRoutes = require('./router/auth');
const CarRouter = require('./router/car');
const ServicesRouter = require('./router/Servises');
const ServiceRecord = require('./router/SerciseRecord');
const PaymentRouter = require('./router/Payment');
const ReportRouter = require('./router/report');


app.use(express.json());
app.use(cors());


app.use('/api/auth', authRoutes);
app.use('/api',CarRouter);
app.use('/api', ServicesRouter);
app.use('/api/records',ServiceRecord);
app.use('/api', PaymentRouter);
app.use('/api', ReportRouter);

// test DB before starting server
//testConnection();

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`http://localhost:${PORT}`)
})





