require('newrelic');

const dotenv = require('dotenv')
const DEFAULT_ENV = 'development';
process.env.NODE_ENV = process.env.NODE_ENV || DEFAULT_ENV
dotenv.config({path: `${__dirname}/../config/.env.${process.env.NODE_ENV}`})

console.log(process.env.INFURA_RPC_URL)

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const errorHandler = require("./helpers/error-handler");
const cardRoutes = require("./cards/routes/cards.routes")
const tokenRoutes = require("./tokens/routes/tokens.api")
const cors = require("cors");
const metaDataController = require("./tokens/controllers/metadata.controller");
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// allow cors requests from any origin and with credentials
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);
app.options('*', cors());



app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use(express.static(__dirname + '/public'));


app.use('/api/v1/cards', cardRoutes);
app.use('/api/v1/tokens', tokenRoutes)
app.use('/api/metadata/:id', metaDataController)
// app.get('*',function (req, res) {
//   res.redirect('/');
// });

app.use(errorHandler);

app.listen(80, (err) => {
  if (err) console.log(err);
  console.log(`Running ENV: ${process.env.NODE_ENV} -> server is running at http://localhost:80`);
});
