import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import fetchData from '../../fetchData';

class ViewAnswers extends React.Component {
    constructor() {
        super();
        this.state = {
            sort: {},
            sortCopy: {},
            isRequestMaking: true,
        };
    }
    async componentDidMount() {
        window.onkeydown = function(e) {
            if (e.keyCode == 27) {
                this.hideCreateSortModal();
            }
        }.bind(this);
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
    render() {
        const {
            isRequestMaking,
            sort
        } = this.state;
        const answers = sort.answers && sort.answers.map(answer => (
            <div className="answer">
                {answer.title}
            </div>
        ));

        return (
            <div className="view-answers">
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
                            opacity: isRequestMaking ? 0 : 1,
                            pointerEvents: isRequestMaking ? 'none' : 'all'
                        }
                    }
                >
                    <div className="search-bar">
                        <div className="search-field">
                            <img src="/images/search-icon-admin.png" />
                            <input
                                type="text"
                                placeholder="Search here"
                                onChange={this.searchKeys}
                            />
                        </div>
                    </div>
                    <h2>Просмотр FAQ раздела {sort.title}</h2>
                    <div className="view-answers-wrap">
                        <div className="answers">
                            {answers}
                        </div>
                        <div className="sort">
                            <div className="sort-title">
                                <h3>{sort.sort}</h3>
                                <span className="decisions-amount">
                                    Кол-во решений&nbsp;
                                    {sort.answers && sort.answers.length}
                                </span>
                            </div>
                            <div className="buttons">
                                <button className="button add-answer">
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
