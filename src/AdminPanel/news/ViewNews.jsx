import React from 'react';
import { withRouter } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import fetchData from '../../fetchData';
import Pages from '../Pages.jsx';

class ConfirmDeleteNews extends React.Component {
    constructor() {
        super();
        this.state = {
            isRequestMaking: false
        };
        this.deleteNews = this.deleteNews.bind(this);
    }
    async deleteNews() {
        this.setState({ isRequestMaking: true });
        const {
            product,
            newsToDelete
        } = this.props;
        const vars = {
            title: product.title,
            changeTitle: newsToDelete.id
        };
 
        await fetchData(`
            mutation deleteNews($title: String!, $changeTitle: Int!) {
                deleteNews(title: $title, changeTitle: $changeTitle)
            }
        `, vars);

        await this.props.getNews();

        await this.props.hideModal();

        this.setState({ isRequestMaking: false });
    }
    render() {
        const { isRequestMaking } = this.state;
        const {
            style,
            newsToDelete,
            hideModal
        } = this.props;

        return (
            <div
                style={
                    {
                        opacity: isRequestMaking ? 0 : style.opacity,
                        pointerEvents: isRequestMaking ? 'none' : style.pointerEvents,
                        transform: style.transform
                    }
                }
                className="confirm-action"
            >
                <div className="heading">
                    <h2>Подтвердите действие</h2>
                    <CloseIcon className="close-modal" onClick={hideModal} />
                </div>
                <div className="content">
                    Вы действительно хотите удалить новость версии {newsToDelete.version}
                </div>
                <div className="buttons">
                    <div className="button agree" onClick={this.deleteNews}>Да</div>
                    <div className="button refuse" onClick={hideModal}>Нет</div>
                </div>
            </div>
        )
    }
}

class ViewNews extends React.Component {
    constructor() {
        super();
        this.state = {
            product: {},
            newsToDelete: {},
            isRequestMaking: true,
            deleteNewsShown: false
        };
        this.deleteAllNews = this.deleteAllNews.bind(this);
        this.hideDeleteNews = this.hideDeleteNews.bind(this);
        this.getNews = this.getNews.bind(this);
    }
    async componentDidMount() {
        window.onkeydown = function(e) {
            if (e.keyCode == 27) {
                this.hideDeleteNews();
            }
        }.bind(this);
        await this.getNews();
    }
    async getNews() {
        this.setState({ isRequestMaking: true });
        const { title } = this.props.match.params;
        const vars = {
            title
        };

        const result = await fetchData(`
            query getProduct($title: String!) {
                getProduct(title: $title) {
                    title
                    costPerDay
                    id
                    productFor
                    imageURLdashboard
                    changes {
                        id
                        version
                        created
                        description
                    }
                }
            }
        `, vars);

        this.setState({ isRequestMaking: false, product: result.getProduct });
    }
    toggleClass(e) {
        e.target.childNodes[0].classList.toggle('active');
    }
    async deleteAllNews() {
        this.setState({ isRequestMaking: true });
        const { title } = this.props.match.params;

        await fetchData(`
            mutation deleteAllNews($title: String!) {
                deleteAllNews(title: $title)
            }
        `, { title });

        await this.getNews();

        this.setState({ isRequestMaking: false });
    }
    hideDeleteNews() {
        this.setState({ deleteNewsShown: false });
    }
    render() {
        const {
            isRequestMaking,
            product,
            deleteNewsShown,
            newsToDelete
        } = this.state;

        const { page } = this.props.match.params;

        const limit = 15;
        const changes = product.changes && product.changes.map((change, i) => {
            const renderLimit = page * limit;
            const renderFrom = renderLimit - limit;
            if (i < renderLimit && i >= renderFrom) {
                return (
                    <div onClick={this.toggleClass} key={change.id} className="change">
                        <div className="description">{change.description}</div>
                        <div className="version">{change.version}</div>
                        <div className="date">{new Date(change.created).toLocaleDateString()}</div>
                        <div className="action">
                            <button
                                onClick={
                                    (e) => {
                                        e.stopPropagation();
                                        this.setState({ deleteNewsShown: true, newsToDelete: change });
                                    }
                                }
                                style={
                                    {
                                        pointerEvents: deleteNewsShown ? 'none' : 'all'
                                    }
                                }
                                className="button delete"
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                )
            }
        });

        return (
            <div className="product-news">
                <CircularProgress
                    className="progress-bar"
                    style={
                        {
                            display: isRequestMaking ? 'block' : 'none'
                        }
                    }
                />
                <ConfirmDeleteNews
                    style={
                        {
                            opacity: deleteNewsShown ? 1 : 0,
                            pointerEvents: deleteNewsShown ? 'all' : 'none',
                            transform: `translateY(${deleteNewsShown ? 0 : '-150%'})`
                        }
                    }
                    product={product}
                    newsToDelete={newsToDelete}
                    hideModal={this.hideDeleteNews}
                    getNews={this.getNews}
                />
                <div
                    className="search-bar"
                    style={
                        {
                            opacity: isRequestMaking ? 0 : deleteNewsShown ? 0.5 : 1,
                            pointerEvents: deleteNewsShown ? 'none' : 'all'
                        }
                    }
                >
                    <div className="search-field">
                        <img src="/images/search-icon-admin.png" />
                        <input
                            type="text"
                            placeholder="Search here"
                            onChange={this.searchProducts}
                        />
                    </div>
                </div>
                <h2
                    style={
                        {
                            opacity: isRequestMaking ? 0 : deleteNewsShown ? 0.5 : 1,
                            pointerEvents: deleteNewsShown ? 'none' : 'all'
                        }
                    }
                >
                    Просмотр новостей продукта&nbsp;
                    <span
                        style={
                            {
                                opacity: isRequestMaking ? 0 : 1,
                                pointerEvents: isRequestMaking ? 'none' : 'all'
                            }
                        }
                    >
                        {this.props.match.params.title}
                    </span>
                </h2>
                <div
                    className="news-wrap"
                    style={
                        {
                            opacity: isRequestMaking ? 0 : deleteNewsShown ? 0.5 : 1,
                            pointerEvents: deleteNewsShown ? 'none' : 'all'
                        }
                    }
                >
                    <div className="table">
                        <div className="heading">
                            <div className="description">Описание</div>
                            <div className="version">Версия</div>
                            <div className="date">Дата</div>
                            <div className="action">Действие</div>
                        </div>
                        <div className="changes">
                            {changes}
                        </div>
                        <Pages
                            page={page}
                            array={Object.keys(product).length > 0 && changes}
                            path={`news/${product.title}`}
                        />
                    </div>
                    <div className="product">
                        <img className="cover" src={product.imageURLdashboard} />
                        <div className="product-title">
                            {product.title}{' | '}{product.productFor}
                        </div>
                        <div className="content-wrap">
                            <div className="news-amount">
                                Кол-во новостей:&nbsp;
                                {product.changes ? product.changes.length : 0}
                            </div>
                            <div className="buttons">
                                <button
                                    className="button delete-all-news"
                                    onClick={this.deleteAllNews}
                                >
                                    Удалить все новости
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(ViewNews);
