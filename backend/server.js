const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const searchRoutes = require('./routes/search');

const app = express();

// Connect to database before starting server
const startServer = async () => {
  await connectDB();
  
  app.use(cors());
  app.use(express.json());
  app.use('/api/search', searchRoutes);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();