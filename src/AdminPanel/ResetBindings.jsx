import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import fetchData from '../fetchData';

export default class ResetBindings extends React.Component {
    constructor() {
        super();
        this.state = {
            resetBindingRequests: [],
            resetBindingRequestsCopy: [],
            isRequestMaking: true
        };
        this.deleteAllRequests = this.deleteAllRequests.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.getResetBindings = this.getResetBindings.bind(this);
        this.acceptResetBinding = this.acceptResetBinding.bind(this);
        this.rejectResetBinding = this.rejectResetBinding.bind(this);
    }
    async componentDidMount() {
        await this.getResetBindings();
    }
    async deleteAllRequests() {
        this.setState({ isRequestMaking: true });

        await fetchData(`
            mutation {
                deleteAllResetRequests
            }
        `);

        await this.getResetBindings();

        this.setState({ isRequestMaking: false });
    }
    async getResetBindings() {
        this.setState({ isRequestMaking: true });

        const result = await fetchData(`
            query {
                getAllBindings {
                    number
                    reason
                    date
                    status
                    id
                    owner
                    ip
                    location
                }
            }
        `);
        
        this.setState({
            resetBindingRequests: result.getAllBindings,
            resetBindingRequestsCopy: result.getAllBindings,
            isRequestMaking: false
        });
    }
    filterRequest(request, searchValue) {
        if (request.id.includes(searchValue)) {
            return request;
        } else if (request.reason.includes(searchValue)) {
            return request;
        } else if (request.ip.includes(searchValue)) {
            return request;
        } else if (request.location.includes(searchValue)) {
            return request;
        }
    }
    handleSearch(e) {
        let searchValue = e.target.value;
        searchValue = searchValue.toLowerCase().trim();
        const { resetBindingRequestsCopy } = this.state;

        const requestsToRender = [];

        resetBindingRequestsCopy.map(request => {
            for(const key in request) {
                let currentEl = request[key];
                if (key != 'date') {
                    currentEl = currentEl.toString().toLowerCase().trim();
                    request[key] = currentEl;
                }
            }
            const result = this.filterRequest(request, searchValue);
            if (result) requestsToRender.push(result);
        });

        if (searchValue == '') {
            this.setState({ resetBindingRequests: resetBindingRequestsCopy });
        } else {
            this.setState({ resetBindingRequests: requestsToRender });
        }
    }
    async acceptResetBinding(name, number) {
        this.setState({ isRequestMaking: true });

        const vars = {
            name,
            number
        };

        await fetchData(`
            mutation acceptResetBinding($name: String!, $number: Int!) {
                acceptResetBinding(name: $name, number: $number) {
                    id
                    reason
                }
            }
        `, vars);

        await this.getResetBindings();

        this.setState({ isRequestMaking: false });
    }
    async rejectResetBinding(name, number) {
        number = +number;
        this.setState({ isRequestMaking: true });

        const vars = {
            name,
            number
        };

        await fetchData(`
            mutation rejectResetBinding($name: String!, $number: Int!) {
                rejectResetBinding(name: $name, number: $number)
            }
        `, vars);

        await this.getResetBindings();

        this.setState({ isRequestMaking: false });
    }
    render() {
        const { isRequestMaking } = this.state;

        const resetBindings = this.state.resetBindingRequests.map(request => {
            if (request.status.toLowerCase() == 'waiting') {
                request.status = 'на рассмотрении'
            } else if (request.status.toLowerCase() == 'unsuccessful') {
                request.status = 'отклонён';
            } else if (request.status.toLowerCase() == 'done') {
                request.status = 'принят';
            }
            return (
                <div key={new Date() - new Date(request.date)} className="reset-request">
                    <div className="number">{request.id}</div>
                    <div className="reason">{request.reason}</div>
                    <div className="date">{new Date(request.date).toLocaleDateString()}</div>
                    <div className="ip">{request.ip || 'localhost'}</div>
                    <div className="location">{request.location || 'Москва'}</div>
                    <div className="status">{request.status}</div>
                    <div className="action">
                        <button
                            className={`
                                button
                                get-request
                                ${
                                    request.status == 'принят'
                                        ? 'disabled'
                                        : ''
                                }
                            `}
                            onClick={() => this.acceptResetBinding(request.owner, request.number)}
                        >
                            принять
                        </button>
                        <button
                            className={`
                                button
                                reject
                                ${
                                    request.status == 'отклонён'
                                        ? 'disabled'
                                        : ''
                                }
                            `}
                            onClick={() => this.rejectResetBinding(request.owner, request.number)}
                        >
                            отклонить
                        </button>
                    </div>
                </div>
            )
        });

        return (
            <div className="reset-requests">
                <div
                    className="search-bar"
                    style={
                        {
                            opacity: isRequestMaking ? .5 : 1,
                            pointerEvents: isRequestMaking ? 'none' : 'all'    
                        }
                    }
                >
                    <div className="search-field">
                        <img src="/images/search-icon-admin.png" />
                        <input
                            type="text"
                            placeholder="Search here"
                            onChange={this.handleSearch}
                        />
                    </div>
                    <button
                        className="delete-all-requests"
                        onClick={this.deleteAllRequests}
                    >
                        Удалить все заявки
                    </button>
                </div>
                <h2 style={{ opacity: isRequestMaking ? .5 : 1 }}>Сброс привязки</h2>
                <CircularProgress
                    className="progress-bar"
                    style={
                        {
                            display: isRequestMaking ? 'block' : 'none'
                        }
                    }
                />
                <div
                    className="reset-requests-wrap"
                    style={
                        {
                            opacity: isRequestMaking ? 0 : 1,
                            pointerEvents: isRequestMaking ? 'none' : 'all'
                        }
                    }
                >
                    <div className="heading">
                        <div className="number">&#8470;</div>
                        <div className="reason">причина сброса</div>
                        <div className="date">дата</div>
                        <div className="ip">ip</div>
                        <div className="location">локация</div>
                        <div className="status">статус</div>
                        <div className="action">действие</div>
                    </div>
                    <div className="requests">
                        {resetBindings}
                    </div>
                </div>
            </div>
        )
    }
}
