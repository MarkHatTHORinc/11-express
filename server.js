// Setup root Directory
const rootDir = path.join(__dirname, "/public");

// Dependencies
const express = require("express");
const apiRoutes = require(`${rootDir}/assets/js/apiRoutes.js`);
const htmlRoutes = require(`${rootDir}/assets/js/htmlRoutes.js`);

// Create an express server
const app = express();

// Create a port (assign port to environment variable or to 8080 if no env var)
const port = process.env.PORT || 8080;


app.use(express.static("public"));

// Configure Express app for data parsing
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api", apiRoutes);
app.use("/", htmlRoutes);

app.listen(port, () => console.log(`Express HTTP Server is listening to port: ${port}.`));