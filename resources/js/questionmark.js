var request = new XMLHttpRequest();
var questions;
var answer = {

};

request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE ) {
        if(request.status === 200){
            questions = JSON.parse(request.responseText);
        }
        else {
            alert('We messed up. Please try again.');
        }
    }
};

request.open("GET", "questions", true);
request.send();
