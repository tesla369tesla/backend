require('dotenv').config({ path: `${process.cwd()}/.env` });
const express = require('express');
const apiRouter = require('./route/authRoute');
const cors = require('cors');
const app = express();

app.use(express.json());
// app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
  }));

  app.use(cors({
    origin: 'http://localhost:4000'
  }));

app.use('/api/v1', apiRouter)

const PORT = process.env.APP_PORT || 4000;

app.listen(PORT, () => {
    console.log('Server up and running', PORT);
});