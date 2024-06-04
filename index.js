//Import express
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
//Import router
const router = require('./router/routes.js')

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Add headers in order to avoid cross origin problems
app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

//We indicate the router to use
app.use(router);
//App listening
app.listen(port,() => {
    console.log(`Server running on port ${port}`);
});