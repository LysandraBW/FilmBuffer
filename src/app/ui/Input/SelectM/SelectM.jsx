import Select from '../Select/Select';
import Cross from '../../Icon/Cross';
import styles from './SelectM.module.css';
import { useRef, useEffect } from 'react';

export function SelectM(props) {
    const isMounted = useRef(false);
    let keyIndex = 0;

    if (isMounted.current) {
        keyIndex = 0;
    }

    useEffect(() => {
        isMounted.current = true;
    }, []);

    return (
        <div>
            <Select
                name={props.name}
                header={props.header}
                options={props.options}
                handleChange={props.handleChange}
            >
            </Select>
            <div className={styles.container}>
                {/* Box to Show Selections */}
                {props.selections != null &&
                    props.selections.map((selection) => (
                        <div
                            key={keyIndex++}
                            className={styles.selectionLabel}
                            onClick={(e) => props.handleRemove(props.name, selection[0])}
                        >
                            <label>{selection[1]}</label>
                            <Cross></Cross>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

// export function updateSelections({name, value, formData, selections}, changestuff = true) {


//     let selectionValues = formData[name];
//     let givenSelectionSelected = selectionValues.includes(value);

//     let formattedSelections = selections[name];
//     let formattedText = !changestuff ? value : document.querySelector(`[name=${name}] > option[value=${value}]`).innerText;

//     if (givenSelectionSelected) {
//         selectionValues.splice(selectionValues.indexOf(value), 1);

//         for (let i = 0; i < formattedSelections.length; i++) {
//             if (JSON.stringify(formattedSelections[i]) == JSON.stringify([value, formattedText])) {
//                 formattedSelections.splice(i, 1);
//                 break;
//             }
//         }
//     }
//     else {
//         selectionValues.push(value);
//         formattedSelections.push([value, formattedText]);
//     }

//     return [selectionValues, formattedSelections];
// }