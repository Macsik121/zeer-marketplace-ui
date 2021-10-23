import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import crypto from 'crypto';
// import webpack from 'webpack';
// import webpackDevMiddleware from 'webpack-dev-middleware';
// import webpackHotMiddleware from 'webpack-hot-middleware';
// import webpackConfig from '../webpack.config';
import render from './render.jsx';
const app = express();
const port = process.env.PORT || 8000;
// const compiler = webpack(webpackConfig);

const uiEndpoint = __UI_SERVER_ENDPOINT__;
const apiEndpoint = __SERVER_ENDPOINT_ADDRESS__;

app.use(cors());

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
    '/invoice-confirmation',
    (req, res) => {
        console.log('invoice confirmation has requested');
        res.send('YES');
    }
);

app.post(
    '/payment-notification',
    async (req, res) => {
        console.log('payment notif has requested');
        let {
            LMI_MERCHANT_ID,
            LMI_PAYMENT_NO,
            LMI_SYS_PAYMENT_ID,
            LMI_SYS_PAYMENT_DATE,
            LMI_PAYMENT_AMOUNT,
            LMI_CURRENCY,
            LMI_PAID_AMOUNT,
            LMI_PAID_CURRENCY,
            LMI_PAYMENT_SYSTEM,
            LMI_SIM_MODE,
            LMI_HASH,
            LMI_PAYER_IP_ADDRESS,
            __LOCATION__,
            __PRODUCT_TITLE__,
            __USER_AGENT__,
            __USERNAME__,
            __PRODUCT_COST__,
            __DAYS__
        } = req.body;
        let hash = `${LMI_MERCHANT_ID};${LMI_PAYMENT_NO};${LMI_SYS_PAYMENT_ID};${LMI_SYS_PAYMENT_DATE};${LMI_PAYMENT_AMOUNT};${LMI_CURRENCY};${LMI_PAID_AMOUNT};${LMI_PAID_CURRENCY};${LMI_PAYMENT_SYSTEM};${LMI_SIM_MODE};seezeergame`;
        hash = crypto
            .createHash('sha256')
            .update(hash)
            .digest('base64');

        if (hash != LMI_HASH) {
            res.status(400).send('Ты хотел нечестно фармить подписки? Хер тебе в задницу, мразь');
            return;
        }
        __USER_AGENT__ = __USER_AGENT__.split('-');
        __USER_AGENT__ = __USER_AGENT__.join('/');
        const variables = {
            name: decodeURIComponent(__USERNAME__),
            title: decodeURIComponent(__PRODUCT_TITLE__),
            productCost: +__PRODUCT_COST__,
            navigator: {
                // platform: decodeURIComponent(platform),
                userAgent: decodeURIComponent(__USER_AGENT__)
            },
            locationData: {
                ip: LMI_PAYER_IP_ADDRESS,
                location: __LOCATION__
            },
            days: +__DAYS__
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
        await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `
                    mutation {
                        updatePaymentNumber {
                            message
                            success
                        }
                    }
                `
            })
        });
        // if (promoName != 'null') {
        //     await fetch(apiEndpoint, {
        //         method: 'POST',
        //         headers: { 'Content-type': 'application/json' },
        //         body: JSON.stringify({ query: `
        //             mutation activatePromo(
        //                 $name: String!,
        //                 $title: String!,
        //                 $username: String!,
        //                 $navigator: NavigatorInput!,
        //                 $locationData: LocationInput!
        //             ) {
        //                 activatePromo(
        //                     name: $name,
        //                     title: $title,
        //                     username: $username,
        //                     navigator: $navigator,
        //                     locationData: $locationData
        //                 ) {
        //                     message
        //                     success
        //                 }
        //             }
        //         `, variables: {
        //             name: promoName,
        //             title,
        //             username: name,
        //             locationData: {
        //                 ip,
        //                 location
        //             },
        //             navigator: {
        //                 userAgent,
        //                 platform
        //             }
        //         } })
        //     });
        // }
        res.send('Everything is ok');
    }
);

app.get('/success-url', (req, res) => {
    res.redirect('/dashboard/subscriptions');
})

app.post('/failure-payment', (req, res) => {
    res.redirect(`${uiEndpoint}/dashboard/products`);
});

app.post('/loader.exe', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../src/images/loader.exe'));
});

app.post('/hashed-string', (req, res) => {
    const { string } = req.body;
    let newString = 'some string: ' + string;
    res.send(newString);
});

app.use('/', express.static(path.resolve(__dirname, '../src/Home/roots')));

app.get('*', render);

app.listen(port, () => console.log(`Server has successfully started with port ${port}`));