import type { FC } from "react";
import type {IReminderForToday} from "../Calendar";

const monthNamesInGenitive = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря"
];

type Props = {
    activeDay: Date;
    remindersForSelectedDay: IReminderForToday[];
};

export const Tasks: FC<Props> = ({ remindersForSelectedDay, activeDay }) => {
    const isEventSoon = (reminderTime: string): boolean => {
        const now = new Date();
        const eventTime = new Date(reminderTime);
        const timeDiff = eventTime.getTime() - now.getTime();
        const diffInMinutes = Math.floor(timeDiff / (1000 * 60));

        return diffInMinutes <= 30 && diffInMinutes > 0;
    };

    return (
        <div className="tasks">
            <p className="tasks__title">
                {new Date(activeDay).getDate()} {monthNamesInGenitive[new Date(activeDay).getMonth()]}
            </p>

            <ul className="tasks__list">
                {remindersForSelectedDay.length > 0 ? (
                    <>
                        {remindersForSelectedDay.map((reminder, index) => (
                            <li className="list__item" key={index}>
                                {isEventSoon(reminder.reminder_on_datetime) && (
                                    <span className="item__reminder">
                                        Скоро начнется: {reminder.reminderTime}
                                    </span>
                                )}
                                <div className="item__wrapper">
                                    <span className="item__icon"> {reminder.reminderText}</span>
                                    <span className="item__time">{reminder.reminderTime}</span>
                                </div>
                            </li>
                        ))}
                    </>
                ) : (
                    <li>Сегодня событий нет</li>
                )}
            </ul>
        </div>
    );
};
