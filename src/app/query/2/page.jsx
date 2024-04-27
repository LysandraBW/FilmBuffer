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
import SelectM from '@/app/ui/Input/SelectM/SelectM';
import Search from '@/app/ui/Input/Search/Search';
import { getCrewMembers, getGenres } from '@/app/lib/searchList';
import { process } from '@/app/lib/2/process';
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
        name: "",
        genre: [],
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

    const handleInputChange = async (event) => {
        const {name, value} = event.target;
        setFormData((prev) => ({...prev, [name]: value}));
        let input = document.querySelector(`input[id=${name}]`);
        if (input != null)
            input.value = value[1];
    };

    const handleMultipleInputChange = (event) => {
        const {name, value} = event.target;

        if (value[0] == "_All") {
            if (formData[name].includes(value)) {
                setFormData((prev) => ({...prev, [name]: []}));
            }
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
            // loaded["name"] = (await getCrewMembers()).sort(sortFunction);
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
                        header="Crew Member"
                        paragraphs={[
                            ["Paragraph 1", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."],
                            ["Paragraph 2", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."],
                            ["Paragraph 3", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."],
                            ["Paragraph 4", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."]
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
                                        name="name"
                                        header="Name"
                                        options={options["name"]}
                                        value={formData["name"]}
                                        multiple={false}
                                        placeholder="Search Crew Member"
                                        handleChange={handleInputChange}
                                    />,
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
                                        header="Crew Member"
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