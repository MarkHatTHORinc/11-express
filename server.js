// -----------------------------------------------------------------------------
// Program:  server.js
// Purpose:  1) Start Express server:
//           2) Handle Requests.
// Input:    <none>   
// -----------------------------------------------------------------------------
// Author:   Mark Harrison
// Date:     May 1, 2021
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// Global Variables Section
// -----------------------------------------------------------------------------
// Setup root Directory
const urljoin = require('url-join');
const rootDir = urljoin(__dirname, '/public');
const defaultPort = 8080;


// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------
const express = require('express');

// Create an express server
const router = express();

// Create a port (assign port to environment variable or to 8080 if no env var)
const port = process.env.PORT || defaultPort;

router.use(express.static('public'));

// Configure Express app for data parsing
router.use(express.json());
router.use(express.urlencoded({extended: true}));

// import routes files
require(`${rootDir}/assets/js/apiRoutes`)(router);
require(`${rootDir}/assets/js/htmlRoutes`)(router);

router.listen(port, () => console.log(`Express HTTP Server is listening to port: ${port}.`));