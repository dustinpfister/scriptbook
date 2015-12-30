var _ = {

    // get by id
    get : function(id){ return document.getElementById(id);},

    // image to DataURL
    getImageDataURL : function(img) {
        
        // Create an empty canvas element
        var canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;

        // Copy the image contents to the canvas
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        console.log(dataURL.length);

        return dataURL;  //dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }

};