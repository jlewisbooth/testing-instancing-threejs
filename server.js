/* Modules */
const express = require('express');
const path = require('path');
let public_route = '../public/';
let app = express();

app.use( (req,res,next) => {
    req.timestamp = new Date();
    next();
})

let port = 3000;

app.use(express.static('dist'));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'/dist/index.html'));
})

let server = app.listen(port, () => {
    console.log(`Web app listening on port ${port}!`)
})

