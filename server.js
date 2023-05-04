//import express, file system, and path
const express = require("express");
const fs = require("fs");
const path = require("path");
//import uniqid
const uniqid = require("uniqid");

//Port
const PORT = process.env.PORT || 3001;

//Create a new express app
const app = express();

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//GET /api/notes - Should read the db.json file and return all saved notes as JSON.
app.get("/api/notes", (req, res) => {
  const jsonData = JSON.parse(fs.readFileSync("./db/db.json"));
  console.log(jsonData);
  res.json(jsonData);
});

//POST /api/notes - Should receive a new note to save on the request body, add it to the db.json file,
//and then return the new note to the client.
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title: title,
      text: text,
      id: uniqid(),
    };
    //read db.json
    const jsonData = JSON.parse(fs.readFileSync("./db/db.json"));
    jsonData.push(newNote);

    //write to db.json
    fs.writeFileSync("./db/db.json", JSON.stringify(jsonData));
    res.json(jsonData);
  } else {
    res.json("Error in posting note");
  }
});

//DELETE /api/notes/:id - Should receive a query parameter containing the id of a note to delete.
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  //read db.json
  const jsonData = JSON.parse(fs.readFileSync("./db/db.json"));
  //filter out the note with the id
  const filteredData = jsonData.filter((note) => note.id !== id);
  //write to db.json
  fs.writeFileSync("./db/db.json", JSON.stringify(filteredData));
  res.json(filteredData);
});

//GET /notes - Should return the notes.html file.
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

//GET * - Should return the index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// app.listen(PORT, () => {
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
