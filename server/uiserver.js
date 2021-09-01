import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import fileUpload from 'express-fileupload';
import render from './render.jsx';
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(fileUpload());

app.use('/upload-images', express.static(path.resolve(__dirname, '../uploaded-images')));
app.use('/', express.static('public'));

app.post('/uploaded-images', async (req, res) => {
    try {
        let imageURLdashboard = req.files && req.files.imageURLdashboard ? req.files.imageURLdashboard : '';
        let logo = req.files && req.files.logo ? req.files.logo : '';
        console.log(req.files);
        if (imageURLdashboard != '') {
            imageURLdashboard.mv(path.resolve(__dirname, '../uploaded-images/' + imageURLdashboard.name));
            console.log('imageURLdashboard.name:', imageURLdashboard.name);
        }
        if (logo != '') {
            logo.mv(path.resolve(__dirname, '../uploaded-images/' + logo.name));
            console.log('logo.name:', logo.name);
        }

        res.send('Everything is ok');
    } catch (error) {
        console.log(error);
    }
});

app.post('/confirmation-payment', (req, res) => {
    console.log(req.url);
    res.send('Ok');
});

app.get('*', render);

app.listen(port, () => console.log(`Server has successfully started with port ${port}`));