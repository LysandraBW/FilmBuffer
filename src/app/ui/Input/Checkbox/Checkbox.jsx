
import styles from './Checkbox.module.css';

export default function Checkbox(props) {
    return (
        <div>
            {/* Optional Header for Checkbox Elements */}
            {props.header != null && <span>{props.header}</span>}

            {/* Generating Checkbox Input Elements */}
            <div className={styles.checkboxContainer}>
                {props.options != null &&
                    props.options.map((option) => (
                        <label key={option[0]} htmlFor={option[0]}>
                            <input
                                type="checkbox"
                                id={option[0]}
                                key={option[0]}
                                name={props.name}
                                value={option[0]}
                                onChange={(e) => props.handleChange(e)}
                                className={styles.checkbox}>    
                            </input>
                            <span className={styles.customCheckbox}></span>
                            <span className={styles.checkboxLabel}>{option[1]}</span>
                        </label>
                    ))    
                }
            </div>
        </div>
    )
}