const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const taskRoutes = require('./routes/tasks');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/tasks', taskRoutes);

sequelize.sync().then(() => console.log('DB synced'));
  
app.listen(process.env.PORT || 5000, () => {
  console.log('Server running');
});