// Patches
const {inject, errorHandler} = require('express-custom-error');
inject(); // Patch express in order to use async / await syntax

// Require Dependencies
const express = require('express');

// Load .env Enviroment Variables to process.env
require('mandatoryenv').load([
    'PORT',
]);

const { PORT } = process.env || 80;

// Instantiate an Express Application
const app = express();

// Configure Express App Instance
app.use(express.json( { limit: '50mb' } ));
app.use(express.urlencoded( { extended: true, limit: '10mb' } ));

// Assign Routes
const router = require('./routes/router')
app.use(router)

// Send HTML with Vue scripts
const serveStatic = require('serve-static');
app.use(serveStatic(__dirname + "/dist"));

// Handle errors
app.use(errorHandler());

// Handle not valid route
app.use('*', (req, res) => {
    res
    .status(404)
    .json( {status: false, message: 'Endpoint Not Found'} );
})

// Open Server on selected Port

app.listen(
    PORT,
    () => console.info('Server listening on port ', PORT)
);