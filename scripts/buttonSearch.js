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