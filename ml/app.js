const express = require('express');
const dotenv = require('dotenv');
const app = express();

dotenv.config();
app.enable('trust proxy');

app.get('/', (req, res) => {
  res.send("This is the node server");
})

app.listen(3001, () => {
  console.log('Server is running on port 3001');
})
