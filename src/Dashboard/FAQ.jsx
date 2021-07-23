import React from 'react';
import fetchData from '../fetchData';

export default class FAQ extends React.Component {
    constructor() {
        super();
        this.state = {
            answers: [],
            showAnswer: false
        };
        this.hiddenAnswersGroup = this.hiddenAnswersGroup.bind(this);
    }
    async componentDidMount() {
        const query = `
            query {
                getAnswers {
                    answer
                    usefulRate
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
        this.setState({answers: result.getAnswers});
    }
    hiddenAnswersGroup() {
        this.setState({showAnswer: !this.state.showAnswer});
    }
    render() {
        const { answers, showAnswer } = this.state;
        function addElement(answer) {
            return (
                <div key={answer.title} className="answer">
                    <h4 className="answer-title">{answer.title}?</h4>
                    <span className="answer-content">
                        {answer.answer}
                    </span>
                    <div className="useful">
                        <div className="useful-rate">
                            <div className="percent-bar">
                                <div
                                    className="25-percents"
                                    style={
                                        answer.usefulRate < 25
                                        ? {backgroundColor: '#fff'}
                                        : {backgroundColor: '#50B5FF'}
                                    }
                                />
                                <div
                                    className="50-percents"
                                    style={
                                        answer.usefulRate < 50
                                        ? {backgroundColor: '#fff'}
                                        : {backgroundColor: '#50B5FF'}
                                    }
                                />
                                <div
                                    className="75-percents"
                                    style={
                                        answer.usefulRate < 75
                                        ? {backgroundColor: '#fff'}
                                        : {backgroundColor: '#50B5FF'}
                                    }
                                />
                                <div
                                    className="100-percents"
                                    style={
                                        answer.usefulRate < 100
                                        ? {backgroundColor: '#fff'}
                                        : {backgroundColor: '#50B5FF'}
                                    }
                                />
                            </div>
                            <label className="rate">{answer.usefulRate}%</label>
                        </div>
                        <div className="how-useful">
                            <span className="percent-people">
                                {answer.usefulRate}%
                                считают этот ответ полезным
                            </span>
                            <button className="rate-answer">Полезно</button>
                        </div>
                    </div>
                </div>
            )
        }
        const answersBase = [];
        const answersPaymentActivation = [];
        const answersConfig = [];
        for (let i = 0; i < answers.length; i++) {
            if (answers[i].sort.base) {
                answersBase.push(
                    addElement(answers[i])
                );
            }
            if (answers[i].sort.paymentActivation) {
                answersPaymentActivation.push(
                    addElement(answers[i])
                )
            }
            else if (answers[i].sort.config) {
                answersConfig.push(
                    addElement(answers[i])
                );
            }
        }
        return (
            <div className="FAQ">
                <div className="container">
                    <h2>Ответы на вопросы</h2>
                    <div className="search-bar">
                        <input className="search" />
                    </div>
                    <div
                        className="answers-wrap"
                    >
                        <h3
                            className="base-title title"
                            onClick={this.hiddenAnswersGroup}
                        >
                            Базовые&nbsp;
                            <span className="number">
                                ({answersBase.length})
                            </span>
                        </h3>
                        <div
                            style={answersBase.length < 4
                                ? {justifyContent: 'space-around'}
                                : {justifyContent: 'space-between'}
                            }
                            // style={
                            //     showAnswer
                            //     ? {transform: 'scale(0)'}
                            //     : {transform: 'scale(1)'}
                            // }
                            className="base answers"
                        >
                            {answersBase}
                        </div>
                        <h3 className="payment-title title">Оплата и активация <span className="number">({answersPaymentActivation.length})</span></h3>
                        <div
                            style={answersPaymentActivation.length < 4
                                ? {justifyContent: 'space-around'}
                                : {justifyContent: 'space-between'}
                            }
                            className="paymentActivation answers"
                        >
                            {answersPaymentActivation}
                        </div>
                        <h3 className="config-title title">Конфиги <span className="number">({answersPaymentActivation.length})</span></h3>
                        <div
                            style={answersConfig.length < 4
                                ? {justifyContent: 'space-around'}
                                : {justifyContent: 'sapce-between'}
                            }
                            className="config answers"
                        >
                            {answersConfig}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
