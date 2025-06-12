import type { FC } from "react";
import type {Day, IReminderForToday} from "../Calendar";

type Props = {
    week: Day[];
    month: number;
    year: number;
    activeDay: Date;
    today: Date;
    reminders: IReminderForToday[];
    onDayClick: (day: number, isCurrentMonth: boolean, direction: string) => void;
};

export const Week: FC<Props> = ({ week, month, year, activeDay, today, reminders, onDayClick }) => {
    const todayDay = today.getDate();

    const getRemindersForDay = (day: number, month: number, year: number) => {
        return reminders.filter(
            (reminder: IReminderForToday) =>
                reminder.day === day && reminder.month === month && reminder.year === year
        );
    };

    return (
        <tr>
            {week.map((day, i) => {
                const remindersForDay = getRemindersForDay(day.day, month, year);

                return (
                    <td
                        key={i}
                        className={`month ${day.isCurrentMonth ? "curr__month" : ""}`}
                    >
                        <div
                            className={`
                                calendar__day 
                                ${activeDay.getDate() === day.day && day.isCurrentMonth && year === activeDay.getFullYear() ? 'active' : ''}
                            `}
                            onClick={() => {
                                onDayClick(
                                    day.day,
                                    day.isCurrentMonth,
                                    day.isCurrentMonth ? 'current' : (day.day < todayDay ? 'next' : 'previous')
                                );
                            }}
                        >
                            {day.day}
                            {remindersForDay.length > 0 && activeDay.getDate() !== day.day && day.isCurrentMonth && (
                                <div className={`task__indicator task__indicator--${remindersForDay.length}`} />
                            )}
                        </div>
                    </td>
                );
            })}
        </tr>
    );
};
