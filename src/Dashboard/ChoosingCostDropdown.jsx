import React from 'react';

export default class ChoosingCostDropdown extends React.Component {
    constructor() {
        super();
        this.state = {
            showDropdown: false,
            choosenDropdown: 'Ежеквартально',
            possibleCosts: ['Ежемесячно', 'Ежеквартально', 'Ежегодно']
        };
    }
    componentDidUpdate(prevProps, prevState) {
        const { getCost, costPerDay } = this.props;
        const { choosenDropdown } = this.state;
        let cost = this.costInNumber(choosenDropdown);
        cost = cost * costPerDay;
        if (costPerDay && prevProps.costPerDay != costPerDay) {
            if (getCost) getCost(cost);
        };
    }
    calculateCost(cost) {
        const { choosenDropdown } = this.state;
        const { getCost, getChoosenDropdown, costPerDay } = this.props;
        if (getChoosenDropdown) getChoosenDropdown(cost);
        this.setState({ choosenDropdown: cost });
        const newCost = this.costInNumber(cost);
        cost = newCost * costPerDay;
        if (getCost) getCost(cost);
    }
    costInNumber(cost) {
        cost = cost.toLowerCase();
        if (cost == 'ежеквартально') cost = 1;
        else if (cost == 'ежемесячно') cost = 30;
        else if (cost == 'ежегодно') cost = 30 * 12;
        return cost;
    }
    render() {
        const { costPerDay } = this.props;
        let {
            showDropdown,
            choosenDropdown,
            possibleCosts
        } = this.state;

        const costDropdown = possibleCosts.map(cost => (
            <div className="item" key={cost} onClick={() => this.calculateCost(cost)}>
                {cost}
                {cost == choosenDropdown &&
                    <img className="cost-selected" src="/images/selected-cost.png" />
                }
            </div>
        ));

        let productCost;
        (() => {
            let choosenDropdownCopy = choosenDropdown;
            choosenDropdownCopy = this.costInNumber(choosenDropdownCopy);
            productCost = (
                <span className="cost">
                    {costPerDay * choosenDropdownCopy}&#8381;&nbsp;/&nbsp;{
                        choosenDropdownCopy == 1
                            ? 'День'
                            : choosenDropdownCopy == 30
                                ? 'Месяц'
                                : 'Ежегодно'
                    }
                </span>
            )
        })();

        return (
            <div
                className="calc-cost"
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
                <div className="gray-line"></div>
                <div className="calculated-cost">
                    {productCost}
                </div>
            </div>
        )
    }
}
