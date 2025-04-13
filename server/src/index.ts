// server/src/index.ts
import app from "./app";
import express from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const __dirname = path.resolve();
console.log("Current directory:", __dirname);

const PORT = process.env.PORT || 5300;

if (process.env.NODE_ENV === "production") {
  // Serve frontend build files
  app.use(express.static(path.join(__dirname, "/client/dist")));
  
  // Handle React routing, return all requests to React app
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/dist/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
