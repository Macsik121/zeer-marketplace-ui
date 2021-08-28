import React from 'react';
import { CircularProgress } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Link } from 'react-router-dom';
import fetchData from '../../fetchData';

class ConfirmDeleteSortModal extends React.Component {
    constructor() {
        super();
        this.state = {
            isRequestMaking: false,
            scrollTo: 0
        };
        this.handleDeleteSort = this.handleDeleteSort.bind(this);
    }
    componentDidUpdate(_, prevState) {
        const { scrollTop } = document.documentElement;
        if (prevState.scrollTo != scrollTop) {
            this.setState({ scrollTo: scrollTop });
        }
    }
    async handleDeleteSort() {
        this.setState({ isRequestMaking: true });
        const result = await fetchData(`
            mutation deleteAnswerSort($sort: String!) {
                deleteAnswerSort(sort: $sort)
            }
        `, { sort: this.props.sortToDelete.sort });

        this.props.hideAgreeToDelete();
        await this.props.getAnswers();
        this.setState({ isRequestMaking: false });
    }
    render() {
        const {
            sortToDelete,
            style
        } = this.props;
        const { isRequestMaking, scrollTo } = this.state;

        return (
            <div
                style={{
                    ...style,
                    top: scrollTo + 150
                }}
                className="confirm-action"
            >
                <div className="heading">
                    <h3>Подтвердите действие</h3>
                    <CloseIcon
                        className="close-modal"
                        onClick={this.props.hideAgreeToDelete}
                    />
                </div>
                <div className="content">
                    Вы действительно хотите удалить раздел {sortToDelete.sort}
                </div>
                <div className="buttons">
                    <button
                        className="button agree"
                        onClick={async () => {
                            await this.handleDeleteSort();
                            this.props.hideAgreeToDelete();
                        }}
                        style={
                            {
                                pointerEvents: isRequestMaking ? 'none' : 'all'
                            }
                        }
                    >
                        Да
                    </button>
                    <button
                        className="button refuse"
                        style={
                            {
                                pointerEvents: isRequestMaking ? 'none' : 'all'
                            }
                        }
                        onClick={this.props.hideAgreeToDelete}
                    >
                        Нет
                    </button>
                </div>
            </div>
        )
    }
}

