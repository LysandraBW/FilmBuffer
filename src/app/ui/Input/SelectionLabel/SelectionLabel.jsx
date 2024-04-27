import styles from './SelectionLabel.module.css';
import Cross from '../../Icon/Cross';

export default function SelectionLabel(props) {
    return (
        <div className={styles.selectionLabel}>
            <label>{props.label}</label>
            <Cross></Cross>
        </div>
    )
}