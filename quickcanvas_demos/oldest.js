// basic Quick Canvas Template

(function(){

    var canvas = document.getElementById('quickcanvas_canvas'),
    context = canvas.getContext('2d'),

    // a box
    box = {
        x: 155,
        y: 115,
        w: 10,
        h: 10
    },
	
    // app state object
    state = {

        frame:0,
        maxFrame: 60

    },

    // start will be called once before running main loop
    start = function(){

        loop();

    },

    // what to do on each frame tick
    update = function(){

        box.x = state.frame * ((canvas.width-20) / state.maxFrame) + 10;

        state.frame++;

        if(state.frame === state.maxFrame){
            state.frame = 0;
        }

    },

    // what to draw to canvas
    draw = function(ctx){

        // background
        ctx.fillStyle='#000000';
        ctx.fillRect(0,0,canvas.width,canvas.height);

        // box
        ctx.fillStyle='#ffffff';
        ctx.fillRect(box.x,box.y,box.w,box.h);

    },

    // main app loop
    loop = function(){

        requestAnimationFrame(loop);

        update();
        draw(context);


    };

    // start it (click run button to start this demo)
    start();
    

}());
                    