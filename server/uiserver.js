import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import fileUpload from 'express-fileupload';
import render from './render.jsx';
import cors from 'cors';
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(fileUpload());

app.use('/upload-images', express.static(path.resolve(__dirname, '../uploaded-images')));
app.use('/', express.static('public'));

app.post('/uploaded-images', async (req, res) => {
    try {
        let pathname = '';
        let imageURLdashboard = req.files && req.files.imageURLdashboard ? req.files.imageURLdashboard : '';
        let logo = req.files && req.files.logo ? req.files.logo : '';
        let avatar = req.files && req.files.avatar ? req.files.avatar : '';
        if (imageURLdashboard != '') {
            const { name } = imageURLdashboard;
            pathname = path.resolve(__dirname, '../uploaded-images/' + name);
            imageURLdashboard.mv(pathname);
        }
        if (logo != '') {
            const { name } = logo;
            pathname = path.resolve(__dirname, '../uploaded-images/' + name);
            logo.mv(pathname);
        }
        if (avatar != '') {
            const { name } = avatar;
            pathname = path.resolve(__dirname, '../uploaded-images/' + name);
            avatar.mv(pathname);
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