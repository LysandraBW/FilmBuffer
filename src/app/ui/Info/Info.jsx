import styles from './Info.module.css';

export default function Info(props) {
    return (
        <div className={styles.container}>
            <h1>Trends</h1>
            <div className={styles.grid}>
                <div className={styles.chartKey}>
                    {props.chart}
                    {props.keys}
                </div>
                <div>
                    {props.card}
                </div>
            </div>
        </div>
    )
}