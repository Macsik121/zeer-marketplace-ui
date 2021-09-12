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
        console.log(scaleY);

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
                            height: `${element.value * 3}px`,
                            transform: scaleY
                        }
                    }
                    onMouseEnter={e => {
                        e.target.parentNode.childNodes[0].classList.add('hovered');
                    }}
                    onMouseLeave={e => {
                        e.target.parentNode.childNodes[0].classList.remove('hovered');
                    }}
                    onMouseMove={e => {
                        const date = document.getElementById('graph-value' + (i + 1).toString());
                        const rect = e.target.getBoundingClientRect();
                        date.style.top = `${e.pageY - rect.top}px`;
                        date.style.left = `${e.pageX - rect.left}px`;
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
                        {theBiggestValue}
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
