import React from 'react';

export default function BoughtPeople({ people, renderPeopleLimit = 3 }) {
    let renderedPeople = [];
    if (people) {
        for(let i = 0; i < people.length; i++) {
            if (i < renderPeopleLimit) {
                const person = people[i];
                let userAvatar = {};
                if (person.avatar.includes('#')) {
                    userAvatar.background = `${person.avatar}`;
                } else {
                    userAvatar.background = `url("${person.avatar}") center/cover no-repeat`;
                }
                const style = {
                    background: userAvatar.background
                }
                if (i != 0) {
                    style.marginLeft = '-5px';
                }
                renderedPeople.push(
                    <div
                        style={style}
                        key={person.name}
                        className="person-bought"
                    >
                        {person.avatar.includes('#') &&
                            <span className="first-two-char">{person.name.substring(0, 2)}</span>
                        }
                    </div>
                );
            } else {
                break;
            }
        }
    }
    return (
        <div className="bought-people">
            {people && people.length < 1
                ? (
                    <label style={{ margin: 0 }} className="nobody-bought">Этот товар ещё никто не купил</label>
                )
                : (
                    <div className="bought-people-wrap">
                        <div className="people">
                            {renderedPeople}
                        </div>
                        <label className="bought-amount">
                            +{people && people.length}
                            <span>Уже преобрели этот продукт</span>
                        </label>
                    </div>
                )
            }
        </div>
    )
}
