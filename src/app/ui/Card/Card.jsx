import { useState, useEffect, useMemo } from "react";
import LeftArrow from "../Icon/LeftArrow";
import RightArrow from "../Icon/RightArrow";
import Bar from "../Icon/Bar";
import styles from './Card.module.css';

export default function Card(props) {
    const [cardIndex, setCardIndex] = useState(0);
    const numberStats = [...Array(props.infoLabels.length).keys()];
    const numberCards = props.data == null ? 0 : props.data.length;

    const next = () => {
        let nextIndex = cardIndex + 1 >= numberCards ? 0 : cardIndex + 1;
        setCardIndex(nextIndex);
    };

    const prev = () => {
        let prevIndex = cardIndex - 1 < 0 ? numberCards - 1 : cardIndex - 1;
        setCardIndex(prevIndex);
    };

    useMemo(() => {
        setCardIndex(0);
    }, [props.reset]);

    const outOfBoundsCardIndex = () => {
        return props.data != null && cardIndex >= numberCards;
    }

    const cardNonExistent = () => {
        return props.data == null || numberCards == 0;
    }

    const getBackgroundImage = () => {
        let index = 0;

        if (cardNonExistent()) {
            return 'NONE';
        }
        else if (outOfBoundsCardIndex()) {
            index = 0;
            setCardIndex(0);
        }
        else {
            index = cardIndex;
        }

        return `url('${props.data[index].image}')`;
    }

    const getSourceImage = () => {
        let index = 0;

        if (cardNonExistent()) {
            return <></>;
        }
        else if (outOfBoundsCardIndex()) {
            index = 0;
            setCardIndex(0);
        }
        else {
            index = cardIndex;
        }  

        return (<img className={styles.cardImage} src={`${props.data[index].image}`}></img>);
    }

    const getCardName = () => {
        let index = 0;

        if (cardNonExistent()) {
            return <></>;
        }
        else if (outOfBoundsCardIndex()) {
            index = 0;
            setCardIndex(0);
        }
        else {
            index = cardIndex;
        }

        return (<label>{props.data[index].name}</label>)
    }

    const getCardStatistics = () => {
        let index =0;

        if (cardNonExistent()) {
            return <></>;
        }
        else if (outOfBoundsCardIndex()) {
            index = 0;
            setCardIndex(0);
        }
        else {
            index = cardIndex;
        }

        return numberStats.map((i) => (
            <div key={i}>
                <div className={styles.infoLabelHeader}><Bar/><p>{props.infoLabels[i]}</p></div>
                <p className={styles.infoLabelText}>{props.data[index].info[i]}</p>
            </div>
        ));
    }

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}></div>
            <div className={styles.cardBannerWrapper}>
                <div className={styles.cardBanner} style={{backgroundImage: getBackgroundImage()}}>
                    <div className={props.data == null ? styles.unselected : ''}>
                        {getSourceImage()}
                    </div>
                </div>
            </div>
            <div className={styles.cardDescription}>
                {props.data == null && <p className={styles.defaultLabel}>{"To view a trend, you must first create and select a trend."}</p>}
                {props.data != null && 
                    <div>
                        <div className={styles.header}>
                            {getCardName()}
                            <span>{props.header}{numberCards > 1 ? "s" : ""} in Trend</span>
                        </div>
                        <div className={styles.info}>
                            {getCardStatistics()}
                        </div>
                    </div>
                }
            </div>
			<div className={styles.scroll}>
                {numberCards > 1 && <span onClick={prev}><LeftArrow></LeftArrow></span>}
                {numberCards > 1 && <span onClick={next}><RightArrow></RightArrow></span>}
			</div>
        </div>
    )
}