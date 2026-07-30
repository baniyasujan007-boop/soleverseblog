import app from "./app.js";
import connectDB from "./config/db.js";

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
