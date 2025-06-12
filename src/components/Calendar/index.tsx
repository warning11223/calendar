import {useEffect, useState} from 'react';
import '../../styles/Calendar.css';
import type {IReminder} from "../../App.tsx";
import {CalendarHeader} from "../CalendarHeader";
import {Tasks} from "../Tasks";
import {Week} from "../Week";

export type Day = {
    day: number;
    isCurrentMonth: boolean;
};

export interface IReminderForToday {
    day: number
    month: number
    reminderIcon: string
    reminderText: string
    reminderTime: string
    notifyMinutes: number
    reminder_on_datetime: string
    year: number
}

type Props = {
    reminders: IReminder[];
}

function Calendar({reminders: initialReminders}: Props) {
    const today = new Date();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [reminders, setReminders] = useState<IReminderForToday[]>([]);
    const [remindersForSelectedDay, setRemindersForSelectedDay] = useState<IReminderForToday[]>([]);
    const [hideOtherWeeks, setHideOtherWeeks] = useState(false);
    const [activeDay, setActiveDay] = useState(today);

    const getReminders = (parsedReminders: IReminderForToday[]) => {
        const remindersForToday = parsedReminders.filter(
            (reminder) => reminder.day === activeDay.getDate() && reminder.month === activeDay.getMonth() && reminder.year === activeDay.getFullYear()
        );

        setRemindersForSelectedDay(remindersForToday);
    }

    useEffect(() => {
        const parsedReminders: IReminderForToday[] = initialReminders.map(reminder => {
            const reminderDate = new Date(reminder.reminder_on_datetime);

            // Извлекаем время из даты
            const hours = reminderDate.getHours();
            const minutes = reminderDate.getMinutes();
            const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;

            return {
                day: reminderDate.getDate(),
                month: reminderDate.getMonth(),
                year: reminderDate.getFullYear(),
                reminderText: reminder.reminder_text,
                reminderIcon: reminder.reminder_ai_text,
                reminderTime: formattedTime,
                notifyMinutes: reminder.reminder_notify_minutes,
                reminder_on_datetime: reminder.reminder_on_datetime,
            };
        });

        setReminders(parsedReminders);
        getReminders(parsedReminders);
    }, [initialReminders, activeDay]);

    const nextMonth = () => {
        const nextMonth = new Date(currentDate);
        nextMonth.setMonth(currentDate.getMonth() + 1);
        setCurrentDate(nextMonth);

        // Обновляем активный день на первый день следующего месяца
        setActiveDay(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1));
    };

    // Функция для переключения на предыдущий месяц
    const prevMonth = () => {
        const prevMonth = new Date(currentDate);
        prevMonth.setMonth(currentDate.getMonth() - 1);
        setCurrentDate(prevMonth);

        // Обновляем активный день на первый день предыдущего месяца
        setActiveDay(new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1));
    };

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    // Определяем количество дней в текущем месяце
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Определяем сколько пустых ячеек нужно добавить в начало
    const firstDayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7;

    const prevMonthDays = new Date(year, month, 0).getDate();

    // Добавляем дни из предыдущего месяца
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        days.push({
            day: prevMonthDays - i,
            isCurrentMonth: false,
        });
    }

    // Добавляем дни текущего месяца
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({
            day: i,
            isCurrentMonth: true,
        });
    }

    // Определяем, сколько дней нужно добавить из следующего месяца
    const totalCells = days.length;
    const nextMonthDays = 7 - (totalCells % 7);

    // Добавляем дни из следующего месяца
    for (let i = 1; i <= nextMonthDays && totalCells + i <= 42; i++) {
        days.push({
            day: i,
            isCurrentMonth: false,
        });
    }

    // Разбиваем дни на недели для отображения в таблице
    const weeks = [];
    let week = [];
    for (let i = 0; i < days.length; i++) {
        week.push(days[i]);
        if (week.length === 7 || i === days.length - 1) {
            weeks.push(week);
            week = [];
        }
    }

    const onDayClick = (day: number, isCurrentMonth: boolean, direction: string) => {
        const selectedDate = new Date(year, month, day);

        // Если день из текущего месяца
        if (isCurrentMonth) {
            setActiveDay(selectedDate);
        } else {
            if (direction === "previous") {
                const newMonth = month - 1 < 0 ? 11 : month - 1;
                const newYear = newMonth === 11 ? year - 1 : year;
                setCurrentDate(new Date(newYear, newMonth, day));
                setActiveDay(selectedDate);
            } else if (direction === "next") {
                const newMonth = month + 1 > 11 ? 0 : month + 1;
                const newYear = newMonth === 0 ? year + 1 : year;
                setCurrentDate(new Date(newYear, newMonth, day));
                setActiveDay(selectedDate);
            }
        }

        // Фильтруем напоминания для выбранного дня
        const remindersForDay = reminders.filter(
            (reminder: IReminderForToday) =>
                reminder.day === day && reminder.month === month && reminder.year === year
        );

        setRemindersForSelectedDay(remindersForDay);
    };

    const handleHideButtonClick = () => {
        setHideOtherWeeks((prev) => !prev);
    };

    const isInCurrentWeek = (week: Day[]) => {
        return activeDay && week.some(day => day.day === activeDay.getDate() && day.isCurrentMonth)
    };

    return (
        <>
            <div className={`calendar ${hideOtherWeeks ? "hidden" : ""}`}>
                <CalendarHeader
                    currentDate={currentDate}
                    prevMonth={prevMonth}
                    nextMonth={nextMonth}
                    setCurrentDate={setCurrentDate}
                    setActiveDay={setActiveDay}
                    getReminders={getReminders}
                    remindersForSelectedDay={remindersForSelectedDay}
                />
                <table className="calendar__table">
                    <thead>
                    <tr>
                        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => (
                            <th key={index}>{day}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {weeks.map((week, index) => {
                        // Проверяем, нужно ли скрывать эту неделю
                        if (hideOtherWeeks && !isInCurrentWeek(week)) {
                            return null;
                        }

                        return (
                            <Week
                                key={index}
                                week={week}
                                month={month}
                                year={year}
                                activeDay={activeDay}
                                today={today}
                                reminders={reminders}
                                onDayClick={onDayClick}
                            />
                        )
                    })}
                    </tbody>
                </table>

                <div
                    onClick={handleHideButtonClick}
                    className={hideOtherWeeks ? "hide__button-down" : "hide__button-up"}
                />
            </div>

            <Tasks
                activeDay={activeDay}
                remindersForSelectedDay={remindersForSelectedDay}
            />
        </>
    );
}

export default Calendar;
