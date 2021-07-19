import React from 'react';
import fetchData from '../fetchData';

export default class FAQ extends React.Component {
    constructor() {
        super();
        this.state = {
            answers: []
        };
    }
    async componentDidMount() {
        const query = `
            query {
                getAnswers {
                    answer
                    userfulRate
                    sort {
                        config
                        base
                        paymentActivation
                    }
                    title
                }
            }
        `;
        const result = await fetchData(query);
        console.log(result.getAnswers);
    }
    render() {
        return (
            <div className="FAQ">
                <div className="container">
                    <h2>Ответы на вопросы</h2>
                </div>
            </div>
        )
    }
}
