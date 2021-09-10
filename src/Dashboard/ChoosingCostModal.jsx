import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import ChoosingCostDropdown from './ChoosingCostDropdown.jsx';

export default class ChoosingCostModal extends React.Component {
    constructor() {
        super();
        this.state = {
            product: {},
            choosenDropdown: 'Ежеквартально',
            cost: 0
        };
        this.getChoosenDropdown = this.getChoosenDropdown.bind(this);
        this.getCost = this.getCost.bind(this);
    }
    componentDidUpdate(prevProps) {
        const { product } = this.props;
        if (prevProps.product != product) {
            this.setState({ product });
        }
    }
    getChoosenDropdown(choosenDropdown) {
        this.setState({ choosenDropdown });
    }
    getCost(cost) {
        this.setState({ cost });
    }
    render() {
        const {
            style,
            hideModal,
            buyProduct
        } = this.props
        const {
            product,
            choosenDropdown,
            cost
        } = this.state;
        const { costPerDay, title } = product;
        let costToBuy = product.cost && product.cost.perDay;
        if (product.cost) (
            costToBuy = choosenDropdown.toLowerCase() == 'ежемесячно'
                ? product.cost.perMonth
                : choosenDropdown.toLowerCase() == 'ежеквартально'
                    ? product.cost.perDay
                    : product.cost.perYear
        )

        let days = 1;
        if (choosenDropdown.toLowerCase() == 'ежемесячно') {
            days = 30;
        } else if (choosenDropdown.toLowerCase() == 'ежегодно') {
           days = 30 * 12;
        }

        return (
            <div
                className="choosing-cost-modal"
                style={style}
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
                        onClick={() => buyProduct(title, costToBuy, days)}
                    >
                        Купить
                    </button>
                </div>
            </div>
        )
    }
}
