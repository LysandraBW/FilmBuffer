import styles from './Button.module.css';

export default function Button(props) {
    return (
        <button
            type="submit"
            className={styles.button}
        >
            {props.label}
        </button>
    )
}