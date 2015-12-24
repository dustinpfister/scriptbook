var myHttp = (function(){

    // post to server
    var httpPost = function (header, data, done) {
        var xhr = new XMLHttpRequest();

        if(done === undefined){

            done = function(response){

                console.log('you did not give a callback for the response but here it is in the console: ');
                console.log(response);

            }

        }

        xhr.open('POST', '');
        xhr.setRequestHeader(header, JSON.stringify(data));

        xhr.onreadystatechange = function () {

            if (this.readyState === 4) {

                done(JSON.parse(this.response));

            }

        };

        xhr.send();

    };

    return {

        // send a wall post
        sendWallPost : function(data, done){

            httpPost('wallpost', data, done);

        }

    }

}());