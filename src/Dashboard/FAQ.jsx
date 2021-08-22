import React from 'react';
import { CircularProgress } from '@material-ui/core';

export default class FAQ extends React.Component {
    constructor() {
        super();
        this.state = {
            answers: [],
            answersCopy: [],
            searchValue: '',
            categoriesToSearch: [],
            currentCategory: 'Все категории',
            hiddenSearchCategories: true,
            deviceWidth: 0
        };
        this.renderAnswers = this.renderAnswers.bind(this);
        this.addElement = this.addElement.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.filterAnswers = this.filterAnswers.bind(this);
        this.toggleCategoryMenu = this.toggleCategoryMenu.bind(this);
        this.hiddenCategoryMenu = this.hiddenCategoryMenu.bind(this);
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.answers != this.props.answers) {
            const { answers } = this.props;
            this.setState({ answers, answersCopy: answers.slice() })
        }
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
    componentDidMount() {
        const { answers } = this.props;
        this.setState({ answers, answersCopy: answers.slice() });
        let modifiedStateAnswers = answers;
        modifiedStateAnswers = modifiedStateAnswers.map(answer => {
            answer.isShown = false;
            return answer;
        });
        const categoriesToSearch = ['Все категории'];
        modifiedStateAnswers.map(answer => categoriesToSearch.push(answer.sort));
        this.setState({categoriesToSearch, deviceWidth: window.innerWidth, answersCopy: modifiedStateAnswers});
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
            this.setState({ answers: answersCopy });
        } else {
            this.setState({ answers: answersToRender });
        }
    }
    addElement(answers) {
        const renderedAnswers = answers.answers.map(
            (answer, i) => {
                return (
                    <div key={i} className="answer">
                        <div className="answer-main-bg" />
                        <div className="answer-additional-bg" />
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
        renderedAnswers.unshift(
            <div
                key={++renderedAnswers.length}
                className="answer-not-found"
            >
                <a href="https://vk.com/zeer_csgo" target="_blank" className="plus-icon">
                    <img src="/images/answer-not-found.png" />
                </a>
                <h3 className="not-found-title">Не нашли ответа</h3>
                <span className="message">
                    Свяжитесь с нами через кнопку,
                    либо по контактам в футере
                </span>
            </div>
        )
        return renderedAnswers;
    }
    renderAnswers() {
        const answers = this.state.answers.map(
            (answer, i) => {
                const answers = this.addElement(answer);
                let answersHeight = 350;
                for(let i = 0; i < answer.answers.length; i++) {
                    if (i % 4 == 0) {
                        answersHeight += 500;
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
        this.setState({ currentCategory: e.target.textContent });
    }
    handleSearch(e) {
        this.filterAnswers(e.target.value);
    }
    hiddenCategoryMenu() {
        this.setState({ hiddenSearchCategories: true });
    }
    toggleCategoryMenu() {
        this.setState({ hiddenSearchCategories: !this.state.hiddenSearchCategories });
    }
    render() {
        const {
            searchValue,
            hiddenSearchCategories,
            currentCategory,
            deviceWidth
        } = this.state;
        const { isRequestMaking } = this.props;
        let categoryToRender = '';
        const categoriesToSearch = this.state.categoriesToSearch.map(category => {
            return (
                <span
                    className="category"
                    onClick={
                        function(e) {
                            this.handleChangeCategory(e);
                            this.setState({ hiddenSearchCategories: true });
                        }.bind(this)
                    }
                    key={category}
                    style={
                        category == currentCategory
                            ? {backgroundColor: '#2d2d36'}
                            : {}
                    }
                >
                    {category}
                </span>
            )
        })
        if (deviceWidth > 600) {
            for (let i = 0; i < currentCategory.length; i++) {
                if (i < 11 && currentCategory[i]) {
                    categoryToRender += currentCategory[i];
                } else {
                    categoryToRender += '...';
                    break;
                }
            }
        } else {
            for (let i = 0; i < currentCategory.length; i++) {
                if (i < 22 && currentCategory[i]) {
                    categoryToRender += currentCategory[i];
                } else {
                    categoryToRender += '...';
                    break;
                }
            }
        }
        return (
            <div className="FAQ">
                <div className="container">
                    <h2>Ответы на вопросы</h2>
                    <div className="search-bar">
                        <div className="categories">
                            <div
                                className="first-category"
                                onClick={this.toggleCategoryMenu}
                            >
                                {categoryToRender}
                                <img src="/images/categories-arrow-menu.png" className="arrow" />
                            </div>
                            <div
                                style={
                                    hiddenSearchCategories
                                        ? {maxHeight: 0, transition: '200ms'}
                                        : {maxHeight: '550px', transition: '500ms'}
                                }
                                className="the-rest-categories"
                            >
                                {categoriesToSearch.map((category, i) => category)}
                            </div>
                        </div>
                        <input onClick={this.hiddenCategoryMenu} placeholder="Ваш вопрос..." className="search" value={searchValue} onChange={this.handleSearch} />
                        <img className="search-icon" src="/images/search-icon.png" />
                    </div>
                    <CircularProgress
                        style={
                            {
                                display: isRequestMaking ? 'block' : 'none',
                                margin: '50px auto 0 auto'
                            }
                        }
                    />
                    <div
                        className="answers-wrap"
                        style={
                            {
                                transform: `translateX(${isRequestMaking ? '-2%' : 0})`,
                                opacity: isRequestMaking ? 0 : 1
                            }
                        }
                    >
                        {this.renderAnswers()}
                    </div>
                </div>
            </div>
        )
    }
}
