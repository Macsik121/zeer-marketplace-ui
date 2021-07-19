import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
// import 'bootstrap/scss/bootstrap.scss';
import '../src/styles/style.css';
import '../src/styles/notfound.css';
// importing images:
import'../src/images/zeer-logo.png';import'../src/images/zeer-favicon.png';import'../src/images/logo-not-found.png';import'../src/images/download-loader.png';import'../src/images/vk-icon.png';import'../src/images/telegram-icon.png';import'../src/images/arrow-left.png';import'../src/images/arrow-right.png';import'../src/images/backgrounds/esp_wallhack.png';import'../src/images/backgrounds/hwid-spoofer.png';import'../src/images/backgrounds/zeer-changer.png';import'../src/images/backgrounds/tournament.png';import'../src/images/backgrounds/damage_plus.png';import'../src/images/red-dot.png';import'../src/images/Home.svg';import'../src/images/Category.svg';import'../src/images/Path.svg';import'../src/images/Folder.svg';import'../src/images/user-menu-arrow.png';import'../src/images/backgrounds/CS-GO.png';import'../src/images/backgrounds/apex-legends.png';import'../src/images/step1-icon.png';import'../src/images/step2-icon.png';import'../src/images/step3-icon.png';import'../src/images/step4-icon.png';import'../src/images/Ellipse 1.png';

import Routing from '../src/Routing.jsx';

function App() {
    return (
        <BrowserRouter>
            <Routing />
        </BrowserRouter>
    )
}

ReactDOM.hydrate(
    <App />,
    document.getElementById('content')
);
