import React from 'react';

export default function Graph(props) {
    const {
        className,
        style,
        date,
        leftIndicators
    } = props;

    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const months = [
        'Янв', 'Фев',
        'Март', 'Апр', 'Май',
        'Июнь', 'Июль', 'Авг',
        'Сент', 'Окт', 'Ноябрь',
        'Дек'
    ];
    console.log(date.getDay(), date.getDate())

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

    return (
        <div
            className={`graph ${className}`}
            style={style}
        >
            <div className="graph-wrap">
                <div className="left-indicators">
                    {leftIndicators}
                </div>
                <div className="column-statistics">
                    Graph itself.
                </div>
            </div>
            <div className="bottom-indicators">
                {week}
            </div>
        </div>
    )
}
