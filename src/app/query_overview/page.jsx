'use client';
import NavBar from '../ui/NavBar/NavBar';
import styles from '@/app/ui/query_overview.module.css';
import Segment from '../ui/Segment/Segment';
import Asterisk from '../ui/Icon/Asterisk';
import One from '../ui/Icon/One';
import Two from '../ui/Icon/Two';
import Three from '../ui/Icon/Three';
import Four from '../ui/Icon/Four';
import Five from '../ui/Icon/Five';
import { useState, useEffect } from 'react';

// Text
const INTRODUCTION = "FilmBuffer is not just another software; it's a comprehensive analytical tool meticulously crafted for cinephiles, critics, and industry professionals alike. Whether you're a seasoned film aficionado seeking deeper insights or a casual viewer curious about the art behind the screen, FilmBuffer empowers you with unparalleled access to analytical information like never before. Click on the numbers to delve deeper into the range of queries we provide.";
const QUERY1 = "Movies and TV shows have long been a cornerstone of global culture, captivating audiences with their diverse narratives, compelling characters, and immersive storytelling. While certain titles enjoy worldwide acclaim, the popularity of movies and TV shows often varies by region, reflecting unique cultural preferences, societal norms, and historical contexts."
const QUERY2 = "Crew members are the unsung heroes behind the scenes of every movie and TV show, working tirelessly to bring the director's vision to life. From cinematographers capturing the perfect shot to editors weaving together scenes seamlessly, and from costume designers crafting characters' looks to sound engineers creating immersive audio experiences, each member of the crew plays a crucial role in the production process. "
const QUERY3 = "Genres in the realm of entertainment serve as a roadmap, guiding audiences to their preferred narratives and themes. From the heart-pounding suspense of thrillers to the heartwarming tales of romance, and from the adrenaline-fueled action of blockbusters to the thought-provoking depths of dramas, genres offer a diverse spectrum of experiences to suit every taste and mood."
const QUERY4 = "Famous actors and actresses are the embodiment of charisma, talent, and versatility, captivating audiences with their captivating performances and magnetic presence on screen. Among these luminaries stands Marlon Brando, a legendary figure whose groundbreaking work revolutionized the art of acting. Renowned actors and actresses are the heartbeat of the entertainment industry."
const QUERY5 = "Television shows have become a cornerstone of modern entertainment, offering a diverse array of narratives and experiences, from thrilling dramas to captivating comedies. WandaVision, with its innovative blend of sitcom homage and superhero storytelling, captured audiences' imaginations and set a new standard for creative risk-taking. With streaming platforms providing unprecedented access to a vast library of content, viewers can immerse themselves in a wide range of genres."

export default function Page() {
    const [openSegment, setOpenSegment] = useState(-1);
    const [prevSegment, setPrevSegment] = useState(-1);

    useEffect(()=> {
        setOpenSegment(0);
    }, []);

    const open = (id) => {
        setPrevSegment(openSegment);
        setOpenSegment(id);
    };

    return (
        <div className={styles.container}>
            <NavBar theme="dark"></NavBar>
            <div className={styles.segmentContainer}>
                <Segment
                    id={0}
                    header="What to Expect"
                    text={INTRODUCTION}
                    icon={<Asterisk></Asterisk>}
                    open={openSegment==0}
                    prev={prevSegment==0}
                    toggleState={open}
                ></Segment>  
                <Segment
                    id={1}
                    href="/query/1"
                    header="Examining the Popularity of Movies"
                    text={QUERY1}
                    subtext={"Parasite"}
                    icon={<One></One>}
                    image="ParasiteClip.jpg"
                    open={openSegment==1}
                    prev={prevSegment==1}
                    toggleState={open}
                ></Segment>   
                <Segment
                    id={2}
                    href="/query/2"
                    header="Analyzing Crew Members' Careers"
                    text={QUERY2}
                    subtext={"Martin Scorsese"}
                    icon={<Two></Two>}
                    image="MartinScorsese.png"
                    open={openSegment==2}
                    prev={prevSegment==2}
                    toggleState={open}
                ></Segment>  
                <Segment
                    id={3}
                    href="/query/3"
                    header="Measuring a Genre's Popularity"
                    text={QUERY3}
                    subtext={"Joker"}
                    icon={<Three></Three>}
                    image="Joker.jpg"
                    open={openSegment==3}
                    prev={prevSegment==3}
                    toggleState={open}
                ></Segment>   
                <Segment
                    id={4}
                    href="/query/4"
                    header="Measuring an Actor's Success"
                    text={QUERY4}
                    subtext={"Marlon Brando"}
                    icon={<Four></Four>}
                    image="MarlonBrando.jpg"
                    open={openSegment==4}
                    prev={prevSegment==4}
                    toggleState={open}
                ></Segment>    
                <Segment
                    id={5}
                    href="/query/5"
                    header="Finding Trends in Television Shows"
                    text={QUERY5}
                    subtext={"WandaVision"}
                    icon={<Five></Five>}
                    image="WandaVision.png"
                    open={openSegment==5}
                    prev={prevSegment==5}
                    toggleState={open}
                ></Segment>     
            </div>
        </div>
    )
}