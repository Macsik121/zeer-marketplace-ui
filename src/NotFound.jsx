import React from 'react';
import {Link} from 'react-router-dom';

export default class NotFound extends React.Component {
    constructor() {
        super();
        this.state = {
            notFoundContent: 'Возможно вы неверно указали адрес страницы, либо страница не существует'
        };
    }
    render() {
        const {notFoundContent} = this.state;
        return (
            <>
                <div className="not-found">
                    <h2>Страница не найдена</h2>
                    <label className="content">
                        {notFoundContent}
                    </label>
                    <div className="error">
                        <span className="four">4</span>
                        <img src="/images/logo-not-found.png" className="logo" />
                        <span className="four">4</span>
                    </div>
                    <div className="link">
                        <Link className="link-to-home" to="/">Перейти на главную</Link>
                    </div>
                </div>
            </>
        )
    }
}