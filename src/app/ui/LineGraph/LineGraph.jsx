import Chart from 'chart.js/auto';
import { useState, useEffect } from 'react';
import styles from './LineGraph.module.css';

export default function LineGraph(props) {
    const [chart, setChart] = useState(null);

    const handleClick = (click) => {
        const points = chart.getElementsAtEventForMode(click, 'nearest', {
            intersect: true
        }, true);

        let clickedLabel = "";
        let clickedPoint = "";

        if (points[0]) {
            points.forEach((line) => {
                const dataset = line.datasetIndex;
                const datapoint = line.index;
                clickedPoint = datapoint;
                clickedLabel = chart.data.datasets[dataset].label;
            })
        }

        props.handleClick(clickedLabel, clickedPoint);
    };
    
    useEffect(() => {
        if (chart != null && chart.ctx != null) {
            chart.clear();
            chart.destroy();
            setChart(null);
        }

        let chartStatus = Chart.getChart(props.id);
        if (chartStatus != undefined) {
            chartStatus.destroy();
        }

        const ctx = document.getElementById(props.id);
        if (ctx == null) {
            return;
        }

        let xDataset;
        let yDatasets;        
        if (props.data == null || Object.entries(props.data).length == 0) {
            xDataset = [...Array(10).keys()];
            yDatasets = [];
        }
        else {
            xDataset = props.data.x_points;
            yDatasets = props.data.trends.map((dataset) => ({
                            label: dataset.name,
                            borderColor: dataset.color,
                            data: dataset.yPoints,
                            fill: false,
                            lineTension: 0,
                            borderWidth: 1
                        }));
        }

        setChart(new Chart(ctx, {
            type: "line",
            data: {
                labels: xDataset,
                datasets: yDatasets
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            font: {
                                size: 9,
                                family: 'Helvetica'
                            },
                            display: true
                        },
                        grid: {
                            drawTicks: false,
                            color: '#EDEDED'
                        },
                        border: {
                            display: false
                        }
                    },
                    y: {
                        ticks: {
                            font: {
                                size: 9,
                                family: 'Helvetica'
                            },
                            display: true
                        },
                        grid: {
                            drawTicks: false,
                            color: '#EDEDED'
                        },
                        border: {
                            display: false
                        },
                        min: 0
                    }
                },
                responsive: true,
                maintainAspectRatio: true
            }
        }));
    }, [props.data]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h5>{props.header}</h5>
                <span>{props.units}</span>
            </div>
            <div className={styles.canvasContainer}>
                <canvas onClick={handleClick} id={props.id}></canvas>
            </div>
        </div>
    )
}