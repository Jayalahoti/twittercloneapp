// Importing necessary libraries and modules 
const express = require('express');
const fileRouter = express.Router();
const protectedRoute  = require('../middleware/protectedResource');
const { uploadProfileimg, downloadFile } = require('../controllers/file_controller');

// Upload user profile picture
fileRouter.post('/api/user/:id/uploadProfileimg', protectedRoute, uploadProfileimg);
// Download profile picture
fileRouter.get('/api/user/:id/downloadProfileimg/:fileName', downloadFile); 

// Exporting the Router
module.exports = fileRouter;