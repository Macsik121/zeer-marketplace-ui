import React from 'react';

export default class ChoosingCostDropdown extends React.Component {
    constructor() {
        super();
        this.state = {
            showDropdown: false,
            choosenDropdown: 'Ежеквартально'
        };
    }
    render() {
        const { costPerDay } = this.props;

        return (
            <div className="calc-cost">
                <div
                    className="dropdown"
                    onClick={
                        function() {
                            this.setState({ showDropdown: !this.state.showDropdown })
                        }.bind(this)
                    }
                    style={
                        this.state.showDropdown
                            ? {
                                borderBottomLeftRadius: 0,
                                borderBottomRightRadius: 0,
                                padding: '0 -1px'
                            }
                            : {
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
                            this.state.showDropdown
                                ? {
                                    maxHeight: '550px',
                                    transition: '350ms',
                                }
                                : {
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
