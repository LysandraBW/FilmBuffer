'use client';

import styles from '@/app/ui/query.module.css';
import { useState, useEffect } from 'react';
import Banner from '@/app/ui/Banner/Banner';
import Form from '@/app/ui/Form/Form';
import Info from '@/app/ui/Info/Info';
import LineGraph from '@/app/ui/LineGraph/LineGraph';
import {Key, toKeys} from '@/app/ui/Key/Key';
import Card from '@/app/ui/Card/Card';
import Text from '@/app/ui/Input/Text/Text';
import Select from '@/app/ui/Input/Select/Select';
import Search from '@/app/ui/Input/Search/Search';
import { getGenres } from '@/app/lib/searchList';
import { process } from '@/app/lib/1/process';
import { organize } from '@/app/lib/query/chart';
import { ring2 } from 'ldrs';
import { sortFunction } from '@/app/lib/general';

ring2.register();

export default function Page() {
    const [loading, setLoading] = useState(true);

    const [activeTrend, setActiveTrend] = useState(null);
    const [chartData, setChartData] = useState({});

    const [options, setOptions] = useState({});
    const [formData, setFormData] = useState({
        genre: [],
        runtime: "",
        number_votes: "",
        interval: "",
        min_year: "",
        max_year: "",
        metric: ""
    });

    const handleClickCard = async (clickedLabel, clickedPoint) => {
        if (clickedLabel === "" || clickedPoint === "") {
            setActiveTrend(null);
        }
        else {
            setActiveTrend([clickedLabel, clickedPoint]);
        }
    }

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFormData((prev) => ({...prev, [name]: value}));

        let input = document.querySelector(`input[id=${name}]`);
        if (input != null)
            input.value = value[1];
    };

    const handleMultipleInputChange = (event) => {
        const {name, value} = event.target;

        if (value[0] == "_All") {
            if (formData[name].includes(value))
                setFormData((prev) => ({...prev, [name]: []}));
            else {
                setFormData((prev) => ({...prev, [name]: [value]}));
                let input = document.querySelector(`input[id=${name}]`);
                if (input != null)
                    input.value = value[1];
            }
            return;
        }
        else if (formData[name].findIndex(entry => entry[0] == "_All") == -1) {
            if (formData[name].includes(value)) {
                let index = formData[name].findIndex(entry => entry[0] == value[0] && entry[1] == value[1]);
                setFormData((prev) => ({...prev, [name]: formData[name].slice(0, index).concat(formData[name].slice(index + 1))}));
            }
            else {
                setFormData((prev) => ({...prev, [name]: formData[name].concat([value])}));
                let input = document.querySelector(`input[id=${name}]`);
                if (input != null)
                    input.value = value[1];
            }
        }
    };

    const handleSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();
        const data = await process(formData);
        
        if (data != null) {
            const chartData = await organize(data);
            setChartData(chartData);
        }
        else {
            alert("Please make sure to enter all fields.");
        }        
        setLoading(false);
    };

    useEffect(() => {
        const load = async () => {
            // let loaded = {};
            // loaded["genre"] = (await getGenres()).sort(sortFunction);
            // loaded["metric"] = ([["AVERAGERUNTIME", "Runtime"], ["AVERAGENUMVOTES", "Average Number of Votes"], ["AVERAGERATING", "Average Rating"]]).sort(sortFunction);
            // setOptions(loaded);
            setLoading(false);
        }
        load();
    }, []);

    return (
        <div className={styles.wrapper}>
            {loading && 
                <div className={styles.loadingScreen}>
                    <l-ring-2
                        size="80"
                        stroke="7"
                        stroke-length="0.25"
                        bg-opacity="0.1"
                        speed="0.8" 
                        color="#3A8AFB" 
                    >
                    </l-ring-2>
                    <span>LOADING</span>
                </div>
            }
            <div className={styles.container}>
                <div className={styles.banner}>
                    <Banner
                        header="Movies"
                        paragraphs={[
                            ["Paragraph 1", "What characteristics can define a movie? Genre is a broad descriptor put on a movie to roughly group it in with others. Strictly speaking, it is only meant to be a tag applied to a movie after it’s been made for marketing purposes. But throughout the course of film history, the genre of a film often became a guiding force for a movie even before its release. Action films often seek to outdo each other in the realm of spectacle. Modern Westerns often invert the story tropes and themes of the classic Westerns that inspire them. For film history, tracking the development of the films in a genre can give valuable insight into the development of film as a whole."],
                            ["Paragraph 2", "A movie’s runtime also gives valuable hints to its structure. For example, a lot of epic historical films can stretch into 3-4 hour long runtimes to capture the breadth of its subject material. Meanwhile, a Thriller movie might be incentivized to cut all the fat off its story in the editing room for a sleek and fast paced story. This gives value to the runtime of a movie source for study on film."],
                            ["Paragraph 3", "On top of this, we also rank the movies through their average imdb ratings or their number of votes. The average imdb rating gives an idea of how well-received a movie is. The number of votes in contrast reflects how popular a movie is just in the context of the sheer amount of people that have seen it. These attributes are interrelated but not necessarily the same. A very popular and widely known movie might be well-known for being a terrible movie. In contrast, a movie might have low popularity but a high average rating which might indicate a small but dedicated following without mainstream appeal. To account for these, we provide fields to adjust the minimum values of the average ratings of the number of votes and rating of a movie that can be entered into our queries."],
                            ["Paragraph 4", "We look to find the answers to many of the questions that arise from these, especially in the context of film history. What are the interactions we can find between genre and runtime as the decades go on? Do comedy movies get shorter after the 1950’s? Are dramatic movies more well-received by the public and does that change with the years and social trends? Do action movies get more popular over time? These are all questions that can be answered with our queries."]
                        ]}
                    />
                </div>
                <div className={styles.trend}>
                    <div className={styles.form}>
                        <Form
                            header="Form"
                            button="Update Graph"
                            handleSubmit={handleSubmit}
                            groups={[
                                [
                                    <Search
                                        name="genre"
                                        header="Genre"
                                        options={options["genre"]}
                                        value={formData["genre"]}
                                        multiple={true}
                                        placeholder={"Search Genre"}
                                        offerAll={true}
                                        handleChange={handleMultipleInputChange}
                                        size={15}
                                    />
                                ],
                                [
                                    <Text
                                        name="number_votes"
                                        type="number"
                                        header="Minimum Votes"
                                        options={options["number_votes"]}
                                        value={formData["number_votes"]}
                                        handleChange={handleInputChange}
                                        min="0"
                                    />,
                                    <Text
                                        name="runtime"
                                        type="number"
                                        header="Minimum Runtime"
                                        options={options["runtime"]}
                                        value={formData["runtime"]}
                                        handleChange={handleInputChange}
                                        min="0"
                                    />
                                ],
                                [
                                    <Text
                                        name="min_year"
                                        type="number"
                                        header="Start Year"
                                        options={options["min_year"]}
                                        value={formData["min_year"]}
                                        handleChange={handleInputChange}
                                        min="1900"
                                        max="2025"
                                    />,
                                    <Text
                                        name="max_year"
                                        type="number"
                                        header="End Year"
                                        options={options["max_year"]}
                                        value={formData["max_year"]}
                                        handleChange={handleInputChange}
                                        min="1900"
                                        max="2025"
                                    />,
                                    <Text
                                        name="interval"
                                        type="number"
                                        header="Interval"
                                        options={options["interval"]}
                                        value={formData["interval"]}
                                        handleChange={handleInputChange}
                                    />
                                ],
                                [
                                    <Select
                                        name="metric"
                                        header="Select Metric"
                                        options={options["metric"]}
                                        value={formData["metric"]}
                                        handleChange={handleInputChange}                                      
                                    />
                                ]
                            ]}
                        />
                    </div>
                    <div className={styles.info}>
                            <Info
                                // Chart
                                chart={
                                    <LineGraph
                                        id="chart"
                                        header="General Trends"
                                        units={formData["metric"] != "" && formData["metric"] != null ? `${options["metric"].find((e) => e[0] == formData["metric"])[1]} by Year` : "Choose a Metric"}
                                        data={chartData}
                                        handleClick={handleClickCard}
                                    />
                                }

                                // Key
                                keys={
                                    <Key keys={toKeys(chartData.trends)}/>
                                }

                                // Card
                                card={
                                    <Card
                                        header="Movie"
                                        infoLabels={["Runtime", "Average Rating", "Genre", "Release Year"]}
                                        data={activeTrend == null ? null : chartData.cards[activeTrend[0]][activeTrend[1]]}
                                    />
                                }
                            />
                    </div>
                </div>
            </div>
        </div>
    )
    
}