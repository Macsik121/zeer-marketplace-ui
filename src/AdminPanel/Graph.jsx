import React from 'react';

export default class Graph extends React.Component {
    constructor() {
        super();
        this.state = {
            mouseX: 0,
            mouseY: 0
        };
    }
    render() {
        const {
            className,
            style,
            date,
            array,
            graphColor
        } = this.props;
        const { mouseX, mouseY } = this.state;
    
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
        
        const graph = array.map(element => (
            <div
                key={new Date() - new Date(element.date)}
                className="graph-item"
                onMouseMove={e => {
                    this.setState({ mouseX: e.pageX, mouseY: e.pageY });
                }}
            >
                <div    
                    className="graph-date"
                    style={
                        {
                            top: mouseY - 70,
                            left: mouseX - 199
                        }
                    }
                >
                    {element.value}
                </div>
                <div
                    className="graph-column"
                    style={
                        {
                            backgroundColor: graphColor,
                            height: `${element.value * 3}px`
                        }
                    }
                    onMouseEnter={(e) => {
                        e.target.parentNode.childNodes[0].classList.add('hovered');
                    }}
                    onMouseLeave={(e) => {
                        e.target.parentNode.childNodes[0].classList.remove('hovered');
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
