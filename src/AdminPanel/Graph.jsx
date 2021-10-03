import React from 'react';

export default class Graph extends React.Component {
    constructor() {
        super();
        this.state = {
            scaleY: 'scaleY(0)'
        };
    }
    componentDidUpdate() {
        const { array } = this.props;
        const { scaleY } = this.state;
        if (array.length > 0 && scaleY == 'scaleY(0)') {
            this.setState({ scaleY: 'scaleY(1)' });
        }
    }
    render() {
        const {
            className,
            style,
            array,
            graphColor,
            isRequestMaking,
            graphTheme
        } = this.props;
        const { scaleY } = this.state;

        const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        const months = [
            'Янв', 'Фев',
            'Март', 'Апр', 'Май',
            'Июнь', 'Июль', 'Авг',
            'Сент', 'Окт', 'Ноябрь',
            'Дек'
        ];

        const week = array.map((el, i) => {
            let elDate;
            if (el.date) elDate = new Date(el.date);
            else {
                elDate = new Date();
                elDate.setDate(new Date().getDate() - new Date().getDay() + i);
            };
            return (
                <div
                    key={new Date() - elDate || i}
                    className="day"
                >
                    {months[elDate.getMonth()]}.&nbsp;
                    {weekDays[elDate.getDay()]},&nbsp;
                    {elDate.getDate()}
                </div>
            )
        });

        const allValues = [1];
        array && array.map(el => {
            allValues.push(el.value);
        });
        let theBiggestValue = Math.max(...allValues);
        theBiggestValue = Math.ceil(theBiggestValue / 100) * 100;
        let middleValue = theBiggestValue / 2;

        const graph = array.map((element, i) => (
            <div
                key={i}
                className="graph-item"
            >
                <div
                    className="graph-value"
                    id={"graph-value" + (i + 1).toString() + graphTheme}
                    style={
                        {
                            bottom: element.value || element.value == 0 ? element.value / theBiggestValue * 100 + 2 + '%' : 2 + 'px'
                        }
                    }
                >
                    {element.value}
                </div>
                <div
                    className="graph-column"
                    id="graph-column"
                    style={
                        {
                            backgroundColor: graphColor,
                            transform: scaleY,
                            height: `${element.value || element.value == 0 ? element.value / theBiggestValue * 100 + '%' : 2 + 'px'}`,
                            opacity: element.value || element.value == 0 ? 1 : 0,
                            pointerEvents: element.value || element.value == 0 ? 'all' : 'none'
                        }
                    }
                    onClick={() => {
                        const graphValue = document.getElementById('graph-value' + (i + 1).toString() + graphTheme);
                        graphValue.classList.toggle('active');
                    }}
                />
            </div>
        ));

        return (
            <div
                className={`graph ${className}`}
                style={style}
            >
                <div className="graph-theme">
                    <div className="graph-color" style={{ backgroundColor: graphColor }} />
                    &nbsp;-&nbsp;<div className="label">{graphTheme}</div>
                </div>
                <div className="graph-wrap">
                    <div className="left-indicators">
                        <div className="left-indicators-wrap">
                            <div className="the-biggest indicator">{theBiggestValue}</div>
                            <div className="middle indicator">{middleValue}</div>
                            <div className="zero indicator">0</div>
                        </div>
                    </div>
                    <div className="column-statistics">
                        {graph}
                    </div>
                </div>
                <div className="bottom-indicators">
                    {week}
                </div>
            </div>
        )
    }
}
