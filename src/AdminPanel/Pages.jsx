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
        const { array, path, page } = this.props;
        const itemsOnPage = this.props.itemsOnPage ? this.props.itemsOnPage : 15;
        if (prevProps.array != array) {
            this.setState({
                array,
                path,
                page: +page,
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
        this.setState({ searchValue: e.target.value });
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
        const hiddenPageLinks = [];
        array.map((_, i) => {
            const linkToRender = (
                <NavLink
                    className="page-link"
                    to={`/admin/${path}/${i / itemsOnPage + 1}`}
                    key={i / itemsOnPage + 1}
                >
                    {i / itemsOnPage + 1}
                </NavLink>
            );
            if (i % itemsOnPage == 0 && i >= itemsOnPage * 3) {
                hiddenPageLinks.push(i / itemsOnPage + 1);
                limitPage = i;
                return;
            }
            if (i % itemsOnPage == 0) {
                pages.push(linkToRender);
                limitPage = i;
            }
        });
        limitPage = limitPage / itemsOnPage + 1;

        if (pages.length + hiddenPageLinks.length > 3) {
            const hiddenPageLinksCopy = [...hiddenPageLinks];
            if (hiddenPageLinksCopy.length == 2) {
                hiddenPageLinksCopy.pop();
            } else if (hiddenPageLinksCopy.length > 2) {
                hiddenPageLinksCopy.pop();
                hiddenPageLinksCopy.pop();
            }
            const theRestPages = (
                hiddenPageLinksCopy.map(currentPage => {
                    if (currentPage.toString().includes(searchValue)) {
                        return (
                            <NavLink
                                to={`/admin/${path}/${currentPage}`}
                                className="remained-page"
                                key={currentPage}
                                onClick={this.hideChooseAdditionalPages}
                            >
                                {currentPage}
                            </NavLink>
                        )
                    } else if (searchValue == '') {
                        return (
                            <NavLink
                                to={`/admin/${path}/${currentPage}`}
                                className="remained-page"
                                key={currentPage}
                                onClick={this.hideChooseAdditionalPages}
                            >
                                {currentPage}
                            </NavLink>
                        )
                    }
                })
            );
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
                            {theRestPages}
                        </div>
                    </div>
                </button>
            );
        }

        if (hiddenPageLinks.length > 2) {
            const lastPage = hiddenPageLinks[hiddenPageLinks.length - 1];
            const preLastPage = hiddenPageLinks[hiddenPageLinks.length - 2];
        
            pages.push(
                <NavLink
                    className="page-link"
                    to={`/admin/${path}/${preLastPage}`}
                    key={preLastPage}
                >
                    {preLastPage}
                </NavLink>,
                <NavLink
                    className="page-link"
                    to={`/admin/${path}/${lastPage}`}
                    key={lastPage}
                >
                    {lastPage}
                </NavLink>
            );
        }
    
        if (pages.length > 0) {
            pages.unshift(
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
                </Link>
            );
        
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
    
        return pages;
    }
}
