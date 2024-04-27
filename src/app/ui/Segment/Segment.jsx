'use client';
import styles from './Segment.module.css';
import Link from 'next/link';
import { useSpring, animated } from "@react-spring/web";

const maxWidth = "1200px";
const minWidth = "0px";

const maxOpacity = "1";
const minOpacity = "0";

const slowTime = "999";
const fastTime = "200";

export default function Segment(props) {
    const openAnimation = useSpring({
        from: {
            opacity: props.prev ? maxOpacity : minOpacity,
            maxWidth: props.prev ? maxWidth : minWidth
        },
        to: { 
            opacity: props.open ? maxOpacity : minOpacity,
            maxWidth: props.open ? maxWidth : minWidth,
        },
        config: { 
            duration: props.prev ? fastTime : slowTime,
            mass: 10, tension: 600, friction: 25
        }
    });

    return (
        <div className={`${styles.segment} ${props.open ? styles.open : ''}`}>

            <animated.div className={styles.page} style={openAnimation}>

                {props.image != null && 
                    <div className={styles.image} style={{backgroundImage: `url('/${props.image}')`}}>
                        <div className={styles.imgContainer}>
                            <img src={`/${props.image}`}></img>
                        </div>
                    </div>
                }

                <div className={styles.text}>
                    <div>
                        <h1>{props.header}</h1>
                        <span>{props.subtext}</span>
                        <p>{props.text}</p>
                        {props.href != null && <Link className={styles.button} href={props.href}>Start</Link>}
                    </div>
                </div>

            </animated.div>

            <div className={styles.bookmark} onClick={(e)=>props.toggleState(props.id)}>
                {props.icon}
            </div>
            
        </div>
    )
}

// https://owlcation.com/stem/Animated-Accordion-with-React-JS