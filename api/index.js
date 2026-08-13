// Vercel Serverless Function entry point
// This file connects Vercel's serverless runtime to our Express backend

const app = require('../backend/server.js');

module.exports = app;
