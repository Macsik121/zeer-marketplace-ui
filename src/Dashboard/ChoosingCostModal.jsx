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
        console.log('product:', product);
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
    render() {
        const {
            style,
            hideModal,
            buyProduct
        } = this.props;

        const {
            product,
            choosenDropdown,
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
