import React from 'react';
import CloseIcon from '@material-ui/icons/Close';

export default class AgreementPrivacyNPolicy extends React.Component {
    constructor() {
        super();
        this.state = {
            agreement: [
                {
                    title: 'Общие правила',
                    rules: [
                        'Администрация вправе отказать в воврате средств',
                        'Возврат средств возможен, если ПО не работает по нашей вине',
                        'Мы не несем отвественность за блокировку вашего аккаунта',
                        'Подписка на 9999 дней будет работать, пока проект продолжает свое существование',
                        'При покупке подписки с вас не будут ежемесячно списывать без вашего уведомления деньги, как это сделано в другом популярном проекте',
                        'Мы вправе отказать вам в сбросе HWID, если так посчитаем нужным. За исключением использования ченжера в компьютерных клубах',
                        'Для работы требуется стабильное интернет соединение.'
                    ],    
                },
                {
                    title: 'За что можно получить блокировку',
                    rules: [
                        'За использование программ анализа трафика, декомпиляцию кода и другие вспомогательные средства для взломаны программы',
                        'Запрещено продавать\\передавать подписку 3-м лицам',
                        'Оскорбление Администрации проекта',
                        'Попытка обмануть Администрацию проекта',
                        'Администрация вправе заблокировать подписку без объяснения причины'
                    ]
                }
            ]
        };
    }
    render() {
        const { style, hideAgreement } = this.props;
        const rules = this.state.agreement.map((term, termIndex) => (
            <div className="term">
                <h3 className="term-title">{term.title}:</h3>
                <ul className="rules">
                    {term.rules.map((rule, ruleIndex) => (
                        <li className="rule">
                            {termIndex + 1}.{ruleIndex + 1}
                            &nbsp;&nbsp;{rule}.
                        </li>
                    ))}
                </ul>
            </div>
        ));
        return (
            <div style={style} className="privacy-and-policy-agreement">
                <div className="heading">
                    <h2>Соглашение</h2>
                    <CloseIcon onClick={hideAgreement} className="close-modal" />
                </div>
                <div className="agreement">
                    <span className="advise">Перед покупкой сответуем ознакомиться:</span>
                    {rules}
                </div>
            </div>
        )
    }
}
