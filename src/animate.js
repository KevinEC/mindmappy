const TWEEN = require('@tweenjs/tween.js')

export function twenVar(obj, target, options) {
    options = options || {};
    let easing = options.easing || TWEEN.Easing.Linear.None,
        duration = options.duration || 2000,
        variable = options.variable || 'opacity',
        tweenTo = {};
    tweenTo[variable] = target; // set the custom variable to the target

    let tween = new TWEEN.Tween(obj)
        .to(tweenTo, duration)
        .easing(easing)
        .onUpdate(function(d) { 
            if(options.update){ 
                options.update(d);
            }
        })
        .onComplete(function(){
             if(options.callback) { 
                 options.callback();
             }
        });

    tween.start();
    return tween;
}

export function createNoisyEasing(randomProportion, easingFunction) {
    var normalProportion = 1.0 - randomProportion
    return function (k) {
        return randomProportion * Math.random() + normalProportion * easingFunction(k)
    }
}