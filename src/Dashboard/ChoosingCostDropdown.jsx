import React from 'react';

export default class ChoosingCostDropdown extends React.Component {
    constructor() {
        super();
        this.state = {
            showDropdown: false,
            choosenDropdown: ''
        };
    }
    componentDidUpdate(prevProps) {
        const { getCost, costPerDay, allCost } = this.props;
        const { choosenDropdown } = this.state;
        if (allCost && prevProps.allCost != allCost) {
            if (allCost[0]) this.setState({ choosenDropdown: allCost[0].menuText });
        }
        // if (costPerDay && prevProps.costPerDay != costPerDay) {
        //     if (getCost) getCost(cost);
        // };
    }
    calculateCost(cost) {
        const { getCost, getChoosenDropdown } = this.props;
        if (getChoosenDropdown) getChoosenDropdown(cost);
        this.setState({ choosenDropdown: cost });
        if (getCost) getCost(cost);
    }
    render() {
        const { cost, allCost } = this.props;
        let {
            showDropdown,
            choosenDropdown
        } = this.state;
        const verticalLayout = this.props.verticalLayout ? this.props.verticalLayout : false;

        let costDropdown = [];
        if (allCost) {
            costDropdown = allCost.map((cost, i) => (
                <div
                    className="item"
                    key={i}
                    onClick={() => this.calculateCost(cost.menuText)}
                >
                    {cost.menuText}
                    {cost.menuText == choosenDropdown &&
                        <img className="cost-selected" src="/images/selected-cost.png" />
                    }
                </div>
            ));
        }

        let productCost;
        if (allCost) {
            allCost.map(cost => {
                if (cost.menuText == choosenDropdown) {
                    productCost = (
                        <span className="cost">
                            {
                                cost.cost
                            }&#8381;&nbsp;/&nbsp;{
                                cost.costPer
                            }
                        </span>
                    )
                }
            });
        }

        return (
            <div
                className="calc-cost"
                style={
                    {
                        flexDirection: verticalLayout ? 'column' : 'row'
                    }
                }
            >
                <div
                    className="dropdown"
                    onClick={
                        function() {
                            this.setState({ showDropdown: !this.state.showDropdown })
                        }.bind(this)
                    }
                    style={
                        showDropdown
                            ? {
                                borderBottomLeftRadius: 0,
                                borderBottomRightRadius: 0,
                                padding: '0 -1px'
                            } : {
                                borderBottomLeftRadius: '10px',
                                borderBottomRightRadius: '10px',
                                padding: '0 -1px'
                            }
                    }
                >
                    <div className="calculated-time">
                        {choosenDropdown}
                        <img className="dropdown-arrow" src="/images/categories-arrow-menu.png" />
                    </div>
                    <div
                        className="items"
                        style={
                            showDropdown
                                ? {
                                    maxHeight: '550px',
                                    transition: '350ms',
                                } : {
                                    maxHeight: '0',
                                    transition: '200ms',
                                }
                        }
                    >
                        {costDropdown}
                    </div>
                </div>
                <div
                    className="gray-line"
                    style={
                        {
                            display: verticalLayout ? 'none' : 'block'
                        }
                    }
                />
                <div
                    className="calculated-cost"
                    style={
                        {
                            marginTop: verticalLayout ? '15px' : 0
                        }
                    }
                >
                    {productCost}
                </div>
            </div>
        )
    }
}
