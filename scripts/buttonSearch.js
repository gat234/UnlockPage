function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function mouse(){

}
onmousemove = function(e){
    var r = document.querySelector('.foot');
    var rs = getComputedStyle(r);

    let width = rs.getPropertyValue("--widthy")
    let height = rs.getPropertyValue("--heighty")
    console.log(width)
    r.style.setProperty("--lefty",`${e.clientX-50}px`)
    r.style.setProperty("--righty",`${e.clientY-50}px`)
}


