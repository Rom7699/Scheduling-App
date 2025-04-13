import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// For consistency between environments, use process.cwd()
const rootDir = process.cwd();
console.log("Current directory:", rootDir);

const PORT = process.env.PORT || 5300;

// Example API route - properly formatted
app.get('/api/health', (req, res) => {
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
  app.use(express.static(path.join(rootDir, "client/dist")));
  
  // The wildcard route should be LAST, after all API routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(rootDir, "client/dist/index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;