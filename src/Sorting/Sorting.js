import React, { useEffect, useState, useRef } from 'react';
import styles from './Sorting.module.css'
import './common.css'
import getRandomValue from './randomValueGenerator'
import RefreshIcon from '@material-ui/icons/Refresh';
import SortIcon from '@material-ui/icons/Sort';

const defaultSortType = 'Bubble'
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
    setDelay(animationDelay) {
        this.animationDelay = animationDelay;
    }

    addAnimation(type, element1, value1, element2, value2) {
        switch (type) {
            case 'swapPosition':
                // console.log('swap position');
                //hightlight bg 
                //swap element heights
                this.queue.push(this.changeBgColorAndUpdateHeight(element1, value1, element2, value2,'yellow'))
                this.queue.push(this.changeBgColor(element1, this.defaultBgColor, element2, this.defaultBgColor))
                return;

            case 'changeBgColor':
                // console.log('Change Bg Color');
                this.queue.push(this.changeBgColor(element1, value1));
                return;

            case 'updateHeight':
                //swap element heights
                this.queue.push(this.updateHeight(element1, value1, element2, value2));
                return;

            case 'updateHeightAndMarkSorted':
                //swap element heights
                this.queue.push(this.changeBgColorAndUpdateHeight(element1, value1, element2, value2,'#56CCF2'))
                return;
            case 'changeBgColorForAll':
                //***IMP***element1 == elements && value1 == color as parameters
                let elementRefs = element1;
                let color = value1;
                elementRefs.forEach(ele => {
                    this.queue.push(this.changeBgColor(ele, color))
                })

                return;
            default: return;
        }
    }

    changeBgColorAndUpdateHeight(element1, value1, element2, value2, color) {
        return () => {
            if (element2 !== undefined) {
                element2.style.backgroundColor = color;
            }
            if (element1 !== undefined)
                element1.style.backgroundColor = color;

            if (element1 !== undefined)
                element1.style.height = value1 + 'px';
            if (element2 !== undefined)
                element2.style.height = value2 + 'px';
        }
    }
    changeBgColor(element1, color1, element2, color2) {
        return () => {
            if (element2 !== undefined) {
                element2.style.backgroundColor = color2;
            }
            if (element1 !== undefined)
                element1.style.backgroundColor = color1;
        }
    }

    updateHeight(element1, value1, element2, value2) {
        return () => {
            // console.log('Height Changed')
            if (element1 !== undefined)
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
    let [selectedSort, setSelectedSort] = useState('');
    let [range, setRange] = useState(0);
    let [buttonDisabled, setButtonDisabled] = useState(false);
    let [sortTime, setSortTime] = useState(0);
    let [timerIncrement, setTimerIncrement] = useState(0);
    let [animationObj, setAnimationObj] = useState();
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

        setSelectedSort(defaultSortType);
        setAnimationObj(new animationClass(timerIncrement));

    }, [])

    useEffect(() => {
        resetData();
        setSortTime(0);
    }, [range]);

    useEffect(() => {
    }, [sortData]);


    function handleSortSelectChange(evt) {
        let element = evt.currentTarget;
        let selectedSort = '';
        element.focus();
        let targetEvt = element.dataset.id;
        let tempSortTypes = sortTypes.map(ele => {
            if (ele.name === targetEvt) {
                selectedSort = ele.name;
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

        setSelectedSort(selectedSort);
        resetData();

    }
    function rangeHandler(evt) {
        let targetValue = evt.currentTarget.value;
        setRange(targetValue);

        resetData();
    }

    function slowDownRangeHandler(evt) {
        let targetValue = evt.currentTarget.value;
        setTimerIncrement(parseInt(targetValue));

        let tempAnimationObj = animationObj;
        tempAnimationObj.setDelay(targetValue);

        setAnimationObj(tempAnimationObj);
    }

    function resetData() {
        let sortData = [];
        for (let i = 0; i < range; i++) {
            // sortData.push(range - i);
            sortData.push(getRandomValue.next().value)
        }

        setSortData(sortData);

        for (let i = 0; i < elRefs.current.length; i++) {
            if (elRefs.current[i])
                elRefs.current[i].style.backgroundColor = defaultBackgroundColor;
        }

        //clear timers
        var id = window.setTimeout(function () { }, 0);

        while (id--) {
            window.clearTimeout(id); // will do nothing if no timeout with id is present
        }
    }

    function getSelectedSort() {
        let selectedSort = '';
        sortTypes.forEach(ele => {
            if (ele.checked === true) {
                selectedSort = ele.name;
            }
        });
        return selectedSort;
    }

    function startSort() {
        // console.log('sorting started')
        let selectedSort = getSelectedSort();

        setSelectedSort(selectedSort);
        //init time
        setSortTime(0);
        let startTime = new Date();

        //init animation obj


        if (selectedSort === 'Bubble') {
            bubbleSort(animationObj);
        } else if (selectedSort === 'Insertion') {
            insertionSort(animationObj);
            animationObj.addAnimation('changeBgColorForAll', elRefs.current, '#56CCF2')
        }

        let endTime = new Date();
        setSortTime(endTime - startTime);

        //Run all animations
        animationObj.animate()

    }

    function bubbleSort(animationObj) {
        let tempSortData = [...sortData];
        for (let i = 0; i < tempSortData.length; i++) {
            let j = 0;
            for (j = 0; j < tempSortData.length - i; j++) {

                if (tempSortData[j] > tempSortData[j + 1]) {
                    let temp = tempSortData[j];
                    tempSortData[j] = tempSortData[j + 1];
                    tempSortData[j + 1] = temp;

                    if (animationObj)
                        animationObj.addAnimation('swapPosition', elRefs.current[j], tempSortData[j], elRefs.current[j + 1], tempSortData[j + 1])

                }

            }
            if (animationObj)
                animationObj.addAnimation('changeBgColor', elRefs.current[j - 1], '#56CCF2')
        }

        return tempSortData;
    }

    function insertionSort(animationObj) {
        let tempSortData = [...sortData];

        for (let i = 1; i < tempSortData.length; i++) {

            let key = tempSortData[i];
            let k = i - 1;

            while (k >= 0 && tempSortData[k] > key) {

                tempSortData[k + 1] = tempSortData[k];
                if (animationObj)
                    animationObj.addAnimation('swapPosition', elRefs.current[k + 1], tempSortData[k], elRefs.current[k + 1], tempSortData[k + 1])
                k--;
            }
            tempSortData[k + 1] = key;
            if (animationObj) {
                animationObj.addAnimation('updateHeight', elRefs.current[k + 1], key);
            }
        }
        return tempSortData
    }

    function testSort() {

        let sortedData = sortData.sort((a, b) => { return a - b });

        let algoSortedData = [];
        if (selectedSort === 'Bubble') {
            algoSortedData = bubbleSort();
        } else if (selectedSort === 'Insertion') {
            algoSortedData = insertionSort();
            console.log(algoSortedData)
        }

        let result = checkIfArrEqual(sortedData, algoSortedData);
        alert(result);

    }
    function checkIfArrEqual(arr1, arr2) {
        let flag = true;
        if (arr1.length !== arr1.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) flag = false;
        }
        return flag;
    }

    return (
        <div className={styles.sortWrapper}>
            <div className={styles.page}>
                <div className={styles.headerCombined}>
                    <div className={styles.header}><SortIcon style={{ color: 'white', fontSize: 24 }}></SortIcon><span className={styles.headerIconLabel}>Sort Analysis Tool</span></div>
                    <div className={styles.headerRow}>
                        <div className={styles.bold}>
                            Select Sort Type
                    </div>
                        <div className={styles.radioInputWrapper} >
                            {
                                sortTypes && sortTypes.map((ele, index) => {
                                    return (
                                        <div key={index} className={styles.input + " input"} data-id={ele.name} onClick={handleSortSelectChange} >
                                            <input className="radio" name="sort" type="radio" data-id={ele.name} value={ele.name} checked={ele.checked} onChange={handleSortSelectChange}></input><span>{ele.name}</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className={styles.headerRow}>
                        <span className={styles.bold}>Select Dataset </span>

                        <div className={styles.rangeInputWrapper}>
                            <input type="range" id="data-range" name="dataRange" min="50" max="200" value={range} onChange={rangeHandler}></input><span className={styles.rangeValueText}>{range + ' items'}</span>
                        </div>

                    </div>
                    <div className={styles.headerRow}>
                        <span className={styles.bold}>Animation Delay</span>

                        <div className={styles.rangeInputWrapper}>
                            <input type="range" id="data-range" name="dataRange" min="0" max="100" value={timerIncrement} onChange={slowDownRangeHandler}></input> <span className={styles.rangeValueText}>{timerIncrement + ' ms'}</span>
                        </div>

                    </div>
                    <div className={styles.buttonsWrapper}>
                        <button className={styles.buttonDestructive} onClick={resetData}><RefreshIcon style={{ color: 'white', fontSize: 16 }}></RefreshIcon><span className={styles.iconLabel}>Reset</span></button>
                        <button onClick={startSort} disabled={buttonDisabled}>Start Sorting</button>
                    </div>
                </div>
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
            <div className={styles.footer}>
                <div className={styles.sortTime}>
                    {/* <button onClick={testSort}>Test Sort</button> */}
                    <span>Time Taken by actual sort: </span> <span><b>{sortTime + ' milliseconds'}</b></span>
                </div>

            </div>
        </div>
    )
}

export default Sorting;