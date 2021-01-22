import React, { useEffect, useState, useRef } from 'react';
import styles from './Sorting.module.css'
import './common.css'
import getRandomValue from './randomValueGenerator'
import RefreshIcon from '@material-ui/icons/Refresh';
import SortIcon from '@material-ui/icons/Sort';
const Sorting = () => {

    let [sortTypes, setSortTypes] = useState('');
    let [sortData, setSortData] = useState([]);
    let [range, setRange] = useState(0);
    let [buttonDisabled, setButtonDisabled] = useState(false);
    let [showDropDown, setShowDropDown] = useState(false);
    let [sortTime, setSortTime] = useState(0);
    let [timerIncrement, setTimerIncrement] = useState(0);
    let elRefs = useRef([]);

    useEffect(() => {
        setSortTypes([
            {
                name: 'Bubble',
                checked: true
            },
            {
                name: 'Insertion',
                checked: false
            },
            {
                name: 'Selection',
                checked: false
            },
            {
                name: 'Merge',
                checked: false
            }, {
                name: 'Quick',
                checked: false
            }
        ])

        setRange(50);
        setButtonDisabled(false);
        setTimerIncrement(5);

    }, [])

    useEffect(() => {
        resetData();
        setSortTime(0);
    }, [range]);

    useEffect(() => {
    }, [sortData]);


    function handleSortSelectChange(evt) {
        let element = evt.currentTarget;
        element.focus();
        let targetEvt = element.dataset.id;
        let tempSortTypes = sortTypes.map(ele => {
            if (ele.name === targetEvt) {
                ele.checked = true;
                setButtonDisabled(false);
            } else {
                ele.checked = false;
            }
            return ele;
        })
        setSortTypes(
            tempSortTypes
        )
       
    }
    function rangeHandler(evt) {
        let targetValue = evt.currentTarget.value;
        setRange(targetValue);
    }

    function resetData() {
        let sortData = [];
        for (let i = 0; i < range; i++) {
            // sortData.push(range - i);
            sortData.push(getRandomValue.next().value)
        }
        setSortData(sortData);


        //clear timers
        var id = window.setTimeout(function () { }, 0);

        while (id--) {
            window.clearTimeout(id); // will do nothing if no timeout with id is present
        }
    }

    function slowDownRangeHandler(evt) {
        let targetValue = evt.currentTarget.value;
        setTimerIncrement(parseInt(targetValue));
    }
    function startSort() {
        let selectedSort = '';
        sortTypes.forEach(ele => {
            if (ele.checked === true) {
                selectedSort = ele.name;
            }
        });

        setSortTime(0);
        let startTime = new Date();
        let timer = 0;

        if (selectedSort === 'Bubble') {

            let tempSortData = [...sortData];
            for (let i = 0; i < tempSortData.length; i++) {
                for (let j = 0; j < tempSortData.length - i; j++) {

                    timer += timerIncrement;
                    console.log(timer);
                    setTimeout(() => {

                        if (tempSortData[j] > tempSortData[j + 1]) {

                            hightlightComparedValues(j, j + 1);

                            let temp = tempSortData[j];

                            tempSortData[j] = tempSortData[j + 1];
                            elRefs.current[j].style.height = tempSortData[j + 1] + 'px';

                            tempSortData[j + 1] = temp;
                            elRefs.current[j + 1].style.height = temp + 'px';
                        }

                    }, timer);

                }

            }
            // setSortData(tempSortData);

        } else if (selectedSort === 'Insertion') {
            let tempSortData = [...sortData];

            for (let i = 0; i < tempSortData.length; i++) {

                let key = tempSortData[i];
                let k = i + 1;

                while (k >= 0 && tempSortData[k] < key) {
                    setTimeout(() => {
                        hightlightComparedValues(k, k + 1);
                        tempSortData[k + 1] = tempSortData[k];
                    }, timer);

                    k--;
                }

                tempSortData[k + 1] = key;
            }

        }



        let endTime = new Date();
        setSortTime(endTime - startTime);
    }

    function hightlightComparedValues(i, j) {
        elRefs.current[i].classList.add('blink-red');
        elRefs.current[j].classList.add('blink-yellow');
        setTimeout(
            () => {
                elRefs.current[i].classList.remove('blink-red');
                elRefs.current[j].classList.remove('blink-yellow');
            }, 10
        )
    }
    function toggleDropDown(){
        setShowDropDown(!showDropDown)
    }

    function closeDropDown(evt){
        let ele = evt.currentTarget;
       let classList = [...ele.classList];
      
        if(!(classList.includes('radio') || classList.includes('input'))){
            setShowDropDown(false)
        }
    }

    return (
        <div className={styles.sortWrapper}>
            <div className={styles.headerCombined}>
                <div className={styles.header}><SortIcon style={{ color: 'white', fontSize: 24 }}></SortIcon><span className={styles.iconLabel}>Sort Analysis</span></div>
                <div className={styles.secHeader}>
                    <div className={styles.headerRow}>
                        <span className={styles.bold} onClick={toggleDropDown}>
                            Select Sort Type 
                            <div className={styles.arrow} data-class={ showDropDown ? 'up': 'down'}>^</div>
                        </span>
                        {
                            showDropDown && <div className={styles.radioInputWrapper} >
                                    {
                                        sortTypes && sortTypes.map((ele, index) => {
                                            return (
                                                <div key={index} className={styles.input + " input"} data-id={ele.name} onClick={handleSortSelectChange} onBlur={closeDropDown}>
                                                    <input className="radio" name="sort" type="radio" data-id={ele.name} value={ele.name} checked={ele.checked} onChange={handleSortSelectChange} onBlur={closeDropDown}></input><span>{ele.name}</span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                           
                        }
                    </div>
                    <div className={styles.headerRow}>
                        <span className={styles.bold}>Select Dataset </span>
                        <span>
                            <div className={styles.rangeInputWrapper}>
                                <input type="range" id="data-range" name="dataRange" min="50" max="100" value={range} onChange={rangeHandler}></input><span className={styles.rangeValueText}>{range + ' items'}</span>
                            </div>
                        </span>
                    </div>
                    <div className={styles.headerRow}>
                        <span className={styles.bold}>Slow down</span>
                        <span>
                            <div className={styles.rangeInputWrapper}>
                                <input type="range" id="data-range" name="dataRange" min="1" max="10" value={timerIncrement} onChange={slowDownRangeHandler}></input> <span className={styles.rangeValueText}>{(11 - timerIncrement) / 10 + 'x'}</span>
                            </div>
                        </span>
                    </div>
                    <div className={styles.headerRow}>
                        <button className={styles.buttonDestructive} onClick={resetData}><RefreshIcon style={{ color: 'white', fontSize: 16 }}></RefreshIcon><span className={styles.iconLabel}>Reset</span></button>
                        <button onClick={startSort} disabled={buttonDisabled}>Start Sorting</button>
                    </div>
                </div>
            </div>
            <div>
                <div className={styles.body}>
                    <div className={styles.sortVisual}>
                        {
                            sortData && sortData.map((ele, index) => {
                                return (
                                    <div key={index} ref={el => { elRefs.current[index] = el }} className={styles.row} style={{ height: ele + 'px' }}></div>
                                )
                            })
                        }
                    </div>
                </div>

            </div>
            <div className={styles.footer}>
                <div className={styles.sortTime}>
                    <span>Time Taken by actual sort: </span> <span><b>{sortTime + ' milliseconds'}</b></span>
                </div>
            </div>
        </div>
    )
}

export default Sorting;