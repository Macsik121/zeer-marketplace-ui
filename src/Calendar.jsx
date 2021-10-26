import React from 'react';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

function generateDayOfWeek(
    year = new Date().getFullYear(),
    month = new Date().getMonth() + 1,
    day = new Date().getDay()
) {
    return (
        new Date(`${year}-${month}-${day}`).getDay()
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

export default class Calendar extends React.Component {
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
                "Воскресенье",
                "Понедельник", "Вторник",
                "Среда", "Четверг",
                "Пятница", "Суббота"
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
            currentDayOfWeek: new Date().getDay(),
            currentHour: new Date().getHours(),
            activeHour: new Date().getHours(),
            currentMinutes: new Date().getMinutes(),
            activeMinutes: new Date().getMinutes(),
            chooseHoursMinsShown: false
        };
        this.switchNextMonth = this.switchNextMonth.bind(this);
        this.switchPrevMonth = this.switchPrevMonth.bind(this);
        this.showChooseYear = this.showChooseYear.bind(this);
        this.hideChooseYear = this.hideChooseYear.bind(this);
        this.toggleChooseYear = this.toggleChooseYear.bind(this);
        this.showChooseDate = this.showChooseDate.bind(this);
        this.chooseYear = this.chooseYear.bind(this);
        this.chooseDay = this.chooseDay.bind(this);
        this.incHour = this.incHour.bind(this);
        this.incMin = this.incMin.bind(this);
        this.decrHour = this.decrHour.bind(this);
        this.decrMin = this.decrMin.bind(this);
    }
    componentDidUpdate() {
        if (!this.state.chooseYearShown &&
            !this.state.chooseDateShown &&
            !this.state.chooseHoursMinsShown
        ) {
            this.setState({ chooseDateShown: true });
        }
    }
    componentDidMount() {
        window.onkeydown = function(e) {
            if (e.keyCode == 27) {
                this.props.hideCalendar();
            }
        }.bind(this);
    }
    switchNextMonth() {
        let { currentMonth, currentYear, currentDay } = this.state;
        currentMonth++;
        let newDate = new Date(`${currentYear}-${this.state.currentMonth}-${currentDay}`);
        if (currentMonth < 12) {
            this.setState({
                currentMonth,
                currentDate: newDate,
                daysOfCurrentMonth: generateDays(currentYear, currentMonth)
            });
        } else {
            newDate = new Date(`${currentYear}-01-01`)
            this.setState({
                currentMonth: 0,
                currentYear: currentYear + 1,
                currentDate: newDate,
                daysOfCurrentMonth: generateDays(currentYear, 1),
                activeYear: currentYear + 1
            });
        }
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
        this.setState({
            chooseYearShown: true,
            chooseDateShown: false,
            chooseHoursMinsShown: false
        });
    }
    hideChooseYear() {
        this.setState({ chooseYearShown: false });
    }
    toggleChooseYear() {
        this.setState({
            chooseYearShown: !this.state.chooseYearShown,
            chooseDateShown: !this.state.chooseDateShown,
            chooseHoursMinsShown: false
        });
    }
    showChooseDate() {
        this.setState({
            chooseYearShown: false,
            chooseDateShown: true,
            chooseHoursMinsShown: false
        });
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
        const date = `${currentYear}-${currentMonth + 1}-${e.target.textContent}`;
        this.setState({
            currentDay: e.target.textContent,
            activeDay: e.target.textContent,
            currentMonth: new Date(date).getMonth(),
            activeMonth: new Date(date).getMonth(),
            currentDayOfWeek: new Date(date).getDay()
        });
    }
    incHour(e) {
        let hour = +e.target.parentNode.childNodes[1].textContent;
        hour++;
        if (hour > 23) {
            this.setState({ activeHour: 0 });
        } else {
            this.setState({ activeHour: hour });
        }
    }
    decrHour(e) {
        let hour = +e.target.parentNode.childNodes[1].textContent;
        hour--;
        if (hour < 0) {
            this.setState({ activeHour: 23 });
        } else {
            this.setState({ activeHour: hour });
        }
    }
    incMin(e) {
        let min = +e.target.parentNode.childNodes[1].textContent;
        min++;
        if (min > 59) {
            this.setState({ activeMinutes: 0 });
        } else {
            this.setState({ activeMinutes: min });
        }
    }
    decrMin(e) {
        let min = +e.target.parentNode.childNodes[1].textContent;
        min--;
        if (min < 0) {
            this.setState({ activeMinutes: 59 });
        } else {
            this.setState({ activeMinutes: min });
        }
    }
    render() {
        let {
            currentMonth,
            months,
            currentYear,
            currentDay,
            daysOfWeek,
            activeMonth,
            activeYear,
            activeDay,
            chooseYearShown,
            chooseDateShown,
            daysOfCurrentMonth,
            currentDayOfWeek,
            activeHour,
            currentHour,
            activeMinutes,
            currentMinutes,
            chooseHoursMinsShown
        } = this.state;

        const {
            calendarShown,
            hideCalendar,
            setDate
        } = this.props;
        const style = this.props.style || (
            {
                pointerEvents: calendarShown ? 'all' : 'none',
                opacity: calendarShown ? 1 : 0
            }
        )

        const days = daysOfCurrentMonth.map(day => {
            return (
                <div
                    key={day}
                    className={`
                        day
                        ${day + 1 == activeDay && activeMonth == currentMonth
                            && 'active-day'
                        }`
                    }
                    onClick={this.chooseDay}
                >
                    {day + 1}
                </div>
            )
        });

        const skipDays = [];
        const skipDaysDate = (
            new Date(`${
                currentYear
            }-${
                currentMonth + 1
            }-01`)
        );
        let skipDay = skipDaysDate.getDay();

        if (skipDay == 0) skipDay = 7;
        for(
            let i = 0;
            i < skipDay;
            i++
        ) {
            skipDays.push(
                <div key={i} className="day day-hidden">
                    {i}
                </div>
            );
        }
        skipDays.pop();

        return (
            <div
                className="calendar"
                style={style}
            >
                <div className="current-date">
                    <div className="year">
                        <label
                            onClick={this.showChooseYear}
                            className="active-year"
                            style={
                                {
                                    color: chooseYearShown ? '#fff' : 'rgba(255, 255, 255, .6)'
                                }
                            }
                        >
                            {activeYear}
                        </label>,&nbsp;
                        <div
                            className="hours-minutes"
                            onClick={() => this.setState({
                                chooseHoursMinsShown: !chooseHoursMinsShown,
                                chooseDateShown: false,
                                chooseYearShown: false
                            })}
                            style={
                                {
                                    color: chooseHoursMinsShown ? '#fff' : 'rgba(255, 255, 255, .6)'
                                }
                            }
                        >
                            {activeHour.toString().length == 1 ? '0' + activeHour : activeHour}
                            :
                            {activeMinutes.toString().length == 1 ? '0' + activeMinutes : activeMinutes}
                        </div>
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
                                2071, 2072, 2073, 2074, 2075, 2076, 2077, 2078, 2079, 2080,
                                2081, 2082, 2083, 2084, 2085, 2086, 2087, 2088, 2089, 2090,
                                2091, 2092, 2093, 2094, 2095, 2096, 2097, 2098, 2099, 2100,
                                2101, 2102, 2103, 2104, 2105, 2106, 2107, 2108, 2109, 2110
                            ];
                            return years.map(year => {
                                return (
                                    <span
                                        className={`choose-year ${year == activeYear ? 'active-year' : ''}`}
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
                                {skipDays}
                                {days}
                            </div>
                        </div>
                    </div>
                    <div
                        className="hours-mins-choosing"
                        style={
                            {
                                opacity: calendarShown && chooseHoursMinsShown ? 1 : 0,
                                pointerEvents: calendarShown && chooseHoursMinsShown ? 'all' : 'none'
                            }
                        }
                    >
                        <div className="active-hours active-time">
                            <ArrowBackIosIcon
                                className="add-hour arrow"
                                onClick={this.incHour}
                            />
                            <div className="hours">
                                {activeHour.toString().length == 1 ? '0' + activeHour : activeHour}
                            </div>
                            <ArrowBackIosIcon
                                className="minus-hour arrow back"
                                onClick={this.decrHour}
                            />
                        </div>
                        :
                        <div className="active-minutes active-time">
                            <ArrowBackIosIcon
                                className="add-mins arrow"
                                onClick={this.incMin}
                            />
                            <div className="mins">
                                {activeMinutes.toString().length == 1 ? '0' + activeMinutes : activeMinutes}
                            </div>
                            <ArrowBackIosIcon
                                className="minus-mins arrow back"
                                onClick={this.decrMin}
                            />
                        </div>
                    </div>
                </div>
                <div className="buttons">
                    <button
                        className="set-date button"
                        onClick={() => {
                            const date = new Date(currentYear, ++currentMonth, currentDay, activeHour, activeMinutes);
                            setDate(date);
                            const currentDate = new Date();
                            const day = currentDate.getDate();
                            const dayOfWeek = currentDate.getDay();
                            const month = currentDate.getMonth();
                            const year = currentDate.getFullYear();
                            this.setState({
                                currentDay: day,
                                currentDayOfWeek: dayOfWeek,
                                currentMonth: month,
                                currentYear: year,
                                activeDay: day,
                                activeMonth: month,
                                activeYear: year,
                                activeDate: new Date()
                            });
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
                            hideCalendar();
                        }}
                    >
                        отмена
                    </button>
                </div>
            </div>
        )
    }
}
