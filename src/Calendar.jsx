import React from 'react';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

export default class ChooseDateCalendar extends React.Component {
    constructor() {
        super();
        this.state = {
            months: [
                "Январь", "Февраль",
                "Март", "Апрель", "Май",
                "Июнь", "Июль", "Август",
                "Сентябрь", "Октябрь", "Ноябрь",
                "Декабрь"
            ],
            daysOfWeek: [
                "Понедельник", "Вторник",
                "Среда", "Четверг",
                "Пятница", "Суббота",
                "Воскресенье"
            ],
            currentDay: new Date().getDate(),
            currentMonth: new Date().getMonth(),
            currentYear: new Date().getFullYear(),
            currentDate: new Date(),
            daysOfCurrentMonth: (
                [...new Array(
                        new Date(
                            new Date().getFullYear(),
                            new Date().getMonth(),
                            0
                        ).getDate()
                    ).keys()
                ]
            ),
            activeMonth: new Date().getMonth(),
            activeYear: new Date().getFullYear(),
            activeDay: new Date().getDate(),
            activeDate: new Date(),
            chooseYearShown: false,
            chooseDateShown: true
        };
        this.switchNextMonth = this.switchNextMonth.bind(this);
        this.switchPrevMonth = this.switchPrevMonth.bind(this);
        this.showChooseYear = this.showChooseYear.bind(this);
        this.hideChooseYear = this.hideChooseYear.bind(this);
        this.toggleChooseYear = this.toggleChooseYear.bind(this);
        this.showChooseDate = this.showChooseDate.bind(this);
        this.chooseYear = this.chooseYear.bind(this);
    }
    switchNextMonth() {
        let { currentMonth, currentYear, currentDay } = this.state;
        currentMonth++;
        let newDate = new Date(`${currentYear}-${++this.state.currentMonth}-${currentDay}`);
        if (currentMonth < 12) {
            this.setState({
                currentMonth,
                currentDate: newDate
            });
        } else {
            newDate = new Date(`${currentYear}-01-01`)
            this.setState({
                currentMonth: 0,
                currentYear: ++currentYear,
                currentDate: newDate
            });
        }
    }
    switchPrevMonth() {
        let { currentMonth, currentYear, currentDay } = this.state;
        currentMonth--;
        if (currentMonth < 0) {
            this.setState({
                currentMonth: 11,
                currentYear: --currentYear
            });
        } else {
            this.setState({
                currentMonth
            });
        }
    }
    showChooseYear() {
        this.setState({ chooseYearShown: true });
    }
    hideChooseYear() {
        this.setState({ chooseYearShown: false });
    }
    toggleChooseYear() {
        this.setState({
            chooseYearShown: !this.state.chooseYearShown,
            chooseDateShown: !this.state.chooseDateShown
        });
    }
    showChooseDate() {
        this.setState({ chooseYearShown: false, chooseDateShown: true });
    }
    chooseYear(e) {
        this.setState({
            currentYear: +e.target.textContent,
            activeYear: +e.target.textContent
        });
        this.toggleChooseYear();
    }
    render() {
        let {
            currentMonth,
            months,
            currentDate,
            currentYear,
            currentDay,
            daysOfWeek,
            activeMonth,
            activeYear,
            activeDay,
            activeDate,
            chooseYearShown,
            chooseDateShown,
            daysOfCurrentMonth
        } = this.state;

        const {
            calendarShown
        } = this.props;

        let currentDayOfWeek = activeDate.getDay();
        currentDayOfWeek--;

        const days = daysOfCurrentMonth.map(day => {
            return (
                <div key={day} className="day">
                    {++day}
                </div>
            )
        });

        return (
            <div
                className="calendar"
                style={this.props.style}
            >
                <div className="current-date">
                    <div className="year">
                        <label
                            onClick={this.toggleChooseYear}
                            className="active-year"
                            style={
                                {
                                    color: chooseYearShown ? '#fff' : 'rgba(255, 255, 255, .6)'
                                }
                            }
                        >
                            {activeYear}
                        </label>
                    </div>
                    <div
                        className="day"
                        style={
                            {
                                color: chooseDateShown ? '#fff' : 'rgba(255, 255, 255, .6)'
                            }
                        }
                        onClick={this.showChooseDate}
                    >
                        <span className="day-of-week">
                            {daysOfWeek[currentDayOfWeek]}
                        </span>,&nbsp;
                        <div className="today-date">
                            {currentDay}&nbsp;{months[activeMonth]}
                        </div>
                    </div>
                </div>
                <div className="choose-date-body">
                    <div
                        className="year"
                        style={
                            {
                                opacity: chooseYearShown && calendarShown ? 1 : 0,
                                pointerEvents: chooseYearShown && calendarShown ? 'all' : 'none'
                            }
                        }
                    >
                        {function() {
                            const years = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
                            return years.map(year => {
                                if (year == activeYear) {
                                    return (
                                        <span
                                            className="choose-year active-year"
                                            key={year}
                                            onClick={this.chooseYear}
                                        >
                                            {year}
                                        </span>
                                    )
                                }
                                return (
                                    <span
                                        className="choose-year"
                                        key={year}
                                        onClick={this.chooseYear}
                                    >
                                        {year}
                                    </span>
                                )
                            });
                        }.bind(this)()}
                    </div>
                    <div
                        className="days-date"
                        style={
                            {
                                opacity: chooseDateShown && calendarShown ? 1 : 0,
                                pointerEvents: chooseDateShown && calendarShown ? 'all' : 'none'
                            }
                        }
                    >
                        <div className="heading">
                            <ArrowBackIosIcon
                                className="previous switch-month"
                                onClick={this.switchPrevMonth}
                            />
                            <div className="date">
                                <div className="current-month">{months[currentMonth]}</div>
                                &nbsp;
                                <div className="current-date">
                                    {currentYear}&nbsp;г.
                                </div>
                            </div>
                            <ArrowForwardIosIcon
                                className="next switch-month"
                                onClick={this.switchNextMonth}
                            />
                        </div>
                        <div className="table">
                            <div className="table-head">
                                <div className="day-of-week monday">Пн</div>
                                <div className="day-of-week tuesday">Вт</div>
                                <div className="day-of-week wednesday">Ср</div>
                                <div className="day-of-week thursday">Чт</div>
                                <div className="day-of-week friday">Пт</div>
                                <div className="day-of-week saturday">Сб</div>
                                <div className="day-of-week sunday">Вс</div>
                            </div>
                            <div className="table-body">

                            </div>
                        </div>
                    </div>
                </div>
                <div className="buttons">
                    <button
                        className="set-date button"
                        onClick={() => {
                            const date = `${currentYear}-${++currentMonth}-${currentDay}`;
                            this.props.setExpirationDate(date);
                        }}
                    >
                        установить
                    </button>
                    <button
                        className="cancel button"
                        onClick={() => {
                            this.setState({
                                chooseYearShown: false,
                                chooseDateShown: false
                            });
                            this.props.hideCalendar();
                        }}
                    >
                        отмена
                    </button>
                </div>
            </div>
        )
    }
}
