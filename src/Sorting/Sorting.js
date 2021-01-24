import React, { useEffect, useState, useRef } from 'react';
import styles from './Sorting.module.css'
import './common.css'
import getRandomValue from './randomValueGenerator'
import RefreshIcon from '@material-ui/icons/Refresh';
import SortIcon from '@material-ui/icons/Sort';

const defaultBackgroundColor = "#2F80ED";
const defaultSlowDown = 0;
const defaultRange = 50;
class animationClass {

    constructor(animationDelay, defaultBgColor) {
        if (defaultBgColor !== undefined) {
            this.defaultBgColor = defaultBgColor;
        } else {
            this.defaultBgColor = defaultBackgroundColor;
        }
        this.animationDelay = animationDelay;
        this.queue = [];
    }

    addAnimation(type, element1, value1, element2, value2) {
        switch (type) {
            case 'swapPosition':
                console.log('swap position');
                //hightlight bg 
                this.queue.push(this.changeBgColor(element1, 'yellow', element2, 'yellow'))
                this.queue.push(this.changeBgColor(element1, this.defaultBgColor, element2, this.defaultBgColor))

                //swap element heights
                this.queue.push(this.updateHeight(element1, value1, element2, value2));
                return;

            case 'changeBgColor':
                console.log('Change Bg Color');
                this.queue.push(this.changeBgColor(element1, value1));
                return;
            default: return;
        }
    }

    changeBgColor(element1, color1, element2, color2) {
        return () => {
            if (element2 !== undefined) {
                element2.style.backgroundColor = color2;
            }
            element1.style.backgroundColor = color1;
        }
    }

    updateHeight(element1, value1, element2, value2) {
        return () => {
            console.log('Height Changed')

            element1.style.height = value1 + 'px';
            if (element2 !== undefined)
                element2.style.height = value2 + 'px';
        }
    }
    isEmpty() {
        return this.queue.length > 0 ? false : true;
    }
    pop() {
        return this.queue.shift();
    }
    animate() {
        if (!this.isEmpty()) {
            this.pop()();
            setTimeout(() => {
                this.animate();
            }, this.animationDelay);
        }
    }
}
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

        setRange(defaultRange);
        setButtonDisabled(false);
        setTimerIncrement(defaultSlowDown);

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

        for(let i=0;i<elRefs.current.length;i++){
            elRefs.current[i].style.backgroundColor = defaultBackgroundColor;
        }

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
        console.log('sorting started')
        let selectedSort = '';
        sortTypes.forEach(ele => {
            if (ele.checked === true) {
                selectedSort = ele.name;
            }
        });

        setSortTime(0);
        let startTime = new Date();


        let animationObj = new animationClass(timerIncrement);


        if (selectedSort === 'Bubble') {

            let tempSortData = [...sortData];
            for (let i = 0; i < tempSortData.length; i++) {
                let j = 0;
                for (j = 0; j < tempSortData.length - i; j++) {

                    if (tempSortData[j] > tempSortData[j + 1]) {
                        let temp = tempSortData[j];
                        tempSortData[j] = tempSortData[j + 1];
                        tempSortData[j + 1] = temp;

                        animationObj.addAnimation('swapPosition', elRefs.current[j], tempSortData[j], elRefs.current[j + 1], tempSortData[j + 1])

                    }

                }

                animationObj.addAnimation('changeBgColor', elRefs.current[j - 1], '#56CCF2')

            }


        } else if (selectedSort === 'Insertion') {
            let tempSortData = [...sortData];

            for (let i = 1; i < tempSortData.length; i++) {

                let key = tempSortData[i];
                let k = i - 1;

                while (k >= 0 && tempSortData[k] > key) {

                    tempSortData[k + 1] = tempSortData[k];
                    k--;
                }
                tempSortData[k + 1] = key;
            }
            // setSortData(tempSortData);
        }
        
        let endTime = new Date();
        setSortTime(endTime - startTime);

        //Run all animations
        animationObj.animate()

    }

    function toggleDropDown() {
        setShowDropDown(!showDropDown)
    }

    function closeDropDown(evt) {
        let ele = evt.currentTarget;
        let classList = [...ele.classList];

        if (!(classList.includes('radio') || classList.includes('input'))) {
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
                            <div className={styles.arrow} data-class={showDropDown ? 'up' : 'down'}>^</div>
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
                                <input type="range" id="data-range" name="dataRange" min="50" max="300" value={range} onChange={rangeHandler}></input><span className={styles.rangeValueText}>{range + ' items'}</span>
                            </div>
                        </span>
                    </div>
                    <div className={styles.headerRow}>
                        <span className={styles.bold}>Slow down</span>
                        <span>
                            <div className={styles.rangeInputWrapper}>
                                <input type="range" id="data-range" name="dataRange" min="0" max="10" value={timerIncrement} onChange={slowDownRangeHandler}></input> <span className={styles.rangeValueText}>{(11 - timerIncrement) / 10 + 'x'}</span>
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
                                    <div key={index} ref={el => { elRefs.current[index] = el }} className={styles.row} style={{ height: ele + 'px', color: defaultBackgroundColor }}></div>
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