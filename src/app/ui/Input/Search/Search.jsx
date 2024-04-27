import Cross from '../../Icon/Cross';
import SelectionLabel from '../SelectionLabel/SelectionLabel';
import styles from './Search.module.css';
import { useState } from 'react';

export default function Search(props) {
    const [searchResults, setSearchResults] = useState([]);

    const filter = (event) => {
        if (props.options == null) {
            return;
        }
        
        const {value} = event.target;
        const val = value.toUpperCase();

        let filtered = [];
        if (props.offerAll == true) {
            filtered.push(["_All", "All"]);
        }

        const size = props.size != null ? props.size : 10;

        for (let i = 0; i < props.options.length; i++) {
            if (props.options[i][1].toUpperCase().indexOf(val) > -1)
                filtered.push(props.options[i]);

            if (filtered.length >= size)
                break;
        }

        setSearchResults(filtered);
    }

    const [showResults, setShowResults] = useState(false);

    return (
        <div>
            <div className={styles.searchContainer}>
                <input id={props.name} className={styles.search} onChange={(e) => filter(e)} onFocus={e => setShowResults(true)} onBlur={e => setShowResults(false)} type="text" placeholder={props.multiple ? props.placeholder : props.value[1] != null && props.value[1] != "" ? props.value[1] : props.placeholder}></input>
                <div className={styles.searchResults}>
                    {(searchResults != null && showResults) &&
                        searchResults.map((result, index) => (
                            <div key={index} name={props.name} className={styles.searchResult} onMouseDown={(e) => props.handleChange({target: {name: props.name, value: result}})} value={result[0]}>{result[1]}</div>
                        ))
                    }
                </div>
            </div>
            <div className={styles.container}>
                {/* Box to Show Selections */}
                {(props.value != null && props.multiple) &&
                    props.value.map((val, index) => (
                        <div key={index} onClick={(e) => props.handleChange({target: {name: props.name, value: val}})}>
                            <SelectionLabel
                                label={val[1]}
                            />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}