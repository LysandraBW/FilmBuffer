'use client';

import styles from './Banner.module.css';
import DownArrow from '../Icon/DownArrow';
import LeftBarArrow from '../Icon/LeftBarArrow';
import One from '../Icon/One';
import Two from '../Icon/Two';
import Three from '../Icon/Three';
import Four from '../Icon/Four';
import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

const MIN_OPACITY = "0";
const MAX_OPACITY = "1";

const MIN_HEIGHT = "0px";
const MAX_HEIGHT = "300px";

const UP = "rotate(90deg)";
const DOWN = "rotate(270deg)";

const DURATION = "300";
const L_DURATION = "500";

export default function Banner(props) {

    const [open, setOpen] = useState(false);
    const toggle = (e) => {setOpen(!open)};

    useEffect(() => {
        setOpen(false);
    }, []);

    const openAnimation = useSpring({
        from: { 
            opacity: MIN_OPACITY,
            maxHeight: MIN_HEIGHT
        },
        to: { 
            opacity: open ? MAX_OPACITY : MIN_OPACITY, 
            maxHeight: open ? MAX_HEIGHT : MIN_HEIGHT 
        },
        config: {mass: 1000, duration: DURATION}
    });

    const iconAnimation = useSpring({
        from: {transform: DOWN},
        to: {transform: open ? UP : DOWN},
        config: {duration: L_DURATION}
    });

    const numbers = [<One/>, <Two/>, <Three/>, <Four/>];

    return (
        <div className={styles.container}>
            <animated.div className={`${styles.text} ${open ? styles.open : ''}`} style={openAnimation}>
                <h1>{props.header}</h1>
                <div className={styles.paragraphs}>
                    {props.paragraphs != null &&
                        props.paragraphs.map((p, index) => (
                            <div key={index}>
                                <h3>{numbers[index]}{p[0]}</h3>
                                <p>{p[1]}</p>
                            </div>
                        ))
                    }
                </div>
            </animated.div>
            <div className={styles.iconContainer} onClick={(e) => toggle(e)}>
                <span>{open ? "Close Banner" : "Open Banner"}</span>
                <animated.span className={open ? styles.open : ''} style={iconAnimation}>
                    <LeftBarArrow/>
                </animated.span>
            </div>
        </div>
    )
}