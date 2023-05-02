//import express, file system, and path
const express = require('express');
const fs = require('fs');
const path = require('path');
//import uniqid
const uniqid = require('uniqid');


//Port
const port = process.env.PORT || 3001;



//Create a new express app
const app = express();