// Vercel Serverless Function — EventSphere Backend Entry Point
// Root package.json has all dependencies, so module resolution works correctly.

const app = require('../backend/server.js');

module.exports = app;
