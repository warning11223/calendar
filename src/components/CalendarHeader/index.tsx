import type { FC } from "react";
import type {IReminderForToday} from "../Calendar";

type Props = {
    currentDate: Date;
    prevMonth: () => void;
    nextMonth: () => void;
    setCurrentDate: (date: Date) => void;
    setActiveDay: (day: Date) => void;
    getReminders: (reminders: IReminderForToday[]) => void;
    remindersForSelectedDay: IReminderForToday[];
};

export const CalendarHeader: FC<Props> = ({
                                              currentDate,
                                              prevMonth,
                                              nextMonth,
                                              setCurrentDate,
                                              setActiveDay,
                                              getReminders,
                                              remindersForSelectedDay
                                          }) => {
    const onClickToday = () => {
        const today = new Date();
        setCurrentDate(today);
        setActiveDay(today);
        getReminders(remindersForSelectedDay)
    }

    return (
        <div className="calendar__header">
            <h2>
                {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
            </h2>
            <img
                className="calendar__avatar"
                src="../../../src/assets/avatar.png"
                alt="avatar"
            />
            <div className="calendar__btns__wrapper">
                <button className="calendar__btn-prev" onClick={prevMonth} />
                <button className="calendar__btn-next" onClick={nextMonth} />
                <button className="calendar__btn-today" onClick={onClickToday}>
                    Сегодня
                </button>
            </div>
        </div>
    );
};
