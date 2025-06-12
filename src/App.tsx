import './App.css';
import { useEffect, useState } from 'react';
import Calendar from "./components/Calendar";

export interface IReminder {
    reminder_ai_text: string;
    reminder_created_at: string;
    reminder_notify_minutes: number;
    reminder_on_datetime: string;
    reminder_text: string;
    user_notified: boolean;
}

interface IRemindersData {
    [key: string]: IReminder;
}

interface IServerResponse {
    reminders: IRemindersData;
    status: string;
    token: string;
}

function App() {
    const [reminders, setReminders] = useState<IReminder[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const userId = 749991690;
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjc0OTk5MTY5MCwiaWF0IjoxNzQ4MjYzODM0LCJleHAiOjE3Nzk3OTk4MzR9.bAYPe3BX0jnbH8kzS5STHcSwmR6kUiIQCXslT_v9aOo';

    useEffect(() => {
        fetch('https://bot-igor.ru/reminders', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                t_user_id: userId
            }),
        })
            .then(response => response.json())
            .then((data: IServerResponse) => {
                setReminders(Object.values(data.reminders));
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="App">
            {loading ? (
                <div className="loader" />
            ) : (
                <Calendar reminders={reminders} />
            )}
        </div>
    );
}

export default App;
