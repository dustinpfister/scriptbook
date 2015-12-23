// Basic Circle Demo

(function(){

    // get references to the canvas and canvas context
    var canvas = document.getElementById('quickcanvas_canvas'),
    context = canvas.getContext('2d'),
	
    // circle stuff
    radius = 10,
    maxRadius = 110,
    minRadius = 10,
    grow = true,

    // start will be called once before running main loop
    start = function(){

        loop();

    },

    // what to do on each frame tick
    update = function(){
       
        // grow or shrink circle
        if(grow){
            radius += 1;
        }else{
            radius -= 1;
        }

        if(radius <= minRadius || radius >= maxRadius){
            grow = !grow;
        }

    },

    // what to draw to canvas
    draw = function(ctx){

        // background
        ctx.fillStyle='#ffff00';
        ctx.fillRect(0,0,canvas.width,canvas.height);

        // circle
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#000000';
        ctx.beginPath();
        ctx.arc(160,120, radius, 0,Math.PI*2);
        ctx.stroke();

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
                    