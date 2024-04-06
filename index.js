import fs from "fs";
import {MaxRectsPacker} from "maxrects-packer";

function main(json){
    var trunk = Array(11).fill(0).map(()=>Array(8).fill(0));
    
    var garbage = new Map(Object.entries(JSON.parse(json)["planetGarbage"]));

    function getSize(block) {
        let 
            maxX = 0,
            maxY = 0;

        block.forEach(coord => {
            maxX = Math.max(coord[0], maxX);
            maxY = Math.max(coord[1], maxY);
        });

        return [maxX, maxY];
    }

    const options = {
        smart: true,
        pot: false,
        square: true,
        allowRotation: false,
        border: 0
    };
    let packer = new MaxRectsPacker(7, 11, 1, options);

    for (let [key, value] of garbage) {
        packer.add(getSize(value)[0], getSize(value)[1], key)
    }

    packer.repack();

    var result = new Map();
    
    packer.bins[0].rects.forEach(rect => {
        var newCoords = []
        for (let coords of garbage.get(rect._data)){
            let x = coords[0] + rect._x;
            let y = coords[1] + rect._y;
            newCoords.push([x, y]);

            trunk[y][x] += 1;
        }
        result.set(rect._data, newCoords);
    });

    console.table(trunk);

    return JSON.stringify({'garbage': Object.fromEntries(result)});
}

var data = fs.readFileSync('garbage.json', 'utf8');
console.log(main(data));

export default main;