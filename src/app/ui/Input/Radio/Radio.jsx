
import styles from './Radio.module.css';

export default function Radio(props) {
    return (
        <div className={styles.container}>
            {/* Optional Header for Radio Button Elements */}
            {props.header != null && <span>{props.header}</span>}

            {/* Generating Checkbox Input Elements */}
            <div>
                {props.options != null &&
                    props.options.map((option) => (
                        <label key={option[0]} htmlFor={option[0]}>
                            <input
                                type="radio"
                                id={option[0]}
                                key={option[0]}
                                name={option[0]}
                                value={option[0]}
                                onChange={(e) => props.handleChange(e)}>
                            </input>
                            {option[1]}
                        </label>
                    ))    
                }
            </div>
        </div>
    )
}