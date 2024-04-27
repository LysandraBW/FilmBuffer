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
import { getActors } from '@/app/lib/searchList';
import { process } from '@/app/lib/0/process';
import { organize } from '@/app/lib/query/chart';
import { ring2 } from 'ldrs';
import { sortFunction } from '@/app/lib/general';

ring2.register();

export default function Page() {
    const [loading, setLoading] = useState(true);

    const [activeTrend, setActiveTrend] = useState(-1);
    const [chartData, setChartData] = useState({});

    const [options, setOptions] = useState({});
    const [formData, setFormData] = useState({
        x0: "",
        x1: "",
        x_jump: "",
        y0: "",
        y1: "",
        y_jump: "",
        y_unit: "",
        group_by: [],
        actors: [],
    });

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleMultipleInputChange = (event) => {
        const {name, value} = event.target;

        if (value[0] == "_All") {
            if (formData[name].includes(value))
                setFormData((prev) => ({...prev, [name]: []}));
            else
                setFormData((prev) => ({...prev, [name]: [value]}));
            return;
        }
        else if (formData[name].findIndex(entry => entry[0] == "_All") == -1) {
            if (formData[name].includes(value)) {
                let index = formData[name].findIndex(entry => entry[0] == value[0] && entry[1] == value[1]);
                setFormData((prev) => ({...prev, [name]: formData[name].slice(0, index).concat(formData[name].slice(index + 1))}));
            }
            else {
                setFormData((prev) => ({...prev, [name]: formData[name].concat([value])}));
            }
        }
    };

    const handleSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();
        const data = await process(formData);
        const chartData = await organize(data);
        setChartData(chartData);
        setLoading(false);
    };

    useEffect(() => {
        
    }, [formData]);

    useEffect(() => {
        const load = async () => {
            // let loaded = {};
            // let actors = await getActors();
            // actors = actors.sort(sortFunction);
            // loaded["actors"] = actors;
            // loaded["y_unit"] = ([["Minute", "Minute"], ["Hour", "Hour"]]).sort(sortFunction);
            // loaded["group_by"] = ([["Media", "Media"], ["Genre", "Genre"]]).sort(sortFunction);
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
                        header="Trend Header"
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
                                    <Text
                                        name="x0"
                                        type="number"
                                        header="Start"
                                        value={formData["x0"]}
                                        handleChange={handleInputChange}
                                    />,
                                    <Text
                                        name="x1"
                                        type="number"
                                        header="End"
                                        value={formData["x1"]}
                                        handleChange={handleInputChange}
                                    />,
                                    <Text
                                        name="x_jump"
                                        type="number"
                                        header="Gap"
                                        value={formData["x_jump"]}
                                        handleChange={handleInputChange}
                                    />
                                ],
                                [
                                    <Select
                                        name="y_unit"
                                        header="Select y-Unit"
                                        options={options["y_unit"]}
                                        value={formData["y_unit"]}
                                        handleChange={handleInputChange}
                                    />,
                                    <Text
                                        name="y0"
                                        header="Start"
                                        type="number"
                                        value={formData["y0"]}
                                        handleChange={handleInputChange}
                                    />,
                                    <Text
                                        name="y1"
                                        header="End"
                                        type="number"
                                        value={formData["y1"]}
                                        handleChange={handleInputChange}
                                    />,
                                    <Text
                                        name="y_jump"
                                        header="Gap"
                                        type="number"
                                        value={formData["y_jump"]}
                                        handleChange={handleInputChange}
                                    />
                                ],
                                [
                                    <Select
                                        name="group_by"
                                        header="Group By"
                                        options={options["group_by"]}
                                        value={formData["group_by"]}
                                        handleChange={handleInputChange}
                                    />
                                ],
                                [
                                    <Search
                                        name="actors"
                                        header="Add Actor"
                                        options={options["actors"]}
                                        value={formData["actors"]}
                                        handleChange={handleMultipleInputChange}
                                        offerAll={true}
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
                                        header="Appearances"
                                        units="Runtime by Year"
                                        data={chartData}
                                        handleClick={setActiveTrend}
                                    />
                                }

                                // Key
                                keys={
                                    <Key keys={toKeys(chartData.trends)}/>
                                }

                                // Card
                                card={
                                    <Card
                                        header="Actor"
                                        infoLabels={["Label 1", "Label 2", "Label 3"]}
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