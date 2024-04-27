import styles from './Key.module.css';

export function Key(props) {
    return (
        <div className={styles.container}>
            <h5>Key</h5>
            <div className={styles.keyContainer}>
                {props.keys != null &&
                    props.keys.map((key) => (
                        <div className={styles.keyLabel} key={key[0]}>
                            <span style={{backgroundColor: key[1]}}></span>
                            <label>{key[0]}</label>
                        </div>
                    ))    
                }
                {props.keys == null &&
                    <p>Keys will show here once you've created a trend.</p>}
            </div>
        </div>
    )
}

export function toKeys(datasets) {
    if (datasets == null || Object.entries(datasets).length == 0)
        return;
    return datasets.map((dataset) => ([dataset.name, dataset.color]));
}