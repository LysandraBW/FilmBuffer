import styles from './Form.module.css';
import Button from '../Input/Button/Button';

export default function Form(props) {
    return (
        <form onSubmit={props.handleSubmit} className={styles.container}>
            <h1>{props.header}</h1>
            <div className={styles.inputGroups}>
                {props.groups != null &&
                    props.groups.map((group, groupIndex) => (
                        <div className={styles.inputGroup} key={(groupIndex + 1) * 20}>
                            {group.map((input, inputIndex) => (
                                <div key={(inputIndex + 1) * 3}>{input}</div>
                            ))}
                        </div>
                    ))
                }
            </div>
            <div className={styles.inputGroup}>
                <Button onClick={props.handleSubmit} label={props.button}/>
            </div>
        </form>
    )
}