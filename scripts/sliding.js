//https://stackoverflow.com/questions/1033398/how-to-execute-a-function-when-page-has-fully-loaded
document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      init();
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
let pieceArray = [];
let handler = function(){handleClick(this,buttonVal(this));}
let imgHeight,imgWidth
function init(){
    let collection = document.getElementsByClassName("sliding");
    let blank = document.getElementById("blank");
    
    for ( var i = 0, l = collection.length; i < l; i++ ){
        if (blank==collection[i]){
            pieceArray.push([collection[i],i])
            collection[i].addEventListener("click", handler);
        }   else    {
            pieceArray.push([collection[i],i]);
            collection[i].addEventListener("click", handler);
        }
    }

    const img = new Image();

    img.onload = function() {
        imgWidth = this.width
        imgHeight = this.height
        splitImage(Number(imgWidth),Number(imgHeight))
    }
    img.src = '../images/sliding-image.png';
    console.log(imgWidth,imgHeight)
    
}
function splitImage(width,height){
    let allColumns = document.querySelectorAll("span");
    let numOfRows = allColumns[0].querySelectorAll("div").length;
    let numOfColumns = allColumns.length;
    let collection = document.getElementsByClassName("sliding");
    let ratio = width/height
    console.log(ratio>1.33,ratio<1.3333334,ratio)
    if(ratio>1.33&&ratio<1.3333334){
        while(numOfRows<4){
            for(var i = 0; i < allColumns.length; i++) {
                allColumns[i].innerHTML = allColumns[i].innerHTML + `<div class="sliding">Image4</div>`
            }
            numOfRows++
        }
        while(numOfColumns<3){
            document.body.innerHTML = document.body.innerHTML + `
            <span class="flex-container">
                <div class="sliding">Image4</div>
                <div class="sliding">Image8</div>
                <div class="sliding">Image3</div>
            </span>`
            numOfColumns++
            // break;
        }
        scramble(10);
        return
    }
}
let saved = [];
function handleClick(element,type){
    console.log([element,type],saved)
    if(saved.length!=2){
        if(type==1){
            element.classList.add("pressed");
            saved = [element,type];
        }
    }   else    {
        if(saved[0]==element){
            element.classList.remove("pressed");
            saved = [];
        }   else    {
            if(type==0&&saved[1]==1){

                let sortedArray = pieceSorter(saved[0],element)
                let columnBlank = sortedArray[0]
                let columnPress = sortedArray[1]
                let childrenBlank = sortedArray[2]
                let childrenPress = sortedArray[3]
                if(Math.abs(columnPress[1]-columnBlank[1])==1
                &&Math.abs(columnPress[2]-columnBlank[2])==0){
                    let temp = saved[0].outerHTML
                    saved[0].outerHTML = '<div class="sliding" id="blank">BlankSpace</div>'
                    saved[0] = childrenPress[columnPress[2]]
                    saved[0].addEventListener("click", function() {
                        handleClick(this,0);
                    });
                    element.outerHTML = temp
                    element = childrenBlank[columnBlank[2]]
                    element.addEventListener("click", function() {
                        handleClick(this,1);
                    });
                    swapElements(pieceArray,calcPos(columnPress[1],columnPress[2]),calcPos(columnBlank[1],columnBlank[2]));
                }
                if(Math.abs(columnPress[1]-columnBlank[1])==0
                &&Math.abs(columnPress[2]-columnBlank[2])==1){
                    let temp = saved[0].outerHTML
                    saved[0].outerHTML = '<div class="sliding" id="blank">BlankSpace</div>'
                    saved[0] = childrenPress[columnPress[2]]
                    saved[0].addEventListener("click", function() {
                        handleClick(this,0);
                    });
                    element.outerHTML = temp
                    element = childrenBlank[columnBlank[2]]
                    element.addEventListener("click", function() {
                        handleClick(this,buttonVal(this));
                    });
                    
                    swapElements(pieceArray,calcPos(columnPress[1],columnPress[2]),calcPos(columnBlank[1],columnBlank[2]));
                }
                // console.log(saved[0])
                element.classList.remove("pressed");
                saved=[];
            }   else    {
                element.classList.remove("pressed");
                saved=[];
            }
        }
    }
    let sorted = true;
    for (let i = 0; i < pieceArray.length - 1; i++) {
        if (pieceArray[i] > pieceArray[i+1]) {
            sorted = false;
            break;
        }
    }
    console.log(sorted)
}

function calcPos(col,row){
    let allColumns = document.querySelectorAll("span");
    let numOfRows = allColumns[0].querySelectorAll("div").length;
    return col*numOfRows+row;
}
function scramble(times){
    for(let i = 0; i < times; i++){

        let randElementArr = toArray(document.querySelectorAll("div"));
        let rand1 = Math.ceil(Math.random()*randElementArr.length-1);
        let el1 = randElementArr[rand1];
        randElementArr.splice(rand1, 1);
        let rand2 = Math.ceil(Math.random()*randElementArr.length-1);
        let el2 = randElementArr[rand2];
        // console.log(randElementArr)
        let sortedArray = pieceSorter(el2,el1);
        let columnBlank = sortedArray[0];
        let columnPress = sortedArray[1];
        let childrenBlank = sortedArray[2];
        let childrenPress = sortedArray[3];

        let temp = el1.outerHTML;
        el1.outerHTML = el2.outerHTML;
        el1 = childrenPress[columnPress[2]];
        el2.outerHTML = temp;
        el2 = childrenBlank[columnBlank[2]];
        let collection = document.getElementsByClassName("sliding");
        for ( var c = 0, l = collection.length; c < l; c++ ){
            collection[c].removeEventListener("click",handler);
            collection[c].addEventListener("click",handler);
            // collection[c].addEventListener("click", function() {
            //     handleClick(this,buttonVal(this));
            // });
        }
        swapElements(pieceArray,calcPos(columnPress[1],columnPress[2]),calcPos(columnBlank[1],columnBlank[2]));
    }
}
function buttonVal(element){
    if(element.id != "blank"){
        return 1;
    }   else    {
        return 0;
    }
}
function pieceSorter(el1,el2){
    let allColumns = document.querySelectorAll("span");
                
    let columnPress = [el1.closest("span")];
    let columnBlank = [el2.closest("span")];
    for(var i = 0; i < allColumns.length; i++) {
        if(allColumns[i]==columnPress[0]){
            columnPress.push(i);
        }
        if(allColumns[i]==columnBlank[0]){
            columnBlank.push(i);
        }
    }
    let childrenPress = columnPress[0].children;
    let childrenBlank = columnBlank[0].children;
    for(var i = 0; i < childrenPress.length; i++) {
        if(childrenPress[i]==el1){
            columnPress.push(i);
        }
    }
    for(var i = 0; i < childrenBlank.length; i++) {
        if(childrenBlank[i]==el2){
            columnBlank.push(i);
        }
    }
    return [columnBlank,columnPress,childrenBlank,childrenPress];
}
//https://www.freecodecamp.org/news/swap-two-array-elements-in-javascript/
const swapElements = (array, index1, index2) => {
    let temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
};
function toArray(arr){
    let newArr = [];
    for ( var i = 0, l = arr.length; i < l; i++ ){
        newArr.push(arr[i])
    }
    return newArr;
}