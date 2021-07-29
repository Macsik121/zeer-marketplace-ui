import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const bodyParser = require('body-parser');
import render from './render.jsx';
const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json({limit: '1000mb'}));
app.use(bodyParser.urlencoded({limit: '1000mb', extended: true}));

app.use('/', express.static('public'));

app.get('*', render);

app.listen(port, () => console.log(`Server has successfully started with port ${port}`));