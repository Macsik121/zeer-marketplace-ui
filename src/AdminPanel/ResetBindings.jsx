import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withRouter } from 'react-router-dom';
import fetchData from '../fetchData';
import Pages from './Pages.jsx';

class ResetBindings extends React.Component {
    constructor() {
        super();
        this.state = {
            resetBindingRequests: [],
            resetBindingRequestsCopy: [],
            isRequestMaking: true,
            filterBy: 'Все',
            existingStatuses: ['Все', 'На рассмотрении', 'Принят', 'Отклонён'],
            filterDropdownShown: false,
            searchValue: ''
        };
        this.deleteAllRequests = this.deleteAllRequests.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.getResetBindings = this.getResetBindings.bind(this);
        this.acceptResetBinding = this.acceptResetBinding.bind(this);
        this.rejectResetBinding = this.rejectResetBinding.bind(this);
        this.filterByStatus = this.filterByStatus.bind(this);
        this.toggleFilterDropdown = this.toggleFilterDropdown.bind(this);
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
    filterByStatus(e) {
        this.props.history.push('/admin/reset-binding/1');
        this.toggleFilterDropdown();
        this.handleSearch({
            target: {
                value: ''
            },
            filterStatus: e.target.textContent
        });
        this.setState({ filterBy: e.target.textContent, searchValue: this.state.searchValue });
    }
    filterRequest(request, searchValue) {
        if (request.id.toString().toLowerCase().trim().includes(searchValue)) {
            return request;
        } else if (request.reason.toLowerCase().trim().includes(searchValue)) {
            return request;
        } else if (request.ip.toLowerCase().trim().includes(searchValue)) {
            return request;
        } else if (request.location.toLowerCase().trim().includes(searchValue)) {
            return request;
        }
    }
    handleSearch(e) {
        this.setState({ searchValue: e.target.value }, function() {
            let searchValue = this.state.searchValue;
            searchValue = searchValue.toLowerCase().trim();
            const { resetBindingRequestsCopy } = this.state;
            this.props.history.push('/admin/reset-binding/1');
    
            const requestsToRender = [];
    
            resetBindingRequestsCopy.map(request => {
                const result = this.filterRequest(request, searchValue);
                if (result) requestsToRender.push(result);
            });
    
            if (searchValue == '' && !e.filterStatus) {
                this.setState({ resetBindingRequests: resetBindingRequestsCopy });
            } else {
                this.setState({ resetBindingRequests: requestsToRender });
            }
        });
    }
    async acceptResetBinding(name, number) {
        this.setState({ isRequestMaking: true });

        const vars = {
            name,
            number: +number
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
        this.setState({ isRequestMaking: true });
        number = +number;

        const vars = {
            name,
            number: +number
        };

        await fetchData(`
            mutation rejectResetBinding($name: String!, $number: Int!) {
                rejectResetBinding(name: $name, number: $number)
            }
        `, vars);

        await this.getResetBindings();

        this.setState({ isRequestMaking: false });
    }
    toggleFilterDropdown() {
        this.setState({ filterDropdownShown: !this.state.filterDropdownShown });
    }
    toggleActiveClass(e) {
        e.target.classList.toggle('active');
    }
    render() {
        const {
            isRequestMaking,
            existingStatuses,
            filterBy,
            filterDropdownShown
        } = this.state;

        const { page } = this.props.match.params;

        const limit = 15;
        let resetBindings = [];
        this.state.resetBindingRequests.map((request, i) => {
            if (request.status.toLowerCase() == 'waiting') {
                request.status = 'на рассмотрении'
            } else if (request.status.toLowerCase() == 'unsuccessful') {
                request.status = 'отклонён';
            } else if (request.status.toLowerCase() == 'done') {
                request.status = 'принят';
            }

            const requestToRender = (
                <div
                    onClick={this.toggleActiveClass}
                    key={new Date() - new Date(request.date)}
                    className="reset-request"
                >
                    <div className="number">{request.id}</div>
                    <div className="reason">{request.reason}</div>
                    <div className="date">{new Date(request.date).toLocaleDateString()}</div>
                    <div className="ip">{request.ip || 'localhost'}</div>
                    <div className="location">{request.location || 'Москва'}</div>
                    <div className="status">{request.status}</div>
                    <div
                        className="action"
                        style={
                            {
                                opacity: isRequestMaking ? 0 : 1,
                                pointerEvents: isRequestMaking ? 'none' : 'all'
                            }
                        }
                    >
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
                                    request.status == 'отклонён' || request.status == 'принят'
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
            );

            if (requestToRender) {
                if (filterBy.toLowerCase() == 'все' ) {
                    resetBindings.push(requestToRender);
                } else if (filterBy.toLowerCase() == 'на рассмотрении' && request.status == 'на рассмотрении') {
                    resetBindings.push(requestToRender);
                } else if (filterBy.toLowerCase() == 'принят' && request.status == 'принят') {
                    resetBindings.push(requestToRender);
                } else if (filterBy.toLowerCase() == 'отклонён' && request.status == 'отклонён') {
                    resetBindings.push(requestToRender);
                }
            }
        });

        resetBindings = resetBindings.map((request, i) => {
            const renderLimit = limit * page;
            const renderFrom = renderLimit - limit;

            if (i >= renderFrom && i < renderLimit) {
                return request;
            }
        });
        const sortBy = existingStatuses.map(status => (
            <div onClick={this.filterByStatus} key={status} className="item">
                {status}
            </div>
        ));

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
                            value={this.state.searchValue}
                        />
                    </div>
                    <div
                        className="filter-by-status-dropdown"
                    >
                        <div onClick={this.toggleFilterDropdown} className="current-filter">
                            {filterBy}
                            <img
                                className="arrow"
                                src="/images/user-menu-arrow.png"
                                style={
                                    {
                                        transform: `rotate(${filterDropdownShown ? '180deg' : 0})`
                                    }
                                }
                            />
                        </div>
                        <div
                            className="possible-filters"
                            style={
                                {
                                    maxHeight: filterDropdownShown ? '155px' : 0
                                }
                            }
                        >
                            {sortBy}
                        </div>
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
                    <div
                        className="requests"
                        style={
                            {
                                opacity: isRequestMaking ? 0 : 1,
                                pointerEvents: isRequestMaking ? 'none' : 'all'
                            }
                        }
                    >
                        {resetBindings}
                    </div>
                </div>
                <Pages page={page} array={resetBindings} path="reset-binding" />
            </div>
        )
    }
}

export default withRouter(ResetBindings);
