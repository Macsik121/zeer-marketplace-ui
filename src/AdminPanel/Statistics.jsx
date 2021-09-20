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
            purchases: [],
            profit: []
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
                    status {
                        isBanned
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

        const currentDate = new Date();
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const currentDay = new Date().getDay();
        currentDate.setDate(currentDate.getDate() - currentDay);

        const vars = {
            week: {
                from: new Date(new Date(currentDate).toISOString().substr(0, 10)),
                to: new Date(`${currentYear}/${currentMonth}/${currentDate.getDate() + 7}`)
            }
        };

        let purchases = await fetchData(`
            query purchases($week: WeekInput) {
                purchases(week: $week) {
                    date
                    boughtTime
                }
            }
        `, vars);
        let profit = await fetchData(`
            query profit($week: WeekInput!) {
                profit(week: $week) {
                    date
                    cost
                }
            }
        `, vars);

        purchases = purchases.purchases;
        profit = profit.profit;

        const newPurchases = [];
        const newProfit = [];
        purchases.map(purchase => {
            purchase.value = purchase.boughtTime;
            delete purchase.boughtTime;
            newPurchases.push(purchase);
        });
        purchases = newPurchases;

        profit.map(currentProfit => {
            currentProfit.value = currentProfit.cost;
            delete currentProfit.cost;
            newProfit.push(currentProfit);
        });

        let subscriptionsAmount = 0;
        users.map(user => {
            subscriptionsAmount += user.subscriptions.length;
        });

        const earnedToday = profit[new Date().getDay()].value;

        let bannedUsersAmount = 0;
        users.map(user => {
            if (user.status.isBanned) {
                bannedUsersAmount++;
            }
        });
        statisticTabs.map(stat => {
            let { title } = stat;
            if (title == 'Всего пользователей') {
                stat.value = users.length;
            } else if (title == 'Активные подписки') {
                stat.value = subscriptionsAmount;
            } else if (title == 'Заработано за сегодня') {
                stat.value = earnedToday;
            } else if (title == 'Баны') {
                stat.value = bannedUsersAmount;
            }
        });

        this.setState({
            isRequestMaking: false,
            statisticTabs,
            purchases,
            profit
        });
    }
    render() {
        const {
            isRequestMaking,
            statisticTabs,
            purchases,
            profit
        } = this.state;

        const tabs = statisticTabs.map(stat => {
            if (stat.title == 'Заработано за сегодня') {
                return (
                    <div key={stat.title} className="tab">
                        <h3 className="stat-title">{stat.title}</h3>
                        <span
                            className="stat-value"
                        >
                            {stat.value}
                            <span style={{ fontSize: '24px', color: '#515151' }}>&#8381;</span>
                        </span>
                    </div>
                )
            }
            return (
                <div key={stat.title} className="tab">
                    <h3 className="stat-title">{stat.title}</h3>
                    <span className="stat-value">{stat.value}</span>
                </div>
            )
        });

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
                            array={purchases}
                            graphColor={'rgb(0, 153, 51)'}
                            isRequestMaking={isRequestMaking}
                            graphTheme="Совершено покупок за сегодня"
                        />
                        <Graph
                            className="profit"
                            array={profit}
                            graphColor={'#0047b3'}
                            isRequestMaking={isRequestMaking}
                            graphTheme="Заработано за сегодня"
                        />
                    </div>
                </div>
            </div>
        )
    }
}
