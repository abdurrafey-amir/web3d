let map = document.querySelector("#map");

setup();

function setup() {
    map.innerHTML="";
    for (let i = 0; i < city.length; i++) {
        for (let j = 0; j <city[0].length; j++) {
            console.log(city[i][j]);
        }
    }
}