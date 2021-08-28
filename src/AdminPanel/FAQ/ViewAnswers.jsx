import React from 'react';
import { CircularProgress } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { withRouter } from 'react-router-dom';
import fetchData from '../../fetchData';

class ConfirmDeleteAnswer extends React.Component {
    constructor() {
        super();
        this.state = {
            isRequestMaking: false
        };
        this.deleteAnswer = this.deleteAnswer.bind(this);
    }
    async deleteAnswer() {
        this.setState({ isRequestMaking: true });
        const { match, answer, hideModal, getAnswers } = this.props;
        const vars = {
            sort: match.params.title,
            title: answer.title
        };

        await fetchData(`
            mutation deleteAnswer($title: String!, $sort: String!) {
                deleteAnswer(title: $title, sort: $sort)
            }
        `, vars);

        await getAnswers();

        await hideModal();

        this.setState({ isRequestMaking: false });
    }
    render() {
        const {
            modalShown,
            hideModal,
            answer
        } = this.props;

        const { isRequestMaking } = this.state;
 
        return (
            <div
                className="confirm-action delete-answer"
                style={
                    {
                        opacity: modalShown ? 1 : 0,
                        transform: `translateY(${modalShown ? 0 : '-150%'})`,
                        pointerEvents: isRequestMaking ? 'none' : 'all'
                    }
                }
            >
                <div className="heading">
                    <h4>Подтвердите действие</h4>
                    <CloseIcon className="close-modal" onClick={hideModal} />
                </div>
                <div className="content">
                    Вы действительно хотите удалить решение с названием {answer.title}
                </div>
                <div className="buttons">
                    <button
                        className="agree button"
                        onClick={this.deleteAnswer}
                    >
                        Да
                    </button>
                    <button
                        className="refuse button"
                        onClick={hideModal}
                    >
                        Нет
                    </button>
                </div>
            </div>
        )
    }
}

class CreateAnswerModal extends React.Component {
    constructor() {
        super();
        this.state = {
            isRequestMaking: false
        };
        this.createAnswer = this.createAnswer.bind(this);
    }
    async createAnswer(e) {
        e.preventDefault();
        this.setState({ isRequestMaking: true });
        const form = document.forms.addAnswer;
        const title = form.title;
        const answer = form.description;
        
        title.blur();
        answer.blur();

        const vars = {
            sort: this.props.sort.sort,
            answer: {
                title: title.value,
                answer: answer.value
            }
        };

        const result = await fetchData(`
            mutation createAnswer($sort: String!, $answer: AnswerInput!) {
                createAnswer(sort: $sort, answer: $answer) {
                    title
                    answer
                    usefulRate
                    rateCount
                    dateOfCreation
                }
            }
        `, vars);

        await this.props.getAnswers();
        await this.props.hideModal();

        this.setState({ isRequestMaking: false });
    }
    render() {
        const {
            isRequestMaking
        } = this.state;

        const { modalShown } = this.props;

        return (
            <div
                className="create-answer-modal"
                style={
                    {
                        pointerEvents: isRequestMaking ? 'none' : 'all',
                        opacity: modalShown ? 1 : 0,
                        transform: `translateY(${modalShown ? 0 : '-145%'})`
                    }
                }
            >
                <form onSubmit={this.createAnswer} name="addAnswer" className="add-answer">
                    <div className="field-wrap">
                        <label>Наиимаенование решения:</label>
                        <input
                            name="title"
                            className="answer-title"
                        />
                    </div>
                    <div className="field-wrap">
                        <label>Описание:</label>
                        <textarea name="description" className="answer-description" />
                    </div>
                    <button className="add">Добавить</button>
                </form>
            </div>
        )
    }
}

