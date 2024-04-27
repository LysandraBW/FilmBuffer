'use client';

import styles from '@/app/ui/query.module.css';
import { useState, useEffect } from 'react';
import Banner from '@/app/ui/Banner/Banner';
import Form from '@/app/ui/Form/Form';
import Info from '@/app/ui/Info/Info';
import BarGraph from '@/app/ui/Bar/Bar';
import LineGraph from '@/app/ui/LineGraph/LineGraph';
import {Key, toKeys} from '@/app/ui/Key/Key';
import Card from '@/app/ui/Card/Card';
import Text from '@/app/ui/Input/Text/Text';
import Select from '@/app/ui/Input/Select/Select';
import SelectM from '@/app/ui/Input/SelectM/SelectM';
import Search from '@/app/ui/Input/Search/Search';
import { getTVShows } from '@/app/lib/searchList';
import { process_5, process } from '@/app/lib/5/process';
import { organize_5 } from '@/app/lib/5/barorganize';
import { ring2 } from 'ldrs';
import { sortFunction } from '@/app/lib/general';
import { getWriters, testQuery } from '@/app/lib/5/query5';
import { getnamedTVShow } from '@/app/lib/5/query5';
import { organize } from '@/app/lib/query/chart';

ring2.register();

export default function Page() {
    const [loading, setLoading] = useState(true);

    const [activeTrend, setActiveTrend] = useState(-1);
    const [chartData, setChartData] = useState({});

    const [options, setOptions] = useState({});
    const [formData, setFormData] = useState({
        tv_show: "",
        crew_member: [],
        type: []
    });

    const handleClickCard = async (clickedLabel) => {
        if (clickedLabel === "") {
            setActiveTrend(-1);
        }
        else {
            setActiveTrend(clickedLabel);
        }
    }

    const handleInputChange = async (event) => {
        const {name, value} = event.target;
        setFormData((prev) => ({...prev, [name]: value}));
        
        let input = document.querySelector(`input[id=${name}]`);
        if (input != null)
            input.value = value[1];

        if(name == "type" && formData["tv_show"] != "" || formData["tv_show"] != []) {
            const people = await getWriters(formData["tv_show"], value);
            

            setOptions((prev) => ({
                ...prev,
                "crew_member": people
            }));
        }

        if (name == "tv_show") {
            
            setFormData((formData) => ({
                ...formData,
                "crew_member": [],
                "type": []
            }));

            document.querySelector(`select[name='type']`).selectedIndex = 0;
            document.querySelector(`input[id='crew_member']`).value = "";
        }
        
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
        
    }, [formData]);

    useEffect(() => {
        const load = async () => {
            // let loaded = {};
            // loaded["tv_show"] = (await getTVShows()).sort(sortFunction);
            // loaded["type"] = ([["writer", "Writers"], ["director", "Directors"]]).sort(sortFunction);
            
            // setOptions(loaded);
            setLoading(false);
        }
        load();
    }, []);

    return (
        <div className={styles.wrapper}>
            {/* {loading && 
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
            } */}
            <div className={styles.container}>
                <div className={styles.banner}>
                    <Banner
                        header="Television Show"
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
                                        name="tv_show"
                                        header="TV Show Name"
                                        options={options["tv_show"]}
                                        value={formData["tv_show"]}
                                        multiple={false}
                                        placeholder="Search TV Shows"
                                        handleChange={handleInputChange}
                                    />
                                ],
                                [
                                    <Select
                                        name="type"
                                        header="Type"
                                        options={options["type"]}
                                        value={formData["type"]}
                                        handleChange={handleInputChange}
                                    />
                                ],
                                [
                                    
                                    <Search
                                        name="crew_member"
                                        header="Select Crew Members"
                                        options={options["crew_member"]}
                                        value={formData["crew_member"]}
                                        multiple={true}
                                        placeholder="Select TV Show and Writer First"
                                        handleChange={handleMultipleInputChange}
                                        size = {10}
                                    />
                                    
                                ]/*,
                                [
                                    
                                    <Search
                                        name="crew_memb2"
                                        header="Select Second Crewmember"
                                        options={options["writers"]}
                                        value={formData["crew_memb2"]}
                                        multiple={false}
                                        placeholder="Select TV Show and Writer First"
                                        handleChange={handleInputChange}
                                    />
                                    
                                ],
                                [
                                    
                                    <Search
                                        name="crew_memb3"
                                        header="Select Third Crewmember"
                                        options={options["writers"]}
                                        value={formData["crew_memb3"]}
                                        multiple={false}
                                        placeholder="Select TV Show and Writer First"
                                        handleChange={handleInputChange}
                                    />
                                    
                                ],
                                [
                                    
                                    <Search
                                        name="crew_memb4"
                                        header="Select Fourth Crewmember"
                                        options={options["writers"]}
                                        value={formData["crew_memb4"]}
                                        multiple={false}
                                        placeholder="Select TV Show and Writer First"
                                        handleChange={handleInputChange}
                                    />
                                    
                                ],
                                [
                                    
                                    <Search
                                        name="crew_memb5"
                                        header="Select Fifth Crewmember"
                                        options={options["writers"]}
                                        value={formData["crew_memb5"]}
                                        multiple={false}
                                        placeholder="Select TV Show and Writer First"
                                        handleChange={handleInputChange}
                                    />
                                    
                                ]*/
                            ]}
                        />
                    </div>
                    <div className={styles.info}>
                            <Info
                                // Chart
                                chart={
                                    <BarGraph
                                        id="chart"
                                        header="Television Show"
                                        units="Average Rating per Episode"
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
                                        header="Episode"
                                        infoLabels={["Season", "Episode", "Average Rating"]}
                                        data={activeTrend == -1 ? null : chartData.cards[activeTrend]}
                                    />
                                }
                            />
                    </div>
                </div>
            </div>
        </div>
    )
    
}