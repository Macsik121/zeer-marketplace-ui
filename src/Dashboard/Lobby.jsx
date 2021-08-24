import React from 'react';
import { Link } from 'react-router-dom';
import SlickSlider from 'react-slick';
import { CircularProgress } from '@material-ui/core';
import { fetchPopularProducts } from '../PopularProducts.jsx';
import BoughtPeople from '../BoughtPeople.jsx';

export default class Lobby extends React.Component {
    render() {
        const {
            user,
            userAvatar,
            subscriptions,
            deviceWidth,
            buyProduct,
            isRequestMaking
        } = this.props;
    
        const sliderSettings = {
            infinite: true,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 3,
            autoplaySpeed: 7500,
            responsive: [
                {
                    breakpoint: 1180,
                    settings: {
                        arrows: false
                    }
                }
            ]
        };
        let popularProducts;
        if (this.props.popularProducts.length > 0) {
            popularProducts = this.props.popularProducts.map(product => {
                return (
                    <div className="popular-product" style={{width: '370px'}} key={product.id}>
                        <img
                            className="cover"
                            style={{ width: '330px' }}
                            src={product.imageURLdashboard}
                        />
                        <div className="title">
                            <h3 className="product-title">{product.title}{' | '}<span className="product-for">{product.productFor}</span></h3>
                        </div>
                        <span className="description">{product.description}</span>
                        <BoughtPeople people={product.peopleBought} />
                        <div className="buttons">
                            <button className="button" onClick={() => buyProduct(product.title)}>Купить</button>
                            <Link className="button" to={`/dashboard/products/${product.title}`}>Подробнее</Link>
                        </div>
                    </div>
                )
            });
        }
        return (
            <div className="lobby">
                <div className="container">
                    <h2 className="welcome">
                        Добро пожаловать,&nbsp;
                        <span
                            className="user-avatar-wrap"
                            style={
                                {
                                    opacity: Object.keys(user).length > 1 ? 1 : 0
                                }
                            }
                        >
                            {
                                user.name
                                    ? user.name
                                    : 'имя'
                            }
                        </span>!
                    </h2>
                    <div className="general-info">
                        <div className="info">
                            <div className="user">
                                <div className="general">
                                    <div
                                        className="avatar"
                                        style={userAvatar}
                                    >
                                        <span className="first-char">
                                            {
                                                user.nameFirstChar
                                            }
                                        </span>
                                    </div>
                                    <div className="data">
                                        <span className="user-name">{user.name}</span>
                                        <span className="user-email">{user.email}</span>
                                    </div>
                                </div>
                                <div className="buttons">
                                    <button className="download-loader button">Скачать лоадер</button>
                                    <Link className="subs button" to={`/dashboard/subscriptions`}>
                                        Подписки
                                    </Link>
                                </div>
                            </div>
                            <div className="subscriptions">
                                <Link className="subscription all" to={`/dashboard/subscriptions`}>
                                    <div className="all subs">
                                        <div className="amount">{subscriptions.all.length}</div>
                                        <div className="type">Всего</div>
                                    </div>
                                    <div className="linear-gradient-bg all" />
                                    <img src="/images/all.png" className="subscription-character" />
                                </Link>
                                <Link className="subscription active" to={`/dashboard/subscriptions`}>
                                    <div className="active subs">
                                        <div className="amount">{subscriptions.active.length}</div>
                                        <div className="type">Активные</div>
                                    </div>
                                    <div className="linear-gradient-bg active" />
                                    <img src="/images/active.png" className="subscription-character" />
                                </Link>
                                <Link className="subscription overdue" to={`/dashboard/subscriptions`}>
                                    <div className="overdue subs">
                                        <div className="amount">{subscriptions.overdue.length}</div>
                                        <div className="type">Просроченные</div>
                                    </div>
                                    <div className="linear-gradient-bg overdue" />
                                    <img src="/images/overdue.png" className="subscription-character" />
                                </Link>
                            </div>
                        </div>
                        <div className="opportunities">
                            <div className="reset opportunity">
                                <h2>Сброс привязки</h2>
                                <img src="/images/reset.png" className="character" />
                                <span className="content">
                                    Убедитесь, что вы не "нарушаете правила"
                                </span>
                                <div className="links">
                                    <Link to={`/dashboard/reset-binding`}>
                                        Перейти
                                    </Link>
                                    <Link to="/dashboard/FAQ">
                                        Правила
                                    </Link>
                                </div>
                            </div>
                            <div className="questions opportunity">
                                <h2>Собрали наиболее актуальные<br /> ответы на вопросы</h2>
                                <img src="/images/answers_to_questions.png" className="character" />
                                <Link className="explore" to="/dashboard/FAQ">
                                    Изучить
                                </Link>
                            </div>
                        </div>
                        <div className="video">
                            <img src="/images/play-button.svg" className="play" />
                            <div className="watch" />
                        </div>
                    </div>
                    <h2 className="popular-products">Популярные продукты</h2>
                    {
                        deviceWidth > 1080
                            ? (
                                isRequestMaking
                                    ? (
                                        <CircularProgress
                                            style={
                                                {
                                                    display: (
                                                        isRequestMaking ? 'block' : 'none'
                                                    ),
                                                    margin: '50px auto 0 auto'
                                                }
                                            }
                                       />
                                    )
                                    : (
                                        <SlickSlider
                                            className="popular-products-slider"
                                            {...sliderSettings}
                                            style={
                                                isRequestMaking
                                                    ? { opacity: 0 }
                                                    : { opacity: 1 }
                                            }
                                        >
                                            {popularProducts}
                                            {popularProducts}
                                        </SlickSlider>
                                    )
                            )
                            : (
                                <div className="popular-products-slides">
                                    {popularProducts}
                                </div>
                            )
                    }
                </div>
            </div>
        )
    }
}
