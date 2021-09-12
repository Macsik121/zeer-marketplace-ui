import React from 'react';
import { CircularProgress } from '@material-ui/core';
import fetchData from '../fetchData';
import Graph from './Graph.jsx';

export default class Statistics extends React.Component {
    constructor() {
        super();
        this.state = {
            statisticTabs: [
                {
                    title: 'Всего пользователей',
                    value: 0
                },
                {
                    title: 'Активные подписки',
                    value: 0
                },
                {
                    title: 'Баны',
                    value: 0
                },
                {
                    title: 'Заработано за сегодня',
                    value: 0
                }
            ],
            isRequestMaking: true,
            purchases: []
        };
    }
    async componentDidMount() {
        this.setState({ isRequestMaking: true });
        let statisticTabs = this.state.statisticTabs;

        let users = await fetchData(`
            query {
                getUsers {
                    name
                    subscriptions {
                        title
                    }
                }
            }
        `);

        users = users.getUsers;

        let products = await fetchData(`
            query {
                products {
                    timeBought
                }
            }
        `);

        products = products.products;

        let purchases = await fetchData(`
            query {
                purchases {
                    date
                    boughtTime
                }
            }          
        `);

        purchases = purchases.purchases;
        const newPurchases = [];
        purchases.map(purchase => {
            purchase.value = purchase.boughtTime;
            delete purchase.boughtTime;
            newPurchases.push(purchase);
        });
        purchases = newPurchases;

        let subscriptionsAmount = 0;
        users.map(user => {
            subscriptionsAmount += user.subscriptions.length;
        });

        let earnedToday = 0;
        products.map(product => {
            earnedToday += product.timeBought;
        });

        statisticTabs.map(stat => {
            let { title } = stat;
            if (title == 'Всего пользователей') {
                stat.value = users.length;
            } else if (title == 'Активные подписки') {
                stat.value = subscriptionsAmount;
            } else if (title == 'Заработано за сегодня') {
                stat.value = earnedToday;
            }
        });

        this.setState({
            isRequestMaking: false,
            statisticTabs,
            purchases
        });
    }
    render() {
        const {
            isRequestMaking,
            statisticTabs,
            purchases
        } = this.state;

        const tabs = statisticTabs.map(stat => (
            <div key={stat.title} className="tab">
                <h3 className="stat-title">{stat.title}</h3>
                <span className="stat-value">{stat.value}</span>
            </div>
        ));

        return (
            <div className="statistics">
                <h2>Общая статистика</h2>
                <CircularProgress
                    className="progress-bar"
                    style={
                        {
                            display: isRequestMaking ? 'block' : 'none'
                        }
                    }
                />
                <div
                    className="statistics-wrap"
                    style={
                        {
                            opacity: isRequestMaking ? 0 : 1
                        }
                    }
                >
                    <div className="tabs">
                        {tabs}
                    </div>
                    <div className="graphs">
                        <Graph
                            className="earned-today"
                            date={new Date()}
                            array={purchases}
                            graphColor={'#1f7a1f'}
                            isRequestMaking={isRequestMaking}
                            graphTheme="Заработано за сегодня"
                        />
                    </div>
                </div>
            </div>
        )
    }
}