class CreateSort extends React.Component {
    constructor() {
        super();
        this.state = {
            isRequestMaking: false,
            answerTitleValue: '',
            scrollTo: 0
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAnswerTitleChange = this.handleAnswerTitleChange.bind(this);
    }
    componentDidUpdate(_, prevState) {
        const { scrollTop } = document.documentElement;
        if (prevState.scrollTo != scrollTop) {
            this.setState({ scrollTo: scrollTop });
        }
    }
    async handleSubmit(e) {
        e.preventDefault();
        this.setState({ isRequestMaking: true });
        const form = document.forms.createSort;
        const sort = form.sortTitle;
        sort.blur();

        const result = await fetchData(`
            mutation createAnswerSort($sort: String!) {
                createAnswerSort(sort: $sort) {
                    answers {
                        usefulRate
                        title
                        rateCount
                        answer
                    }
                    sort
                }
            }
        `, { sort: sort.value });

        console.log('sort');

        if (result) {
            await this.props.getAnswers();
            this.props.hideModal();
            this.setState({ isRequestMaking: false });
        } else {
            sort.focus();
        }
    }
    handleAnswerTitleChange(e) {
        if (e.target.value.toLowerCase().includes('/')) return;
        this.setState({ answerTitleValue: e.target.value });
    }
    render() {
        const { createSortShown } = this.props;
        const { isRequestMaking, scrollTo } = this.state;

        return (
            <div
                className="create-sort-modal"
                style={
                    {
                        opacity: createSortShown ? 1 : 0,
                        transform: `translateY(${createSortShown ? 0 : '-150%'})`,
                        top: createSortShown ? `${30 + scrollTo}px` : 0,
                        pointerEvents: createSortShown ? 'all' : 'none',
                        pointerEvents: isRequestMaking ? 'none' : 'all'
                    }
                }
            >
                <form
                    onSubmit={this.handleSubmit}
                    name="createSort"
                    className="create-sort"
                >
                    <div className="field-wrap">
                        <label>Наименование раздела:</label>
                        <input
                            name="sortTitle"
                            onChange={this.handleAnswerTitleChange}
                            value={this.state.answerTitleValue}
                        />
                    </div>
                    <button className="add" type="submit">Добавить</button>
                </form>
            </div>
        )
    }
}

export default class FAQ extends React.Component {
    constructor() {
        super();
        this.state = {
            answersFAQ: [],
            answersFAQCopy: [],
            isRequestMaking: true,
            createSortShown: false,
            agreeToDeleteShown: false,
            sortToDelete: {},
        };
        this.showCreateSortModal = this.showCreateSortModal.bind(this);
        this.hideCreateSortModal = this.hideCreateSortModal.bind(this);
        this.hideAgreeToDelete = this.hideAgreeToDelete.bind(this);
        this.showAgreeToDelete = this.showAgreeToDelete.bind(this);
        this.getAnswers = this.getAnswers.bind(this);
        this.searchTabs = this.searchTabs.bind(this);
    }
    async componentDidMount() {
        window.onkeydown = function(e) {
            if (e.keyCode == 27) {
                this.hideCreateSortModal();
                this.hideAgreeToDelete();
            }
        }.bind(this);
        await this.getAnswers();
    }
    async getAnswers() {
        this.setState({ isRequestMaking: true });
        const result = await fetchData(`
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
        `);

        this.setState({
            answersFAQ: result.getAnswers,
            answersFAQCopy: result.getAnswers,
            isRequestMaking: false
        });
    }
    showCreateSortModal() {
        this.setState({ createSortShown: true });
    }
    hideCreateSortModal() {
        this.setState({ createSortShown: false });
    }
    hideAgreeToDelete() {
        this.setState({ agreeToDeleteShown: false });
    }
    showAgreeToDelete() {
        this.setState({ agreeToDeleteShown: true });
    }
    searchTabs(e) {
        let searchValue = e.target.value;
        searchValue = searchValue.toLowerCase().trim();
        const { answersFAQCopy } = this.state;

        const answersToRender = [];

        answersFAQCopy.map(answer => {
            if (answer.sort.toLowerCase().includes(searchValue)) {
                answersToRender.push(answer);
            }
        });
        console.log(answersToRender);

        if (searchValue == '') {
            this.setState({ answersFAQ: answersFAQCopy });
        } else {
            this.setState({ answersFAQ: answersToRender });
        }
    }
    render() {
        const {
            answersFAQ,
            isRequestMaking,
            createSortShown,
            agreeToDeleteShown,
            sortToDelete
        } = this.state;
        
        const answers = answersFAQ.map((sort, i) => (
            <div key={i} className="answer">
                <h3>{sort.sort}</h3>
                <span className="decisions-amount">
                    Кол-во решений:&nbsp;
                    {sort.answers.length}
                </span>
                <div className="buttons">
                    <Link
                        to={`/admin/FAQ/${sort.sort}`}
                        className="button view"
                    >
                        Просмотр
                    </Link>
                    <button
                        className="button delete"
                        onClick={() => {
                            this.setState({ sortToDelete: sort });
                            this.showAgreeToDelete();
                        }}
                    >
                        Удалить
                    </button>
                </div>
            </div>
        ));
        
        return (
            <div className="FAQ">
                <CircularProgress
                    style={
                        {
                            display: isRequestMaking ? 'block' : 'none'
                        }
                    }
                    className="progress-bar"
                />
                <CreateSort
                    createSortShown={createSortShown}
                    getAnswers={this.getAnswers}
                    hideModal={this.hideCreateSortModal}
                />
                <ConfirmDeleteSortModal
                    sortToDelete={sortToDelete}
                    getAnswers={this.getAnswers}
                    hideAgreeToDelete={this.hideAgreeToDelete}
                    style={
                        {
                            opacity: agreeToDeleteShown ? 1 : 0,
                            pointerEvents: agreeToDeleteShown ? 'all' : 'none',
                            transform: `translateY(${agreeToDeleteShown ? 0 : '-155%'})`
                        }
                    }
                />
                <div
                    className="FAQ-wrap"
                    style={
                        {
                            pointerEvents: agreeToDeleteShown || createSortShown ? 'none' : 'all',
                            opacity: agreeToDeleteShown || createSortShown ? .5 : 1,
                            userSelect: agreeToDeleteShown || createSortShown ? 'none' : 'text'
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
                    <h2>FAQ</h2>
                    <div
                        className="FAQ-sorts-wrap"
                        style={
                            {
                                opacity: isRequestMaking ? 0 : 1
                            }
                        }
                    >
                        <div className="sorts-wrap">
                            <div className="add-FAQ-sort">
                                <button onClick={this.showCreateSortModal} className="plus-wrap">
                                    <img className="plus" src="/images/answer-not-found.png" />
                                </button>
                                <h3>Добавить раздел</h3>
                                <span className="add-new-sort">Добавление нового раздела в FAQ</span>
                            </div>
                            {answers}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
