import express from 'express';
import getCodes from './GetCodes';
import bodyParser from 'body-parser';
import cors from 'cors';
import generate from './Generate';
import auth from './Auth';
import db from '../db/models';

const port = 3000;
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/auth', auth);
app.use('/generate', generate);
app.get('/codes', getCodes);


app.get('/', (req, res) => {
    res.send('welcome to generate');
})

const dbconnection = db.sequelize;
dbconnection
  .authenticate()
  .then(() => {
    console.log('connection to database successful');
    app.listen(port, () => {
      console.log(`server start at port ${port}`);
    });
  })
  .catch((e) => {
    throw e.message;
  });

module.exports = db;