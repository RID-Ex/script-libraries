module CommonAcceleration {

    export var canDeviceMotion = 'ondevicemotion' in window;
    export var events = [];

    var listenerFunc:any;

    var fireEvent = (event) => {
        for(var i = 0; i < events.length; i++) {
            events[i](event);
        }
    };

    var acceleration = () => {
        listenerFunc = (event) => fireEvent(event);

        window.addEventListener('devicemotion', listenerFunc);
    };

    var accelerationIncludingGravity = () => {
        var g = {x:0, y:0, z:0};

        var filter = (event) => {
            var aig = event.accelerationIncludingGravity;
            var a = 0.8;
            var acceleration:{x?:number;y?:number;z?:number;} = {};
            g.x = a * g.x + (1 - a) * aig.x;
            g.y = a * g.y + (1 - a) * aig.y;
            g.z = a * g.z + (1 - a) * aig.z;

            acceleration.x = aig.x - g.x;
            acceleration.y = aig.y - g.y;
            acceleration.z = aig.z - g.z;

            // accelerationプロパティがread onlyなっていて
            // 上書きができないのに対応する為新しくオブジェクトを作る
            return {
                acceleration: acceleration,
                accelerationIncludingGravity: aig
            };
        };

        listenerFunc = (event) => fireEvent(filter(event));

        window.addEventListener('devicemotion', listenerFunc);
    };

    var selectMotion = (e) => {
        if('acceleration' in e && e.acceleration) {
            acceleration();
        } else {
            accelerationIncludingGravity();
        }
    };

    export var listen = () => {
        window.addEventListener('devicemotion', function check(e) {
            window.removeEventListener('devicemotion', check);
            return selectMotion(e);
        });
    };

    export var remove = () => {
        window.removeEventListener('devicemotion', listenerFunc);
    };

}