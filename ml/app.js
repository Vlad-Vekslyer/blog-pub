const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const Sentence = require('./Sentence.js');
const sentence = new Sentence();

dotenv.config();
app.enable('trust proxy');
app.use(bodyParser.json());

app.post('/compare', async (req, res) => {
  const {current, incoming} = req.body;
  const scores = await sentence.compare(current, incoming);
  const average = Sentence.average(scores);
  res.json({isRelevant: Sentence.approximate(average)});
});

app.get('/test', async (req, res) => {
  const incoming = ['How old are you?', 'What is your phone model?'];
  const current = ['What is your age?', 'Can I borrow your cellphone model?'];
  const scores = await sentence.compare(current, incoming);
  const average = Sentence.average(scores);
  res.json({scores, average});
})

app.listen(3001, () => {
  console.log('Server is running on port 3001');
})
