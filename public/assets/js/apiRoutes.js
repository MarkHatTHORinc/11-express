// -----------------------------------------------------------------------------
// Program:  apiRoutes.js
// Purpose:  Route http requests for API services
// Input:    <router> Express server
// -----------------------------------------------------------------------------
// Author:   Mark Harrison
// Date:     May 1, 2021
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------
// Node library package for reading and writing files
const fs = require("fs");


// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------
const apiRoutes = (router) => {

    // -----------------------------------------------------------------------------
    // Route:    GET /api/notes
    // Purpose:  Get and return saved notes from JSON file on disk
    // Input:    <request> 
    // Returns:  <response> 
    // -----------------------------------------------------------------------------    
    router.get('/api/notes', (req, res) => {
        let savedNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
        res.json(savedNotes);
    });


    // -----------------------------------------------------------------------------
    // Route:    POST /api/notes
    // Purpose:  Add new note to JSON file and return full list of notes
    // Input:    <request> 
    // Returns:  <response> 
    // -----------------------------------------------------------------------------
    router.post('/api/notes', (req, res) => {
        let savedNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
        let newNote = req.body;
        let uniqueID = (savedNotes.length).toString();
        newNote.id = uniqueID;
        savedNotes.push(newNote);

        fs.writeFileSync('./db/db.json', JSON.stringify(savedNotes));
        res.json(savedNotes);
    });


    // -----------------------------------------------------------------------------
    // Route:    DELETE /api/notes/:id
    // Purpose:  Delete note and return saved notes from JSON file on disk
    // Input:    <request> 
    // Returns:  <response> 
    // -----------------------------------------------------------------------------
    router.delete('/api/notes/:id', (req, res) => {
        let savedNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
        let noteID = req.params.id;
        let newID = 0;
        savedNotes = savedNotes.filter(currNote => {
            return currNote.id != noteID;
        });

        for (currNote of savedNotes) {
            currNote.id = newID.toString();
            newID++;
        };

        fs.writeFileSync('./db/db.json', JSON.stringify(savedNotes));
        res.json(savedNotes);
    });
    
};

// export this so server.js can use it
module.exports = apiRoutes;