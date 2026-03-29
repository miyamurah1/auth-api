require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./db');
const authRoutes   = require('./routes/auth');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',  // your React port
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use('/', authRoutes);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});