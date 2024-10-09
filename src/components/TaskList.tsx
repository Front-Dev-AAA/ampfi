import axios from 'axios';
// Просто добавьте к любому URL префикс http(s)://thingproxy.freeboard.io/fetch/
// Например:
// https://thingproxy.freeboard.io/fetch/http://my.api.com/get/stuff
// ThingProxy позволяет коду JavaScript на вашем сайте получать доступ к ресурсам на других доменах, 
// которые обычно блокируются из-за политики одного источника. 
// Он действует как прокси-сервер между вашим браузером и удаленным сервером и добавляет в ответ соответствующие заголовки CORS.
const proxy = "https://thingproxy.freeboard.io/fetch/";
const accessToken = "eyW0wgPJd7cwmrWDB0WRR8FUqNxfykV4Q_7ex10hpdqtAGl11I7MFQ2e3q5XOQl5WAjAZ4L92Wt8xZaPuAFYOavEgAvVpy59M06IjeQuEy-gaIH_p62eEPlamI0dPVoPD2KhBQAejQ";

import './TaskList.css';
import React, { useEffect, useState } from 'react';
import { Task } from '../types';
import OneTask from './Task';
import MyModal from './MyModal';
import MyCard from './MyCard';

import { createContext } from "react";
import MySpinner from './MySpinner';
export const MyContext = createContext({});
// Сортировка результатов списка.
// Доступные поля для сортировки: created_at, updated_at, id.
// Доступные значения для сортировки: asc, desc.
// Пример: /api/v4/leads?order[updated_at]=asc

function deadlineDate(date: Date) {
    const month = date.toLocaleString("ru-RU", { month: "2-digit" });
    const year = date.getFullYear();
    const day = date.toLocaleString("ru-RU", { day: "2-digit" });
    return (
        day + '.' + month + '.' + year
    );
}


const TaskList: React.FC = () => {
    // сделки - состояние
    const [tasks, setTasks] = useState<Task[]>([]);
    // модалка - состояние
    const [modal, setModal] = useState(false);
    // состояние для контекста и передачи данных сделки в мою карту 
    const [data, setData] = useState({});
    //   состояние для получение списка сделок по 3 шт раз в секунду -записываем последний id
    const [createdAt, setcreatedAt] = useState(0);
    // состояние для спинера
    const [spinner, setSpinner] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            axios.get(`${proxy}https://aaa13yandexru.amocrm.ru/api/v4/leads?order[created_at]=asc&limit=3&filter[created_at][from]=${createdAt + 1}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            })
                .then((response) => {
                    if (response.data != '') {
                        if (response.data._embedded.leads[2] != undefined) {
                            setcreatedAt(response.data._embedded.leads[2].created_at);
                        }
                        const listJob3: any = response.data._embedded.leads;
                        for (let index = 0; index < listJob3.length; index++) {
                            listJob3[index].day = '';

                        }
                        setTasks((prevlistJob) => {
                            return [...prevlistJob, ...listJob3];
                        });
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }, 1000)
    }, [createdAt]);

    const currentTaskHandler = (current: string) => {

        let idTr = parseInt(current);
        setSpinner(true);

        axios.get(`${proxy}https://aaa13yandexru.amocrm.ru/api/v4/leads/${idTr}`, { headers: { 'Authorization': `Bearer ${accessToken}` } })
            .then(response => {

                // для модалки данные
                setData(response.data);
                // открываем модалку
                setModal(true);
                // дата и иконка ближайшей задачи
                const obj: any = tasks.find(item => item.id === idTr);
                obj.day = deadlineDate(new Date(response.data.closest_task_at * 1000));
            })
            .finally(() => setSpinner(false))
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <>
            <h1 className="title-list">Тестовое задание - амоМаркет</h1>
            <MySpinner visible={spinner} />
            <hr />
            <table className="table table-success container">
                <thead>
                    <tr>
                        <th className="column-name" >Идентификатор</th>
                        <th className="column-name" >Бюджет </th>
                        <th className="column-name">Название</th>
                        <th className="column-name">Дата</th>
                        <th className="column-name">Статус</th>
                    </tr>

                </thead>
                <tbody >
                    {tasks.map((task) => <OneTask task={task} key={task.id} currentTask={currentTaskHandler} />)}
                </tbody>
            </table >
            <MyContext.Provider value={data}>
                <MyModal visible={modal} setVisible={setModal}> <MyCard /> </MyModal>
            </MyContext.Provider>
        </>
    )
}
export default TaskList;

