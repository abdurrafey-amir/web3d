AFRAME.registerComponent('extended-wasd-controls'), {
    schema:
    {
        // Basic Structure:
        // propertyName: {type: '', default: Value},
        // functionName: function(input) {
        //     **function contents**
        // }
        
        // movement
        moveForwardKey: {type: 'string', default: "W"},
        moveBackKey: {type: 'string', default: "S"},
        turnLeftKey: {type: 'string', default: "A"},
        turnRightKey: {type: 'string', default: "D"},

        // view
        rearView: {type: 'string', default: "R"},
        frontView: {type: 'string', default: "F"},

        // speed
        moveSpeed: {type: 'number', default: 6}, // A-frame units/second
        turnSpeed: {type: 'number', default: 60}, // degrees/second
        lookSpeed: {type: 'number', default: 45}, // degrees/second

        // gears
        parked: {type: 'string', default: "1"},
        drive: {type: 'string', default: "2"},
        reverse: {type: 'string', defaukt: "3"},
        currentGear: {type: 'number', default: 1},

        inputType: {type: 'string', default: "keyboard"}

    },
    
    convertKeyName: function(keyName) {
        if (keyName == " ")
            return "Space";
        else if (keyName.Length == 1)
            return keyName.toUpperCase();
        else
        return keyName;
    },

    registerKeyDown: function(keyName) {
        // avoid adding duplicates of keys
        if (!this.keyPressedSet.has(keyName))
            this.keyPressedSet.add(keyName);
    },

    registerKeyUp: function(keyName) {
        this.keyPressedSet.delete(keyName);
    },

    isKeyPressed: function(keyName) {
        return this.keyPressedSet.has(keyName);
    },
    
    isEmpty: function(xVal, zVal) {
        let j = Math.round((xVal + 2.5*14) / 5);
        let i = Math.round((zval - 2.5*14) / -5);

        return moveMap[j][i]
    },

    
}