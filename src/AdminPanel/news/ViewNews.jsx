import React from 'react';
import { withRouter } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import fetchData from '../../fetchData';

class ViewNews extends React.Component {
    constructor() {
        super();
        this.state = {
            product: {},
            isRequestMaking: true
        };
    }
    async componentDidMount() {
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
    render() {
        const { isRequestMaking, product } = this.state;

        const changes = product.changes && product.changes.map(change => (
            <div onClick={this.toggleClass} key={change.version} className="change">
                <div className="description">{change.description}</div>
                <div className="version">{change.version}</div>
                <div className="date">{new Date(change.created).toLocaleDateString()}</div>
                <div className="action">
                    <button className="button delete">Удалить</button>
                </div>
            </div>
        ));

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
                <div className="search-bar">
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
                            opacity: isRequestMaking ? 0 : 1
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
                            opacity: isRequestMaking ? 0 : 1
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
                                <button className="button delete-all-news">Удалить все новости</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(ViewNews);
