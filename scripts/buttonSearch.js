//https://www.sitepoint.com/delay-sleep-pause-wait/
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

onmousemove = function(e){
    if(!stopGame){
        let r = document.getElementById("cropper");
        let image = document.getElementById("button1");
        let width = r.offsetWidth;
        let height = r.offsetHeight;
        r.style.top = Math.ceil(e.clientY-(height/2))+"px";
        r.style.left = Math.ceil(e.clientX-(width/2))+"px";
        image.style.top = ((Math.ceil(e.clientY-(height/2))*-1)+buttonPosY)+"px";
        image.style.left = ((Math.ceil(e.clientX-(width/2))*-1)+buttonPosX)+"px";
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
}
function startGame(){
    let docWidth = document.body.offsetWidth;
    let docHeight = document.body.scrollHeight;
    let image = document.getElementById("button1");
    image.style.backgroundImage = "url(images/light-off.png)";
    buttonPosX = Math.abs(Math.ceil(Math.random()*docWidth)-68);
    buttonPosY = Math.abs(Math.ceil(Math.random()*docHeight)-114);
    image.addEventListener("click", function() {
        stopGame = true;
    });
}
async function increaseLight(){
    while(!stopGame){
        if(!stopGame){
            await sleep(550);
            var r = document.querySelector(':root');
            var rs = getComputedStyle(r);
    
            let width = Number(rs.getPropertyValue("--widthy").replace("px",''));
            let height = Number(rs.getPropertyValue("--heighty").replace("px",''));
            if(Number(rs.getPropertyValue("--widthy").replace("px",''))<=200){
                r.style.setProperty("--widthy",`${Math.ceil(width*1.15)}px`);
                r.style.setProperty("--heighty",`${Math.ceil(height*1.15)}px`);
            }
        }
        if (stopGame){
            let r = document.getElementById("cropper");
            let page = document.getElementById("webpage");
            let button2 = document.getElementById("nextPage");
            button2.addEventListener("click", function() {
                window.location.href = "sliding.html";
            });
            r.remove()
            page.style.visibility = 'visible';
            page.style.position = "static";
            document.body.classList.remove("body")
            document.body.appendChild(image)
            return;
        }
    }

}

//Nepabeigts kods kas atļautu iesākt spēli no jauna.

// let completed = 0;
// let forbiddenArray = [];
// let mouseX,mouseY
// function newGame(){
//     forbiddenArray = [0,0];
//     let r = document.getElementById("cropper")
//     let width = r.offsetWidth
//     let height = r.offsetHeight
//     let posOffsetX = Number(r.style.top.replace("px",''))
//     let posOffsetY = Number(r.style.left.replace("px",''))
//     let docWidth = document.body.offsetWidth
//     let docHeight = document.body.scrollHeight
//     console.log(posOffsetX,posOffsetY,docHeight,height,docWidth,width)
//     for (let x = 1; x < width; x++) {
//         // console.log(x+posOffsetX,docHeight,"1",x+posOffsetX)>docHeight)
//         for (let i = 1; i < width; i++) {
//             // if(forbiddenArray.length>0){
//             //     // console.log(forbiddenArray[forbiddenArray.length-1][1]-forbiddenArray[0][1]+x+posOffsetY)
//             //     if(forbiddenArray[forbiddenArray.length-1][1]-forbiddenArray[0][1]+x+posOffsetY>docWidth){
//             //         // console.log("dang")
//             //     }
//             //     if(forbiddenArray[forbiddenArray.length-1][0]-forbiddenArray[0][0]+i+posOffsetX>docHeight){
//             //         console.log("dang2")
//             //     }
//             // }
//             if((((i+posOffsetY)<0  || (i+posOffsetY)>docWidth) 
//             || ((x+posOffsetX)<0  || (x+posOffsetX)>docHeight))
//             || ((forbiddenArray[forbiddenArray.length-1][1]-forbiddenArray[0][1]+x+posOffsetY>docWidth)
//             || forbiddenArray[forbiddenArray.length-1][0]-forbiddenArray[0][0]+i+posOffsetX>docHeight)) 
//             {
//                     // console.log(i+posOffsetY,docWidth,"2",x+posOffsetX,posOffsetX)
//             }  else {
//                 forbiddenArray.push([x+posOffsetX,i+posOffsetY])
//             }
//         }
//     }
//     forbiddenArray.shift()
//     var q = document.querySelector(':root');
//     if(posOffsetX<0){posOffsetX=0};if(posOffsetY<0){posOffsetY=0};
//     q.style.setProperty("--lefty",`${posOffsetY}px`)
//     q.style.setProperty("--topy",`${posOffsetX}px`)
//     q.style.setProperty("--widthy",`${Math.abs(forbiddenArray[0][1]-forbiddenArray[forbiddenArray.length-1][1])}px`)
//     q.style.setProperty("--heighty",`${Math.abs(forbiddenArray[0][0]-forbiddenArray[forbiddenArray.length-1][0])}px`)
//     return forbiddenArray;
// }