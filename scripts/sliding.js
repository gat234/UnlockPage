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
let handler = function(){
    handleClick(this,buttonVal(this));
}
let imgHeight,imgWidth
function init(){

    const img = new Image();

    img.onload = function() {
        imgWidth = this.width
        imgHeight = this.height
        if(imgHeight!=undefined&&imgWidth!=undefined){
            splitImage(Number(imgWidth),Number(imgHeight))
        }   else    {
            let puzzlie = document.getElementById("txt")
            puzzlie.innerHTML = `Error`
        }
    }
    img.src = `https://picsum.photos/3000/2000`;
    var r = document.querySelector(':root');
    r.style.setProperty('--url',`url(${img.src})`);
}
function splitImage(width,height){
    // let ratio = width/height
    let flexContainerStr = `<span class="flex-container"></span>`
    let collumns,rows
    collumns = Math.round(Math.random())+3
    rows = Math.round(Math.random())+3
    let multW = rows/10
    let multH = collumns/10
    let imgWidth = (width/rows)*multW
    let imgHeight = (height/collumns)*multH
    var r = document.querySelector(':root');
    r.style.setProperty('--w',`${imgWidth}px`);
    r.style.setProperty('--h',`${imgHeight}px`);
    r.style.setProperty('--wbg',`${collumns}00%`);
    r.style.setProperty('--hbg',`${rows}00%`);
    for(var i = 0; i < rows; i++){
        let puzzle = document.getElementById("puzzle")
        flexContainerStr = '<span class="flex-container"></span>'
        for(var x = 0; x < collumns; x++) {
            let lastDiv = flexContainerStr.lastIndexOf("</div>")
            
            lastDiv = lastDiv + 6
            if(lastDiv!=5){
                if(i==rows-1&&x==collumns-1){
                    flexContainerStr = flexContainerStr.slice(0,lastDiv) + `<div class="sliding" id="blank" style="background-position:${((width/rows)*x)*-multW}px ${((height/collumns)*i)*-multH}px;"></div>` + flexContainerStr.slice(lastDiv)
                }else{
                    flexContainerStr = flexContainerStr.slice(0,lastDiv) + `<div class="sliding" style="background-position:${((width/rows)*x)*-multW}px ${((height/collumns)*i)*-multH}px;"></div>` + flexContainerStr.slice(lastDiv)
                }
            }   else    {
                flexContainerStr = flexContainerStr.slice(0,29) + `<div class="sliding" style="background-position:${((width/rows)*x)*-multW}px ${((height/collumns)*i)*-multH}px;"></div>` + flexContainerStr.slice(29)
            }
        }
        puzzle.innerHTML = puzzle.innerHTML + flexContainerStr
    }
    let collection = document.getElementsByClassName("sliding");
    for ( var i = 0, l = collection.length; i < l; i++ ){
        pieceArray.push([collection[i],i]);
    }
    for ( var c = 0, l = collection.length; c < l; c++ ){
        collection[c].removeEventListener("click",handler);
        collection[c].addEventListener("click",handler);
    }
    scramble(Math.ceil(Math.random()*3));
    calcRemaining();
    var r = document.querySelector(':root');
    r.style.setProperty('--bord','6px solid blueviolet');
    moveImage()
    if (Incorrect==0){
        scramble(Math.ceil(Math.random()*3));
        calcRemaining();
    }

}