class ViewAnswers extends React.Component {
    constructor() {
        super();
        this.state = {
            sort: {},
            sortCopy: {},
            isRequestMaking: true,
            addAnswerShown: false,
            deleteAnswerShown: false,
            answerToDelete: {}
        };
        this.showAddAnswer = this.showAddAnswer.bind(this);
        this.hideAddAnswer = this.hideAddAnswer.bind(this);
        this.showDeleteAnswer = this.showDeleteAnswer.bind(this);
        this.hideDeleteAnswer = this.hideDeleteAnswer.bind(this);
        this.getAnswers = this.getAnswers.bind(this);
        this.searchTabs = this.searchTabs.bind(this);
    }
    async componentDidMount() {
        window.onkeydown = function(e) {
            if (e.keyCode == 27) {
                this.hideAddAnswer();
                this.hideDeleteAnswer();
            }
        }.bind(this);
        await this.getAnswers();
    }
    async getAnswers() {
        this.setState({ isRequestMaking: true });
        const { title } = this.props.match.params;

        const result = await fetchData(`
            query getSort($sort: String!) {
                getSort(sort: $sort) {
                    sort
                    answers {
                        title
                        answer
                        usefulRate
                        rateCount
                        dateOfCreation
                    }
                }
            }
        `, { sort: title });

        this.setState({
            sort: result.getSort,
            sortCopy: result.getSort,
            isRequestMaking: false
        });
    }
    showAddAnswer() {
        this.setState({ addAnswerShown: true });
    }
    hideAddAnswer() {
        this.setState({ addAnswerShown: false });
    }
    showDeleteAnswer() {
        this.setState({ deleteAnswerShown: true });
    }
    hideDeleteAnswer() {
        this.setState({ deleteAnswerShown: false });
    }
    searchTabs(e) {
        let searchValue = e.target.value;
        searchValue = searchValue.toLowerCase().trim();
        const { sortCopy } = this.state;

        const answersToRender = [];

        sortCopy.answers.map(answer => {
            if (answer.title.toLowerCase().includes(searchValue)) {
                answersToRender.push(answer);
            } else if (answer.answer.toLowerCase().includes(searchValue)) {
                answersToRender.push(answer);
            }
        });

        if (searchValue == '') {
            this.setState({ sort: sortCopy });
        } else {
            this.setState({ sort: { answers: answersToRender } });
        }
    }
    render() {
        const {
            isRequestMaking,
            sort,
            sortCopy,
            addAnswerShown,
            deleteAnswerShown,
            answerToDelete
        } = this.state;

        const answers = sort.answers && sort.answers.map((answer, i) => (
            <div key={i} className="answer">
                <div className="description">{answer.answer}</div>
                <div className="title">{answer.title}</div>
                <div className="date">{new Date(answer.dateOfCreation).toLocaleDateString()}</div>
                <div className="action">
                    <button
                        className="button delete"
                        onClick={() => {
                            this.setState({ answerToDelete: answer })
                            this.showDeleteAnswer()
                        }}
                    >
                        Удалить
                    </button>
                </div>
            </div>
        ));

        return (
            <div className="view-answers">
                <CreateAnswerModal
                    sort={sort}
                    modalShown={addAnswerShown}
                    getAnswers={this.getAnswers}
                    hideModal={this.hideAddAnswer}
                />
                <ConfirmDeleteAnswer
                    modalShown={deleteAnswerShown}
                    hideModal={this.hideDeleteAnswer}
                    answer={answerToDelete}
                    match={this.props.match}
                    getAnswers={this.getAnswers}
                />
                <CircularProgress
                    className="progress-bar"
                    style={
                        {
                            display: isRequestMaking ? 'block' : 'none'
                        }
                    }
                />
                <div
                    className="answers-wrap"
                    style={
                        {
                            opacity: (
                                isRequestMaking
                                    ? 0
                                    : (
                                        addAnswerShown || deleteAnswerShown
                                            ? .5
                                            : 1
                                    )
                            ),
                            pointerEvents: (
                                isRequestMaking
                                    ? 'none'
                                    : (
                                        addAnswerShown || deleteAnswerShown
                                            ? 'none'
                                            : 'all'
                                    )
                            ),
                            userSelect: addAnswerShown ? 'none' : 'text'
                        }
                    }
                >
                    <div className="search-bar">
                        <div className="search-field">
                            <img src="/images/search-icon-admin.png" />
                            <input
                                type="text"
                                placeholder="Search here"
                                onChange={this.searchTabs}
                            />
                        </div>
                    </div>
                    <h2>Просмотр FAQ раздела {sort.title}</h2>
                    <div className="view-answers-wrap">
                        <div className="table">
                            <div className="heading">
                                <div className="description">Описание</div>
                                <div className="title">Название</div>
                                <div className="date">Дата</div>
                                <div className="action">Действие</div>
                            </div>
                            <div className="answers">
                                {answers}
                            </div>
                        </div>
                        <div className="sort">
                            <div className="sort-title">
                                <h3>{sortCopy.sort}</h3>
                                <span className="decisions-amount">
                                    Кол-во решений&nbsp;
                                    {sortCopy.answers && sortCopy.answers.length}
                                </span>
                            </div>
                            <div className="buttons">
                                <button
                                    className="button add-answer"
                                    onClick={this.showAddAnswer}
                                >
                                    Добавить
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(ViewAnswers);
