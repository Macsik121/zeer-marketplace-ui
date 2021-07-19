import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const bodyParser = require('body-parser');
import render from './render.jsx';
import auth from './middleware/auth';
const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use('/', express.static('public'));

app.get('/dashboard/', auth);
app.get('/dashboard/*', auth, render);

app.get('/changeavatar', auth, render);

app.get('*', auth, render);

app.listen(port, () => console.log(`Server has successfully started with port ${port}`));