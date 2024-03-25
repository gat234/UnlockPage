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
function init(){
    let collection = document.getElementsByClassName("sliding");
    let blank = document.getElementById("blank");
    for ( var i = 0, l = collection.length; i < l; i++ ){
        if (blank==collection[i]){
            pieceArray.push([collection[i],i])
            collection[i].addEventListener("click", function() {
                handleClick(this,0);
            });
        }   else    {
            pieceArray.push([collection[i],i]);
            collection[i].addEventListener("click", function() {
                handleClick(this,1);
            });
        }
    }
    // let lastPiece = pieceArray.pop()

    // pieceArray.push([pieceArray[pieceArray.length-1], "blank"])
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
                let allColumns = document.querySelectorAll("span");
                
                let columnPress = [saved[0].closest("span")];
                let columnBlank = [element.closest("span")];
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
                    if(childrenPress[i]==saved[0]){
                        columnPress.push(i);
                    }
                }
                for(var i = 0; i < childrenBlank.length; i++) {
                    if(childrenBlank[i]==element){
                        columnBlank.push(i);
                    }
                }
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
                        handleClick(this,1);
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

//https://www.freecodecamp.org/news/swap-two-array-elements-in-javascript/
const swapElements = (array, index1, index2) => {
    let temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
};