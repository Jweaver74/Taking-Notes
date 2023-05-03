//import express, file system, and path
const express = require("express");
const fs = require("fs");
const path = require("path");
//import uniqid
const uniqid = require("uniqid");

//Port
const port = process.env.PORT || 3001;

//Create a new express app
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("./public"));

//GET /notes - Should return the notes.html file.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

//GET * - Should return the index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

//GET /api/notes - Should read the db.json file and return all saved notes as JSON.
app.get("/api/notes", (req, res) => {
  fs.readFile("./public/notes.html", "utf8", (err, data) => {
    const jsonData = JSON.parse(data);
    console.log(jsonData);
    res.json(jsonData);
  });
});

//reads the db.json file and returns all saved notes as JSON
const readThenAppend = (content, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToNoteFile(file, parsedData);
    }
  });
};

//POST /api/notes - Should receive a new note to save on the request body, add it to the db.json file,
//and then return the new note to the client.
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  if (req.body) {
    const newNote = {
      title: title,
      text: text,
      id: uniqid(),
    };
    readThenAppend(newNote, "./db/db.json");
    const response = {
      status: "success",
      body: newNote,
    };
    res.json(response);
  } else {
    res.json("Error in posting note");
  }
});
