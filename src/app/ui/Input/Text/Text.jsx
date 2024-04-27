import styles from './Text.module.css';

export default function Text(props) {
    return (
        <div className={styles.container}>
            <span>{props.header}</span>
            <input
                type={props.type != null ? props.type : "text"}
                name={props.name}
                value={props.value}
                className={styles.textInput}
                onChange={(e) => props.handleChange(e)}
                min={props.min}
                max={props.max}
                required>
            </input>
        </div>
    )
}