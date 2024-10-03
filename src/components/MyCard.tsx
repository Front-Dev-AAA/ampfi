import './MyCard.css';
import { useContext } from "react";
import { MyContext } from "./TaskList";

const MyCard = () => {
    const context: any = useContext(MyContext);
    const result = Object.keys(context).map((key) => [`${key}:  ${context[key]}`]);
    const listItems = result.map((number) =>
        <li key={number.toString()} className="card__item">
            {number}
        </li>
    );

    return (
        <>
            <h2 className="card__title">Выделенная карточка</h2>
            <ul className="card__list list-reset">{listItems}</ul>
        </>
    )
}


export default MyCard;