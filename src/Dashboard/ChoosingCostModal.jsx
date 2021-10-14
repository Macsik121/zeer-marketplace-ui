import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import createNotification from '../createNotification';
import fetchData from '../fetchData';
import ChoosingCostDropdown from './ChoosingCostDropdown.jsx';

export default class ChoosingCostModal extends React.Component {
    constructor() {
        super();
        this.state = {
            product: {
                allCost: [],
                cost: 0
            },
            choosenDropdown: 'Ежеквартально',
            cost: 0,
            requestMaking: false
        };
        this.getChoosenDropdown = this.getChoosenDropdown.bind(this);
        this.getCost = this.getCost.bind(this);
        this.activatePromocode = this.activatePromocode.bind(this);
    }
    componentDidUpdate(prevProps) {
        const { product } = this.props;
        if (prevProps.product != product) {
            this.setState({ product });
        }
        if (product.allCost && prevProps.product.allCost != product.allCost) {
            this.setState({ choosenDropdown: product.allCost[0].menuText });
        }
    }
    getChoosenDropdown(choosenDropdown) {
        this.setState({ choosenDropdown });
    }
    getCost(cost) {
        this.setState({ cost });
    }
    async activatePromocode(e) {
        e.preventDefault();
        this.setState({ requestMaking: true });
        const { product: { title, allCost } } = this.state;
        const form = document.forms.activatePromo;
        const name = form.promoName.value;

        const vars = {
            name,
            title
        };
        const {
            isPromocodeRight: {
                response: {
                    message,
                    success
                },
                discountPercent
            }
        } = await fetchData(`
            query isPromocodeRight($name: String!, $title: String!) {
                isPromocodeRight(name: $name, title: $title) {
                    response {
                        message
                        success
                    }
                    discountPercent
                }
            }
        `, vars);
        createNotification(success ? 'success' : 'error', message);
        allCost.map(cost => {
            cost.cost = Math.round(cost.cost - (discountPercent / 100 * cost.cost));
        });

        this.setState({
            requestMaking: false,
            product: {
                ...this.state.product,
                allCost
            }
        });
    }
    render() {
        const {
            style,
            hideModal,
            buyProduct
        } = this.props;

        const {
            product,
            choosenDropdown,
            requestMaking
        } = this.state;
        const { costPerDay, title } = product;
        let costToBuy = 1;
        let days = 1;
        if (product.allCost) {
            product.allCost.map(cost => {
                if (cost.menuText.toLowerCase() == choosenDropdown.toLowerCase()) {
                    costToBuy = cost.cost;
                    days = cost.days;
                }
            });
        }

        return (
            <div
                className="choosing-cost-modal"
                style={{
                    pointerEvents: requestMaking ? 'none' : style.pointerEvents,
                    opacity: requestMaking ? .5 : style.opacity
                }}
            >
                <div className="heading">
                    <h3>Выберите количество дней</h3>
                    <CloseIcon className="close-icon" onClick={hideModal} />
                </div>
                <div className="choose-cost">
                    <h3 className="product-title">Покупка продукта {title}</h3>
                    <ChoosingCostDropdown
                        verticalLayout={true}
                        costPerDay={costPerDay}
                        getChoosenDropdown={this.getChoosenDropdown}
                        getCost={this.getCost}
                        cost={product.cost}
                        allCost={product.allCost}
                    />
                    <button
                        className="buy-product"
                        onClick={() => {
                            buyProduct({
                                title,
                                cost: costToBuy,
                                days
                            });
                        }}
                    >
                        Купить
                    </button>
                </div>
                <form
                    className="activate-promocode"
                    name="activatePromo"
                    onSubmit={this.activatePromocode}
                >
                    <div className="field-wrap">
                        <input
                            type="text"
                            name="promoName"
                            className="promo-name-field"
                            required
                        />
                        <label className="field-label">Введите промокод</label>
                    </div>
                    <button className="activate" type="submit">Активировать</button>
                </form>
            </div>
        )
    }
}
