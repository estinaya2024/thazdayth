const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log("Test Connection to:", process.env.MONGODB_URI.split('@')[1] || "No URL found!");

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ SUCCESSFULLY CONNECTED TO ATLAS MONGODB!");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ CONNECTION FAILED:", err.message);
    process.exit(1);
  });
