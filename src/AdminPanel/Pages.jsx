import React from "react";
import { NavLink, Link } from "react-router-dom";

export default class Pages extends React.Component {
    constructor() {
        super();
        this.state = {
            array: [],
            path: '',
            page: 0,
            chooseAdditionalPagesShown: false,
            limitPage: 0,
            hiddenPageLinks: [],
            pages: [],
            searchValue: '',
            itemsOnPage: 15
        };
        this.handleSearchPages = this.handleSearchPages.bind(this);
        this.toggleChooseAdditionalPages = this.toggleChooseAdditionalPages.bind(this);
        this.hideChooseAdditionalPages = this.hideChooseAdditionalPages.bind(this);
    }
    componentDidUpdate(prevProps) {
        let { path, page } = this.props;
        const array = this.props.array ? this.props.array : [];
        const itemsOnPage = this.props.itemsOnPage ? this.props.itemsOnPage : 15;
        page = +page;
        if (prevProps.array != array) {
            this.setState({
                array,
                path,
                page,
                itemsOnPage
            });
        }
    }
    componentDidMount() {
        window.onkeydown = function(e) {
            if (e.keyCode == 27) this.hideChooseAdditionalPages();
        }.bind(this);
    }
    handleSearchPages(e) {
        this.setState({ searchValue: e.target.value.trim() });
    }
    toggleChooseAdditionalPages() {
        const input = document.getElementById('search-pages');
        input.focus();
        this.setState({ chooseAdditionalPagesShown: !this.state.chooseAdditionalPagesShown });
    }
    hideChooseAdditionalPages() {
        const input = document.getElementById('search-pages');
        input.blur();
        this.setState({ chooseAdditionalPagesShown: false });
    }
    render() {
        let {
            path,
            page,
            chooseAdditionalPagesShown,
            array,
            searchValue,
            itemsOnPage
        } = this.state;
        page = +page;
        const pages = [];
        let limitPage = 0;
        const linksInDropdown = [];
        array.map((_, i) => {
            const linkToRender = (
                <NavLink
                    className="remained-page"
                    to={`/admin/${path}/${i / itemsOnPage + 1}`}
                    key={i / itemsOnPage + 1}
                    onClick={this.hideChooseAdditionalPages}
                >
                    {i / itemsOnPage + 1}
                </NavLink>
            );
            if (i % itemsOnPage == 0) {
                const valueToSearch = i / itemsOnPage + 1;
                if (valueToSearch.toString().includes(searchValue)) {
                    linksInDropdown.push(linkToRender);
                } else if (searchValue == '') {
                    linksInDropdown.push(linkToRender);
                }
                limitPage = i;
            }
        });
        limitPage = limitPage / itemsOnPage + 1;

        let result = array.length / itemsOnPage;
        result = Math.ceil(result);

        if (result > 4) {
            pages.push(
                <button
                    className="page-link more-pages"
                    key="chooseAdditionalPagesButton"
                >
                    <div
                        className="three-dots-wrap"
                        onClick={this.toggleChooseAdditionalPages}
                    >
                        ...
                    </div>
                    <div
                        className="additional-pages-dropdown"
                        style={
                            {
                                pointerEvents: chooseAdditionalPagesShown ? 'all' : 'none',
                                opacity: chooseAdditionalPagesShown ? 1 : 0
                            }
                        }    
                    >
                        <div className="search-wrap">
                            <input
                                type="text"
                                onChange={this.handleSearchPages}
                                className="search-pages"
                                id="search-pages"
                                onKeyDown={(e) => {
                                    if (e.keyCode == 27) this.hideChooseAdditionalPages();
                                }}
                            />
                        </div>
                        <div
                            className="additional-pages"
                        >
                            {linksInDropdown}
                        </div>
                    </div>
                </button>
            );
        }

        const linksToAdd = [
            <Link
                className={`page-link ${page <= 2 ? 'disabled' : ''}`}
                to={`/admin/${path}/${page - 2}`}
                key="backTwoTimes"
            >
                <img
                    className="back switch-page"
                    src={'/images/categories-arrow-menu.png'}
                />
                <img
                    className="back switch-page"
                    src={'/images/categories-arrow-menu.png'}
                />
            </Link>,
            <Link
                className={`page-link ${page <= 1 ? 'disabled' : ''}`}
                to={`/admin/${path}/${page - 1}`}
                key="backOneTime"
            >
                <img
                    className="back switch-page"
                    src={'/images/categories-arrow-menu.png'}
                />
            </Link>,
            <NavLink
                to={`/admin/${path}/${
                    page <= 3
                        ? 1
                        : page >= limitPage - 1
                            ? limitPage - 3
                            : page - 2
                    }`
                }
                className="page-link"
                key="page - 2"
            >
                {
                    page <= 3
                        ? 1
                        : page >= limitPage - 1
                            ? limitPage - 3
                            : page - 2
                }
            </NavLink>
        ];

        if (result >= 2) {
            linksToAdd.push(
                <NavLink
                    to={`/admin/${path}/${
                        page <= 3
                            ? 2
                            : page >= limitPage - 1
                                ? limitPage - 2
                                : page - 1
                    }`}
                    className="page-link"
                    key="page - 1"
                >
                    {
                        page <= 3
                            ? 2
                            : page >= limitPage - 1
                                ? limitPage - 2
                                : page - 1
                    }
                </NavLink>
            );
        }

        if (array.length > 0) {
            pages.unshift(linksToAdd);
        }

        if (result >= 4) {
            pages.push(
                <NavLink
                    to={
                        `/admin/${path}/${
                            page < 3
                                ? 3
                                : page + 1 < limitPage
                                    ? page + 1
                                    : limitPage - 1
                        }`
                    }
                    className="page-link"
                    key="page + 1"
                >
                    {
                        page < 3
                            ? 3
                            : page + 1 < limitPage
                                ? page + 1
                                : limitPage - 1
                    }
                </NavLink>,
                <NavLink
                    to={
                        `/admin/${path}/${
                            page < 3
                                ? 4
                                : page + 2 < limitPage
                                    ? page + 2
                                    : limitPage
                        }`
                    }
                    className="page-link"
                    key="page + 2"
                >
                    {
                        page < 3
                            ? 4
                            : page + 2 > limitPage
                                ? limitPage
                                : page + 2
                    }
                </NavLink>
            );
        } else if (result >= 3) {
            pages.push(
                <NavLink
                    to={
                        `/admin/${path}/${
                            page <= 3
                                ? 3
                                : page + 1 < limitPage
                                    ? page + 1
                                    : limitPage - 1
                        }`
                    }
                    className="page-link"
                    key="page + 1"
                >
                    {
                        page <= 3
                            ? 3
                            : page + 1 < limitPage
                                ? page + 1
                                : limitPage - 1
                    }
                </NavLink>
            );
        } 

        if (array.length > 0) {
            pages.push(
                <Link
                    className={`page-link ${page + 1 > limitPage ? 'disabled' : ''}`}
                    to={`/admin/${path}/${page + 1}`}
                    key="skipTwoTimes"
                >
                    <img
                        className="skip switch-page"
                        src={'/images/categories-arrow-menu.png'}
                    />
                </Link>,
                <Link
                    className={`page-link ${page + 2 > limitPage ? 'disabled' : ''}`}
                    to={`/admin/${path}/${page + 2}`}
                    key="skipOneTime"
                >
                    <img
                        className="skip switch-page" src={'/images/categories-arrow-menu.png'}
                    />
                    <img
                        className="skip switch-page" src={'/images/categories-arrow-menu.png'}
                    />
                </Link>
            );
        }

        return (
            <div className="pages">
                {pages}
            </div>
        );
    }
}
