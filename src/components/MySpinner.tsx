import c2 from './MySpinner.module.css';
export interface Spinner {
    visible: boolean;
   
}
const MySpinner = ({visible }: Spinner) => {
    const rootClasses = [c2.mySpinner];
    if (visible) {
        rootClasses.push(c2.active);
    }
    return (
            <div className={rootClasses.join(' ')}>
                <div  className={c2.spinner}></div>
            </div>

    )
}
export default MySpinner;