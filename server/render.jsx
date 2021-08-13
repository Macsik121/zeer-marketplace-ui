import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';
import Routing from '../src/Routing.jsx';
import template from './template';

export default function render(req, res) {
    const element = (
        <StaticRouter location={req.url} context={{}}>
            <Routing />
        </StaticRouter>
    )
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(ip);

    const body = ReactDOMServer.renderToString(element);
    res.send(template(body));
};