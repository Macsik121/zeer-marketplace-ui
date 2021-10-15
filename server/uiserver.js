import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import fileUpload from 'express-fileupload';
import store from '../src/store';
// import webpack from 'webpack';
// import webpackDevMiddleware from 'webpack-dev-middleware';
// import webpackHotMiddleware from 'webpack-hot-middleware';
// import webpackConfig from '../webpack.config';
import render from './render.jsx';
const app = express();
const port = process.env.PORT || 8000;
// const compiler = webpack(webpackConfig);

const uiEndpoint = store.__UI_SERVER_ENDPOINT__;
const apiEndpoint = store.__SERVER_ENDPOINT_ADDRESS;

app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(fileUpload());

app.use('/upload-images', express.static(path.resolve(__dirname, '../uploaded-images')));
app.use('/', express.static('public'));

app.post('/uploaded-images', (req, res) => {
    try {
        if (!req.files) {
            req.files = {};
        }
        let pathname = '';
        function whetherFileThere(img) {
            return req.files && img ? img : '';
        }
        function newPathname(name) {
            pathname = path.resolve(__dirname, '../uploaded-images/' + name);
        }
        let imageURLdashboard = whetherFileThere(req.files.imageURLdashboard);
        let logo = whetherFileThere(req.files.logo);
        let avatar = whetherFileThere(req.files.avatar);
        let mainpageBG = whetherFileThere(req.files.mainBG);
        if (imageURLdashboard != '') {
            const { name } = imageURLdashboard;
            newPathname(name);
            imageURLdashboard.mv(pathname);
        }
        if (logo != '') {
            const { name } = logo;
            newPathname(name);
            logo.mv(pathname);
        }
        if (avatar != '') {
            const { name } = avatar;
            newPathname(name);
            avatar.mv(pathname);
        }
        if (mainpageBG != '') {
            const { name } = mainpageBG;
            newPathname(name);
            mainpageBG.mv(pathname);
        }

        res.send('Everything is ok');
    } catch (error) {
        console.log(error);
    }
});

app.post(
    '/confirmation-payment/:name/:title/:cost/:days/:platform/:userAgent/:appName/:appVersion/:ip/:location/:splitDelimiter/:promoName',
    async (req, res) => {
        let {
            userAgent,
            promoName
        } = req.params;
        userAgent = userAgent.split(req.params.splitDelimiter);
        userAgent = userAgent.join('/');
        const {
            name,
            title,
            cost,
            platform,
            days,
            appName,
            appVersion,
            ip,
            location
        } = req.params;
        console.log(promoName);
        const variables = {
            name,
            title: decodeURIComponent(title),
            productCost: +cost,
            navigator: {
                platform,
                userAgent,
                appName,
                appVersion
            },
            locationData: {
                ip,
                location
            },
            days: +days,

        };
        const query = `
            mutation buyProduct(
                $title: String!,
                $name: String!,
                $navigator: NavigatorInput,
                $productCost: Int!,
                $days: Int!,
                $locationData: LocationInput!
            ) {
                buyProduct(
                    title: $title,
                    name: $name,
                    navigator: $navigator,
                    productCost: $productCost,
                    days: $days,
                    locationData: $locationData
                ) {
                    id
                    title
                    productFor
                    costPerDay
                    peopleBought {
                        avatar
                        name
                    }
                }
            }
        `;
        await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ query, variables })
        });
        if (promoName != 'null') {
            await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ query: `
                    mutation activatePromo($name: String!, $title: String!) {
                        activatePromo(name: $name, title: $title) {
                            message
                            success
                        }
                    }
                `, variables: {
                    name: promoName,
                    title
                } })
            });
        }
        res.redirect(`${uiEndpoint}/dashboard/subscriptions`);
    }
);

app.post('/failure-payment', (req, res) => {
    res.redirect(`${uiEndpoint}/dashboard/products`);
});

app.get('*', render);

app.listen(port, () => console.log(`Server has successfully started with port ${port}`));