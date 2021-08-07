import React from 'react';

export default class Footer extends React.Component {
    constructor() {
        super();
        this.state = {
            timeWorking: {
                from: 2018,
                to: 2021
            },
            deviceWidth: 0
        }
    }
    componentDidMount() {
        window.onresize = function() {
            this.setState({ deviceWidth: window.innerWidth });
        }.bind(this);
        this.setState({ deviceWidth: window.innerWidth });
    }
    render() {
        const { timeWorking, deviceWidth } = this.state;
        const { style } = this.props;
        return (
            <footer style={style} className="footer">
                <div className="container">
                    <div className="footer-wrap">
                        <div className="zeer">
                            <img className="logo" src="/images/zeer-logo.png" />
                            <div className="time-working">
                                ZEER - <span>{timeWorking.from}</span>/<span>{timeWorking.to}</span>
                            </div>
                        </div>
                        <div className="contacts">
                            {deviceWidth > 800 &&
                                <span>Мы в социальных сетях</span>
                            }
                            <div className="soc-media">
                                <a href="https://t.me/zeer_changer" target="_blank">
                                    <img src="/images/telegram-icon.png" />
                                </a>
                                <a href="https://vk.com/zeer_csgo" target="_blank">
                                    <img src="/images/vk-icon.png" />
                                </a>
                            </div>
                            <div className="gray-line"></div>
                        </div>
                    </div>
                    <button
                        style={
                            deviceWidth > 700
                                ? {marginTop: 0}
                                : {marginTop: '20px'}
                        }
                        className="download-loader"
                    >
                        Скачать лоадер
                    </button>
                </div>
            </footer>
        )
    }
}
