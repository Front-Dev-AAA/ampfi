import './Task.css';
import { Task } from '../types';
import React from 'react';

interface TaskProps {
    task: Task;
    currentTask: any;
}

const OneTask: React.FC<TaskProps> = ({ task, currentTask }) => {
    const onClick = (e: any) => {
        currentTask(e.target.closest('tr').id);
    }

    const condition: { red: number, green: number, yellow: number } = {
        red: 0,
        green: 0,
        yellow: 0,
    }

    function statusDay(day: string) {
        if (day == '') {
            return 0;
        }
        let taskDay = task.day.split(".").map(Number);
        let deadlineDate = new Date(taskDay[2], taskDay[1] - 1, taskDay[0]);
        let nowDate = new Date();

        if (deadlineDate.getFullYear() === nowDate.getFullYear() && deadlineDate.getDate() === nowDate.getDate() && deadlineDate.getMonth() === nowDate.getMonth()) {
            condition.green = 1;
        }
        if (deadlineDate < nowDate) {
            condition.red = 1;
        }
        if (deadlineDate > nowDate) {
            condition.yellow = 1;
        }
        return 0;
    }
    statusDay(task.day);

    const idTr = task.id.toString();
    return (
        <tr className="btn-task" id={idTr} onClick={onClick}  >
            <td className="task">{task.id}</td>
            <td className="task"> {task.price}</td>
            <td className="task">{task.name}</td>
            <td className="task">{task.day}</td>
            <td className="task">
                <div>
                    <svg className={`icon ${condition.green && 'icon-green'} ${condition.red && 'icon-red'} ${condition.yellow && 'icon-yellow'}`} width="30" height="30" viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="49.9999" cy="50" r="49.5" transform="rotate(90 49.9999 50)" fill="white" stroke="none" />
                    </svg>
                
                </div>
              
                
            </td>
           
        </tr>
    )
}

export default OneTask;

