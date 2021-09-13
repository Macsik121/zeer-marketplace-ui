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
            date,
            array,
            graphColor,
            isRequestMaking,
            graphTheme
        } = this.props;
        const { scaleY } = this.state;

        const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        const months = [
            'Янв', 'Фев',
            'Март', 'Апр', 'Май',
            'Июнь', 'Июль', 'Авг',
            'Сент', 'Окт', 'Ноябрь',
            'Дек'
        ];
    
        const daysOfWeek = [];
        for (let i = 0; i < weekDays.length; i++) {
            daysOfWeek.push({
                weekDay: weekDays[i],
                month: months[date.getMonth()],
                date: i + 1
            });
        }

        const week = daysOfWeek.map((day, i) => (
            <div key={i} className="day">
                {day.month}.&nbsp;
                {day.weekDay},&nbsp;
                {day.date}
            </div>
        ));

        let theBiggestValue = 0;
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            const nextElement = array[i + 1];
            if (nextElement && element.value < nextElement.value) {
                theBiggestValue = nextElement.value;
            }
        }
        theBiggestValue = Math.ceil(theBiggestValue / 100) * 100;
        let middleValue = theBiggestValue / 2;
        console.log('the biggest value:', theBiggestValue);

        const graph = array.map((element, i) => (
            <div
                key={new Date() - new Date(element.date)}
                className="graph-item"
            >
                <div
                    className="graph-value"
                    id={"graph-value" + (i + 1).toString()}
                >
                    {element.value}
                </div>
                <div
                    className="graph-column"
                    id={"graph-column"}
                    style={
                        {
                            backgroundColor: graphColor,
                            transform: scaleY,
                            // height: `${theBiggestValue / element.value * 100}px`
                            height: `${element.value * 2}px`
                        }
                    }
                    onClick={() => {
                        const graphValue = document.getElementById('graph-value' + (i + 1).toString());
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
                <div className="graph-wrap">
                    <div className="graph-theme">
                        <div className="graph-color" style={{ backgroundColor: graphColor }} />
                        &nbsp;-&nbsp;<div className="label">{graphTheme}</div>
                    </div>
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
