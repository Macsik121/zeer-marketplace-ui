import React from 'react';
import CloseIcon from '@material-ui/icons/Close';

export default class Contacts extends React.Component {
    constructor() {
        super();
        this.state = {
            contacts: {
                owner: 'Шинкевич А.П',
                info: {
                    companyIE: '321253600039494',
                    TIN: '254300096636',
                    email: 'zeerchangers@gmail.com',
                    phone: '+79677527491'
                }
            }
        };
    }
    render() {
        const {
            style,
            hideModal
        } = this.props;
        const { contacts } = this.state;
        const {
            companyIE,
            TIN,
            email,
            phone
        } = contacts.info;

        return (
            <div
                className="contacts-modal"
                style={style}
            >
                <div className="heading">
                    <h3>Контакты</h3>
                    <CloseIcon className="close-icon" onClick={hideModal} />
                </div>
                <div className="table">
                    <h3 className="contacts-owner">ИП {contacts.owner}</h3>
                    <div className="info-wrap">
                        <div className="information">
                            <div className="companyIE">ОГРНИП</div>
                            <div className="companyIE">{companyIE}</div>
                        </div>
                        <div className="information">
                            <div className="tin">ИНН</div>
                            <div className="tin">{TIN}</div>
                        </div>
                        <div className="information">
                            <div className="email">Email</div>
                            <div className="email">{email}</div>
                        </div>
                        <div className="information">
                            <div className="phone">Телефон</div>
                            <div className="phone">{phone}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
