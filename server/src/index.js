"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var express_1 = require("express");
var cors_1 = require("cors");
var dotenv_1 = require("dotenv");
// Initialize environment variables
dotenv_1.default.config();
// Create Express app
var app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// For consistency between environments, use process.cwd()
var rootDir = process.cwd();
console.log("Current directory:", rootDir);
var PORT = process.env.PORT || 5300;
// Example API route - properly formatted
app.get('/api/health', function (req, res) {
    res.json({ status: 'OK', message: 'API is running' });
});
// If you have routes with parameters, ensure they are properly formatted
// CORRECT: app.get('/api/users/:userId', userController.getUser);
// INCORRECT: app.get('/api/users/:', userController.getUser);
// INCORRECT: app.get('https://example.com', userController.getUser);
// Add your actual API routes here
// app.use('/api/users', userRoutes);
// etc.
// Serve static files in production
if (process.env.NODE_ENV === "production") {
    // Serve frontend build files
    app.use(express_1.default.static(path_1.default.join(rootDir, "client/dist")));
    // The wildcard route should be LAST, after all API routes
    app.get("*", function (req, res) {
        res.sendFile(path_1.default.join(rootDir, "client/dist/index.html"));
    });
}
// Start server
app.listen(PORT, function () {
    console.log("Server running on port ".concat(PORT));
});
exports.default = app;
