const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;

const indexRoutes = require("./routes/index_routes");
const userRoutes = require("./routes/user_routes");

const connectDB = require('./config/mongodb');
connectDB();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/check', (req, res, next) => {
    res.send('Working good as fuck');
})
app.use("/", indexRoutes);
app.use("/api/users", userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

