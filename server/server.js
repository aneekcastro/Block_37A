// Entry point of the application
// This file will start the Express server and configure middleware and routes

const express = require('express');
const app = express();

// Middleware and routes will be imported and used here

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
