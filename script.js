let map = document.querySelector("#map");

var city = [[1, 1, 1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 0, 0, 0, 0, 0, 1],
			[1, 0, 0, 0, 1, 1, 1, 1, 1],
			[1, 0, 1, 0, 0, 0, 0, 0, 1],
			[1, 0, 1, 0, 1, 1, 1, 0, 1],
			[1, 0, 1, 0, 1, 0, 0, 0, 1],
			[1, 0, 1, 0, 1, 1, 1, 0, 1],
			[1, 0, 1, 0, 1, 0, 0, 0, 1],
			[1, 1, 1, 1, 1, 1, 1, 1, 1]]

setup();

function setup() {
    map.innerHTML="";
    for (let i = 0; i < city.length; i++) {
        for (let j = 0; j <city[0].length; j++) {
            let x = (i * 5) - (2.5 * (city.length - 1))
            let z = -j * 5 + (2.5 * (city.length - 1))
            let val = city[i][j];
            addBuilding(x, z, val);
            // console.log(city[i][j]);
        }
    }
}

var colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'white', 'gray', 'cyan', 'magenta', 'lime', 'olive', 'maroon', 'navy', 'teal', 'silver', 'gold', 'indigo', 'violet', 'beige', 'tan', 'khaki', 'salmon', 'coral', 'tomato', 'orange', 'chocolate', 'wheat', 'mint', 'turquoise', 'aquamarine', 'lavender', 'plum', 'orchid', 'rosybrown', 'slategray', 'slategrey', 'steelblue', 'skyblue', 'royalblue', 'powderblue', 'paleturquoise', 'palegreen', 'palegoldenrod', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen']

function randcolor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

var color = randcolor();


function addEntity(id, position, scale, rotation) {
    const entity = document.createElement('a-entity');
    entity.setAttribute('id', id);
    entity.setAttribute('geometry', 'primitive: box');
    entity.setAttribute('position', position);
    entity.setAttribute('scale', scale);
    entity.setAttribute('rotation', rotation);
    entity.setAttribute('color', `${color}`);
    map.appendChild(entity);
}

function addBuilding(x, z, val) {
    if (val == 0) {
        // no object made
    } else if (val == 1) {
        y = 2.5
        addEntity("#building", `${x} ${y} ${z}`, "5 4 4", "0 0 0", )
    }
}