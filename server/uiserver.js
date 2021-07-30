import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import render from './render.jsx';
const app = express();
const port = process.env.PORT || 8000;

// app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb'}));

app.use('/', express.static('public'));

app.get('*', render);

app.listen(port, () => console.log(`Server has successfully started with port ${port}`));