import React from 'react';
import fetchData from '../fetchData';

export default class FAQ extends React.Component {
    constructor() {
        super();
        this.state = {
            answers: [],
            answersCopy: [],
            searchValue: '',
            categoriesToSearch: [],
            currentCategory: 'Все категории'
        };
        this.renderAnswers = this.renderAnswers.bind(this);
        this.addElement = this.addElement.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.filterAnswers = this.filterAnswers.bind(this);
    }
    componentDidUpdate(_, prevState) {
        const { currentCategory, answersCopy, searchValue } = this.state; 
        const answers = this.state.answersCopy.slice();
        if (prevState.currentCategory != currentCategory) {
            for (let i = 0; i < answers.length; i++) {
                if (currentCategory == 'Все категории') {
                    this.setState({answers: answersCopy}, () => this.filterAnswers(searchValue));
                    break;
                }
                if (answers[i].sort == currentCategory) {
                    this.setState({ answers: [ { ...answers[i] } ] }, () => this.filterAnswers(searchValue));
                }
            }
        }
    }
    async componentDidMount() {
        const query = `
            query {
                getAnswers {
                    sort
                    answers {
                        title
                        answer
                        rateCount
                        usefulRate
                    }
                }
            }
        `;
        const result = await fetchData(query);
        this.setState({answers: result.getAnswers});
        let modifiedStateAnswers = this.state.answers;
        modifiedStateAnswers = modifiedStateAnswers.map(answer => {
            answer.isShown = false;
            return answer;
        });
        this.setState({answers: modifiedStateAnswers, answersCopy: modifiedStateAnswers});
        const categoriesToSearch = ['Все категории'];
        this.state.answers.map(answer => categoriesToSearch.push(answer.sort));
        this.setState({categoriesToSearch});
    }
    filterAnswers(search) {
        const { answers, answersCopy, currentCategory } = this.state;
        this.setState({searchValue: search});

        let answersToRender = [];

        answers.map(answer => {
            let answerToRender = {...answer};
            answerToRender.answers = [];
            answer.answers.filter(filteredAnswer => {
                if (filteredAnswer.title.toLowerCase().includes(search.toLowerCase().trim())) {
                    answerToRender.answers.push(filteredAnswer);
                } else if (filteredAnswer.answer.toLowerCase().includes(search.toLowerCase().trim())) {
                    answerToRender.answers.push(filteredAnswer);
                }    
            });
            if (answerToRender.answers.length > 0) answersToRender.push(answerToRender);
        });

        if (search.length < 1) {
            answersToRender = [];
            for (let i = 0; i < answersCopy.length; i++) {
                if (currentCategory == 'Все категории') {
                    answersToRender.push(answersCopy[i]);
                } else if (currentCategory == answersCopy[i].sort) {
                    answersToRender.push(answersCopy[i]);
                }
            }
            this.setState({ answers: answersToRender });
        } else if (answersToRender.length < 1) {
            this.setState({answers: answersCopy});
        } else {
            this.setState({answers: answersToRender});
        }
    }
    addElement(answers) {
        const renderedAnswers = answers.answers.map(
            answer => {
                return (
                    <div key={answer.title} className="answer">
                        <h4 className="answer-title">
                            {answer.title}?
                        </h4>
                        <div className="answer-to-question">
                            {answer.answer}
                        </div>
                        <div className="answer-rate">
                            <div className="bar">
                                <div
                                    className="25-percents"
                                    style={
                                        answer.usefulRate >= 25
                                            ? {backgroundColor: '#50B5FF'}
                                            : {backgroundColor: '#fff'}
                                    }
                                />
                                <div
                                    className="50-percents"
                                    style={
                                        answer.usefulRate >= 50
                                            ? {backgroundColor: '#50B5FF'}
                                            : {backgroundColor: '#fff'}
                                    }
                                />
                                <div
                                    className="75-percents"
                                    style={
                                        answer.usefulRate >= 75
                                            ? {backgroundColor: '#50B5FF'}
                                            : {backgroundColor: '#fff'}
                                    }
                                />
                                <div
                                    className="100-percents"
                                    style={
                                        answer.usefulRate >= 100
                                            ? {backgroundColor: '#50B5FF'}
                                            : {backgroundColor: '#fff'}
                                    }
                                />
                            </div>
                            <span className="useful-rate">
                                {answer.usefulRate}%
                            </span>
                        </div>
                        <div className="people-percent">
                            <span className="percent">
                                {answer.usefulRate}% считают ответ полезным
                            </span>
                            <button className="rate-answer">Полезно</button>
                        </div>
                    </div>
                )
            }
        );
        return renderedAnswers;
    }
    renderAnswers() {
        const answers = this.state.answers.map(
            (answer, i) => {
                const answers = this.addElement(answer);
                let answersHeight = 350;
                for(let i = 0; i < answer.answers.length; i++) {
                    if (i % 4 == 0) {
                        answersHeight += 350;
                    }
                }
                return (
                    <div key={i} className="answers-wrap">
                        <div
                            className="answer-title"
                            onClick={() => {
                                const hiddenAnswers = (
                                    this.state.answers.map(hiddenAnswer => {
                                        if (hiddenAnswer.sort == answer.sort) {
                                            hiddenAnswer.isShown = !hiddenAnswer.isShown
                                        }
                                        return hiddenAnswer;
                                    })
                                );
                                this.setState({answers: hiddenAnswers});
                            }}
                        >
                            <img
                                style={
                                    answer.isShown
                                        ? {transform: 'rotate(90deg)'}
                                        : {transform: 'rotate(0deg)'}
                                }
                                className="answers-arrow"
                                src="/images/Rectangle.png"
                            />
                            <h3
                                className="title"
                            >
                                {answer.sort}&nbsp;
                                <span className="number">
                                    ({answer.answers.length})
                                </span>
                            </h3>
                            <div className="gray-line"></div>
                        </div>
                        <div
                            className="answers"
                            style={
                                answer.isShown
                                    ? { maxHeight: `${answersHeight}px`, transition: '500ms' }
                                    : { maxHeight: 0, transition: '250ms' }
                            }
                        >
                            {answers}
                        </div>
                    </div>
                )
            }
        );
        return (
            <>
                {answers}
            </>
        )
    }
    handleChangeCategory(e) {
        this.setState({currentCategory: e.target.value });
    }
    handleSearch(e) {
        this.filterAnswers(e.target.value);
    }
    render() {
        const { searchValue, categoriesToSearch } = this.state;
        return (
            <div className="FAQ">
                <div className="container">
                    <h2>Ответы на вопросы</h2>
                    <div className="search-bar">
                        <select onChange={this.handleChangeCategory} className="categories" name="categories">
                            {categoriesToSearch.map(category => <option key={category}>{category}</option>)}
                        </select>
                        <input placeholder="Ваш вопрос..." className="search" value={searchValue} onChange={this.handleSearch} />
                    </div>
                    <div className="answers-wrap">
                        {this.renderAnswers()}
                    </div>
                </div>
            </div>
        )
    }
}
