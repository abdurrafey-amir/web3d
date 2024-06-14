let map = document.querySelector("#map");

setup();

function setup() {
    map.innerHTML="";
    for (let i = 0; i < city.length; i++) {
        for (let j = 0; j <city[0].length; j++) {
            let x = (i * 5) - (2.5 * (city.length - 1))
            let z = -j * 5 + (2.5 * (city.length - 1))
            let val = city[i][j];
            addBuilding(x, z, val);
            console.log(city[i][j]);
        }
    }
}