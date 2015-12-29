postType.addJSON(
    {
        postType : 'quickcanvas',
        rel : 'blank',
        json: "\"// Blank Quick Canvas Template\\n\\n(function(){\\n\\n // get references to the canvas and canvas context\\n var canvas = document.getElementById('quickcanvas_canvas'),\\n context = canvas.getContext('2d'),\\n\\t\\n\\n // additional variables that have to do with your quick canvas should go here\\n\\n\\n // start will be called once before running main loop\\n start = function(){\\n\\n loop();\\n\\n },\\n\\n // what to do on each frame tick\\n update = function(){\\n\\n // update your state here\\n\\n },\\n\\n // what to draw to canvas\\n draw = function(ctx){\\n\\n // background\\n ctx.fillStyle='#000000';\\n ctx.fillRect(0,0,canvas.width,canvas.height);\\n\\n },\\n\\n // main app loop\\n loop = function(){\\n\\n requestAnimationFrame(loop);\\n\\n update();\\n draw(context);\\n\\n\\n };\\n\\n // start it (click run button to start this demo)\\n start();\\n \\n\\n}());\""

    }
);