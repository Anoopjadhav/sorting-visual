function* getRandomValueFun(){
    while(true){
        let randomValue = Math.floor(Math.random() * 600);
        yield(randomValue);
    }
}

const getRandomValue = getRandomValueFun();

export default getRandomValue;