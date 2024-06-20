`AFRAME.registerComponent('extended-wasd-controls', {...})`, {
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
        reverse: {type: 'string', default: "3"},
        currentGear: {type: 'number', default: 1},

        inputType: {type: 'string', default: "keyboard"}

    },
    
    convertKeyName: function(keyName) {
        if (keyName == " ")
            return "Space";
        else if (keyName.length == 1)
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
        let i = Math.round((zVal - 2.5*14) / -5);

        return moveMap[j][i]
    },

    // switching gear
    switchGear: function(keyName) {
        this.data.currentGear = keyName;

        let text = document.querySelector("#text")
        text.innerHTML = `<a-text value="${this.data.currentGear}" position="-2.4 1.5 1" rotation="-52.64 90 0"></a-text>`;
    },

    // switching view
    switchView: function(keyName) {
        let cam_object = document.querySelector("#camera")
        if(keyName == "F") {
            cam_object.setAttribute("position", "-1 2 0.6");
        } else if (keyName == "R") {
            cam_object.setAttribute("position", "2.4 2.2 0");
        }
    },

    init: function() {

        // register key down/up events
        // and keep track of all keys currently pressed

        this.keyPressedSet = new Set();
        let self = this;

        document.addEventListener("keydown", 
            function(eventData)
            {
                var name = eventData.key;
                var code = eventData.code;
                self.registerKeyDown(self.convertKeyName(eventData.key));
                // gear changes and camera switches are checked here
            }
        );
        
        document.addEventListener("keyup",
            function(eventData)
            {
                self.registerKeyUp(self.convertKeyName(eventData.key));
            }
        );

        // movement-related data
        this.moveVector = new THREE.Vector3(0, 0, 0);
        this.movePercent = new THREE.Vector3(0, 0, 0);

        // x = forward/backward
        // y = up/down
        // z = left/right
        this.rotateVector = new THREE.Vector2(0, 0);
        this.rotatePercent = new THREE.Vector2(0, 0);

        // y = turn angle
        // x = look angle
        
        // used as reference vector when turning
        this.upVector = new THREE.Vector3(0, 1, 0);

        // current rotation amounts
        this.turnAngle = 0; // around global y axis
        this.lookAngle = 0; // around local x axis

        // allows easy extraction of turn angle
        this.el.object3D.rotation.order = 'YXZ';
    },

    tick: function(time, timeDelta)
    {
        let moveAmount = (timeDelta/1000) * this.data.moveSpeed;

        // need to convert angle measures from degrees to radians
        let turnAmount = (timeDelta/1000) * THREE.Math.degToRad(this.data.turnSpeed);
        let lookAmount = (timeDelta/1000) * THREE.Math.degToRad(this.data.lookSpeed);
        let maxLookAngle = THREE.Math.degToRad(this.data.maxLookAngle);

        // rotations

        // reset values
        let totalTurnAngle = 0;
        let totalLookAngle = 0;

        // ---Gamepad inputs for buttons will go here---

        // need to reset rotatePercent values
        // when querying which keys are currently pressed
        this.rotatePercent.set(0,0);

        if (this.isKeyPressed(this.data.turnLeftKey))
            this.rotatePercent.y += 1;
        if (this.isKeyPressed(this.data.turnRightKey))
            this.rotatePercent.y -= 1;

        // ---Gamepad inputs for turning will go here---

        if (this.data.currentGear != 1) // no turning while parked
        {
            this.turnAngle += this.rotatePercent.y * turnAmount;
            this.el.object3D.rotation.y = this.turnAngle;
        }

        // translations

        // this only works when rotation order = "YXZ"
        let finalTurnAngle = this.el.object3D.rotation.y;

        let c = MATH.cos(finalTurnAngle);
        let s = MATH.sin(finalTurnAngle);

        // need to reset movePercent values
        // when querying which keys are currently pressed
        this.movePercent.y = 0;

        if (this.movePercent.x -0.03 >= 0) {this.movePercent.x -= 0.03;}
        if (this.movePercent.x +0.03 <= 0) {this.movePercent.x += 0.03;}
        if (this.movePercent.x < 0.03 && this.movePercent.x > -0.03) {this.movePercent.x = 0;}

        // moving backward and forward
        if (this.isKeyPressed(this.data.moveBackKey)) {
            if (this.data.currentGear == 2 && this.data.moveSpeed-1 > 0) { // drive
                this.data.moveSpeed = 0;
            }
            this.movePercent.x = 1;
        }

        // ---Gamepad input for movement here---

        if (this.data.currentGear == 1) { // parked
        // no change in movement    
        } else if (this.data.currentGear == 2) { // drive
        // only move forward
            if (this.movePercent.x > 0) {
                this.movePercent.x = 0;
            }
            
            this.moveVector.set( -s * this.movePercent.z + c * this.movePercent.x, // x
                1 * this.movePercent.y, // y
                -c * this.movePercent.z - s * this.movePercent.x).multiplyScalar(moveAmount); // z
        } else if (this.data.currentGear == 3) { // reverse
            // only move backwards
            if (this.movePercent.x < 0) {
                this.movePercent.x = 0;
            }

            this.moveVector.set( -s * this.movePercent.z + c * this.movePercent.x, // x
                1 * this.movePercent.y, // y
                -c * this.movePercent.z - s * this.movePercent.x).multiplyScalar(moveAmount); // z
        }

        // update movement
        this.el.object3D.position.add(this.moveVector);
    }
}