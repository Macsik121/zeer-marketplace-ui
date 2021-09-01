import React from 'react';
import CloseIcon from '@material-ui/icons/Close';

export default class DaysToBuy extends React.Component {
    render() {
        const { hideModal } = this.props;

        return (
            <div className="days-to-buy-modal">
                <div className="heading">
                    <h3>На сколько дней вы хотите купить подписку?</h3>
                    <CloseIcon className="close-icon" onClick={hideModal} />
                </div>
                <div className="content">
                    Choosing cost dropdown here
                </div>
                <div className="buttons">
                    <div className="pay">Оплатить</div>
                    <div className="close-modal">Закрыть</div>
                </div>
            </div>
        )
    }
}
