// -----------------------------------------------------------------------------
// Program:  htmlRoutes.js
// Purpose:  Route http requests for html pages
// Input:    <router> Express server
// -----------------------------------------------------------------------------
// Author:   Mark Harrison
// Date:     May 1, 2021
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// Global Variables
// -----------------------------------------------------------------------------
// Setup root Directory
const urljoin = require('url-join');
const rootDir = __dirname.replace('assets\\js', '');;

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------
const htmlRoutes = (router) => {


    // -----------------------------------------------------------------------------
    // Route:    /notes
    // Purpose:  return the notes.html page
    // Input:    <request> 
    // Returns:  <response> 
    // -----------------------------------------------------------------------------
    router.get('/notes', (req, res) => {
        res.sendFile(urljoin(rootDir, '/notes.html'));
    });

    // -----------------------------------------------------------------------------
    // Route:    *
    // Purpose:  return the index.html page as a default
    // Input:    <request> 
    // Returns:  <response> 
    // -----------------------------------------------------------------------------
    router.get('*', (req, res) => {
        res.sendFile(urljoin(rootDir, '/index.html'));
    });

};

// export this so server.js can use it
module.exports = htmlRoutes;