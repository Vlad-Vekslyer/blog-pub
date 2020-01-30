const express = require('express');
const dotenv = require('dotenv');
const app = express();

const Sentence = require('./Sentence.js');
const sentence = new Sentence();

dotenv.config();
app.enable('trust proxy');

app.get('/', async (req, res) => {
  const incoming = ['How old are you?', 'What is your phone model?'];
  const current = ['What is your age?', 'Can I borrow your cellphone model?'];
  const score = await sentence.compare(current, incoming);
  res.send(score);
})

app.listen(3001, () => {
  console.log('Server is running on port 3001');
})
