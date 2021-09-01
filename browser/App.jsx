import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
// libraries
import 'normalize.css/normalize.css';
// import 'react-notifications/lib/notifications.css';
// my styles
import '../src/styles/notfound.css';
import '../src/styles/style.css';
// importing images:
import'../src/images/zeer-logo.png';import'../src/images/zeer-favicon.png';import'../src/images/logo-not-found.png';import'../src/images/download-loader.png';import'../src/images/vk-icon.png';import'../src/images/telegram-icon.png';import'../src/images/arrow-left.png';import'../src/images/arrow-right.png';import'../src/images/backgrounds/esp_wallhack.png';import'../src/images/backgrounds/hwid-spoofer.png';import'../src/images/backgrounds/zeer-changer.png';import'../src/images/backgrounds/tournament.png';import'../src/images/backgrounds/damage_plus.png';import'../src/images/red-dot.png';import'../src/images/Home.svg';import'../src/images/Category.svg';import'../src/images/Path.svg';import'../src/images/Folder.svg';import'../src/images/user-menu-arrow.png';import'../src/images/backgrounds/CS-GO.png';import'../src/images/backgrounds/apex-legends.png';import'../src/images/step1-icon.png';import'../src/images/step2-icon.png';import'../src/images/step3-icon.png';import'../src/images/step4-icon.png';import'../src/images/Ellipse 1.png';import'../src/images/Rectangle.png';import'../src/images/search-icon.png';import'../src/images/categories-arrow-menu.png';import'../src/images/backgrounds/all.png';import'../src/images/backgrounds/active.png';import'../src/images/backgrounds/overdue.png';import'../src/images/play-button.svg';import'../src/images/selected-cost.png';import'../src/images/step1-character.png';import'../src/images/step2-character.png';import'../src/images/step3-character.png';import'../src/images/step4-character.png';import'../src/images/step1-icon.png';import'../src/images/step2-icon.png';import'../src/images/step3-icon.png';import'../src/images/step4-icon.png';import'../src/images/advantage1-icon.png';import'../src/images/advantage2-icon.png';import'../src/images/advantage3-icon.png';import'../src/images/advantage4-icon.png';import'../src/images/advantage5-icon.png';import'../src/images/advantage6-icon.png';import'../src/images/advantage1-character.png';import'../src/images/advantage2-character.png';import'../src/images/advantage3-character.png';import'../src/images/advantage4-character.png';import'../src/images/advantage5-character.png';import'../src/images/advantage6-character.png';import'../src/images/field-shown.png';import'../src/images/closed-eye.png';import'../src/images/backgrounds/answers_to_questions.png';import'../src/images/backgrounds/reset.png';import'../src/images/backgrounds/morgh.jpg';import'../src/images/backgrounds/trash.jpg';import'../src/images/backgrounds/graphics-card.jpg';import"../src/images/backgrounds/i'm10.jpg";import'../src/images/answer-not-found.png';import'../src/images/entries-icon.png';import'../src/images/lock-icon.png';import'../src/images/pencil-icon.png';import'../src/images/done-status.png';import'../src/images/waiting-status.png';import'../src/images/unsuccessful-status.png';import'../src/images/search-icon-admin.png';import'../src/images/alfa-bank-logo.png';import'../src/images/brs-logo.png';import'../src/images/maestro-logo.png';import'../src/images/mastercard-logo.png';import'../src/images/paymaster-standart-logo.png';import'../src/images/qiwi-logo.png';import'../src/images/sbp-logo.png';import'../src/images/visa-logo.png';import'../src/images/vtb-logo.png';import'../src/images/webmoney-logo.png';
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