let saved = [];
let Incorrect = 0;
function handleClick(element,type){

    if(saved.length!=2){
        if(type==1){
            element.classList.add("pressed");
            saved = [element,type];
        }
    }   else    {
        if(saved[0]==element){
            element.classList.remove("pressed");
            saved[0].classList.remove("pressed");
            saved = [];
        }   else    {
            if(type==0&&saved[1]==1){

                let sortedArray = pieceSorter(saved[0],element);
                let columnBlank = sortedArray[0];
                let columnPress = sortedArray[1];
                let childrenBlank = sortedArray[2];
                let childrenPress = sortedArray[3];
                if(Math.abs(columnPress[1]-columnBlank[1])==1
                &&Math.abs(columnPress[2]-columnBlank[2])==0){
                    let temp = saved[0].outerHTML;
                    saved[0].outerHTML = element.outerHTML;
                    saved[0] = childrenPress[columnPress[2]];
                    element.outerHTML = temp;
                    element = childrenBlank[columnBlank[2]];
                    swapElements(pieceArray,calcPos(columnPress[1],columnPress[2]),calcPos(columnBlank[1],columnBlank[2]));
                }
                if(Math.abs(columnPress[1]-columnBlank[1])==0
                &&Math.abs(columnPress[2]-columnBlank[2])==1){
                    let temp = saved[0].outerHTML;
                    saved[0].outerHTML = element.outerHTML;
                    saved[0] = childrenPress[columnPress[2]];
                    element.outerHTML = temp;
                    element = childrenBlank[columnBlank[2]];
                    
                    swapElements(pieceArray,calcPos(columnPress[1],columnPress[2]),calcPos(columnBlank[1],columnBlank[2]));
                }
                element.classList.remove("pressed");
                saved[0].classList.remove("pressed");
                saved=[];
                var audio = new Audio("./sounds/323417__sethroph__glass-slide-7.wav");
                audio.play();
                audio.remove();
            }   else    {

                element.classList.remove("pressed");
                saved[0].classList.remove("pressed");
                saved=[];
            }
        }
    }
    calcRemaining();

    let collection = document.getElementsByClassName("sliding");
    for ( var c = 0, l = collection.length; c < l; c++ ){
        collection[c].removeEventListener("click",handler);
        collection[c].addEventListener("click",handler);
    }

}
function calcRemaining(){
    Incorrect = 0;
    for (let i = 0; i < pieceArray.length; i++) {
        if (pieceArray[i][1] != i) {
            Incorrect++;
        }
    }
    let puzzlie = document.getElementById("txt");
    puzzlie.innerHTML = `Remaining: ${Incorrect}`;
    if(Incorrect==0){
        let r = document.getElementById("remove");
        let page = document.getElementById("webpage");
        r.remove()
        page.style.visibility = 'visible';
        page.style.position = "static";
        document.body.classList.remove("body");
    }
}
//Calculate the precise positions
function calcPos(col,row){
    let allColumns = document.querySelectorAll("span");
    
    let numOfRows = allColumns[0].getElementsByClassName("sliding").length;
    return col*numOfRows+row;
}

//Used to give the ability to scramble the pieces
function scramble(times){
    for(let i = 0; i < times; i++){
        let randElementArr = toArray(document.getElementsByClassName("sliding"))
        let rand1 = Math.ceil(Math.random()*randElementArr.length-1);
        let el1 = randElementArr[rand1];
        randElementArr.splice(rand1, 1);
        let rand2 = Math.ceil(Math.random()*randElementArr.length-1);
        let el2 = randElementArr[rand2];
        
        let sortedArray = pieceSorter(el2,el1);
        if(sortedArray!="disable"){
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
            }
            swapElements(pieceArray,calcPos(columnPress[1],columnPress[2]),calcPos(columnBlank[1],columnBlank[2]));
        }

    }
}
function buttonVal(element){
    if(element.id != "blank"){
        return 1;
    }   else    {
        return 0;
    }
}

//Used to get the precise positions in columns and children
function pieceSorter(el1,el2){
    if(el1.id=="ignore" || el2.id=="ignore"){return "disable";}
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
        newArr.push(arr[i]);
    }
    return newArr;
}
let imgBool = false;
let mousePressed = false;
async function moveImage(){
    while(true){
        await sleep(50);
        let element = document.getElementsByClassName("preview")[0]
        if(element.matches(":hover")){
            imgBool = true;
        }   else    {
            imgBool = false;
        }
    }

}
onmousedown = function() { 
    mousePressed = true;
}
onmouseup = function() {
    mousePressed = false;
}
onmousemove = function(e){
    let element = document.getElementsByClassName("preview")[0]
    if (mousePressed&&imgBool){
        mouseX = e.clientX;
        mouseY = e.clientY;

        let width = element.offsetWidth;
        let height = element.offsetHeight;
        
        element.style.top = Math.ceil(e.clientY-height/2)+"px";
        element.style.left = Math.ceil(e.clientX-width/2)+"px";
    }
}
