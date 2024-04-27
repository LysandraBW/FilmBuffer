import DownArrow from "../../Icon/DownArrow";
import styles from './Select.module.css';

export default function Select(props) {
    return (
        <div className={styles.container}>
            <select
                name={props.name}
                defaultValue={'NA'} 
                className={styles.select}
                onChange={(e) => props.handleChange(e)}
                required
            >
                {props.header != null && <option value="NA" disabled>{props.header}</option>}
                
                {props.options != null &&
                    props.options.map((option) => (
                        <option key={option[0]} value={option[0]}>{option[1]}</option>
                    ))
                }
            </select>
            <span className={styles.customDropdown}>
                <DownArrow></DownArrow>
            </span>
        </div>
    )
}