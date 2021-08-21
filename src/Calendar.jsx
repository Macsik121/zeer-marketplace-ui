import React from 'react';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

function generateDayOfWeek(
    year = new Date().getFullYear(),
    month = new Date().getMonth()
) {
    return (
        new Date(`${year}-${month}-1`).getDay()
    )
}

function generateDays(
    year = new Date().getFullYear(),
    month = new Date().getMonth()
) {
    month++;
    return (
        [...new Array(
                new Date(
                    year,
                    month,
                    0
                ).getDate()
            ).keys()
        ]
    );
}

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
            daysOfCurrentMonth: generateDays(),
            activeMonth: new Date().getMonth(),
            activeYear: new Date().getFullYear(),
            activeDay: new Date().getDate(),
            activeDate: new Date(),
            chooseYearShown: false,
            chooseDateShown: true,
            currentDayOfWeek: generateDayOfWeek()
        };
        this.switchNextMonth = this.switchNextMonth.bind(this);
        this.switchPrevMonth = this.switchPrevMonth.bind(this);
        this.showChooseYear = this.showChooseYear.bind(this);
        this.hideChooseYear = this.hideChooseYear.bind(this);
        this.toggleChooseYear = this.toggleChooseYear.bind(this);
        this.showChooseDate = this.showChooseDate.bind(this);
        this.chooseYear = this.chooseYear.bind(this);
        this.chooseDay = this.chooseDay.bind(this);
    }
    switchNextMonth() {
        let { currentMonth, currentYear, currentDay } = this.state;
        let month = currentMonth;
        month++;
        let newDate = new Date(`${currentYear}-${currentMonth}-${currentDay}`);
        if (month < 12) {
            this.setState({
                currentMonth,
                currentDate: newDate,
                daysOfCurrentMonth: generateDays(currentYear, currentMonth),
                currentDayOfWeek: new Date(`${currentYear}-${currentMonth}-${currentDay}`).getDay()
            });
        } else {
            newDate = new Date(`${currentYear}-01-01`)
            this.setState({
                currentMonth: 0,
                currentYear: ++currentYear,
                currentDate: newDate,
                daysOfCurrentMonth: generateDays(currentYear, 1),
                activeYear: currentYear
            });
        }
        console.log(new Date(`${currentYear}-${currentMonth}-${currentDay}`).toLocaleDateString())
    }
    switchPrevMonth() {
        let { currentMonth, currentYear, currentDay } = this.state;
        currentMonth--;
        if (currentMonth < 0) {
            this.setState({
                currentMonth: 11,
                currentYear: --currentYear,
                daysOfCurrentMonth: generateDays(--currentYear, 11),
            });
        } else {
            this.setState({
                currentMonth,
                daysOfCurrentMonth: generateDays(currentYear, currentMonth),
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
    chooseDay(e) {
        let { currentYear, currentMonth } = this.state;
        const date = `${currentYear}-${--currentMonth}-${e.target.textContent}`;
        this.setState({
            currentDay: e.target.textContent,
            activeDay: e.target.textContent,
            currentMonth: new Date(date).getMonth(),
            currentDayOfWeek: new Date(date).getDay()
        });
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
            daysOfCurrentMonth,
            currentDayOfWeek
        } = this.state;

        const {
            calendarShown
        } = this.props;

        const days = daysOfCurrentMonth.map(day => {
            return (
                <div
                    key={day}
                    className={`
                        day
                        ${++day == activeDay && activeMonth == currentMonth
                            && 'active-day'
                        }`
                    }
                    onClick={this.chooseDay}
                >
                    {day}
                </div>
            )
        });

        let skipTimes = currentDayOfWeek;
        skipTimes++;
        for(
            let i = 0;
            i <= skipTimes;
            i++
        ) {
            days.unshift(
                <div key={++days.length} className="day empty-day">{i}</div>
            );
        }

        currentDayOfWeek--;

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
                            const years = [
                                2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030,
                                2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040,
                                2041, 2042, 2043, 2044, 2045, 2046, 2047, 2048, 2049, 2050,
                                2051, 2052, 2053, 2054, 2055, 2056, 2057, 2058, 2059, 2060,
                                2061, 2062, 2063, 2064, 2065, 2066, 2067, 2068, 2069, 2070,
                                2071, 2072, 2073, 2074, 2075, 2076, 2077, 2078, 2079, 2080
                            ];
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
                                {days}
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
