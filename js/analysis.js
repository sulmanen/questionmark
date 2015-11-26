var request = new XMLHttpRequest(), answers;

request.onreadystatechange = function() {
    if (request.readyState == XMLHttpRequest.DONE ) {
        if(request.status == 200){
            process(JSON.parse(request.responseText));
        }
    }
};

request.open("GET", "answers", true);
request.setRequestHeader("Content-type", "application/json");
request.setRequestHeader("X-Requested-With", "XMLHttpRequest");

request.send();

function process(answers) {
    var genderFilter  = document.getElementById('gender').value,
        exchangeFilter = document.getElementById('exchange'),
        graduatedFilter = document.getElementById('graduated');

    QUESTIONS.slice(6).forEach(function(question) {
        showAnswer(question, answers);
    });
}

function showAnswer(question, answers) {

    var heading = document.createElement('h1');
    heading.appendChild(document.createTextNode(question.text));
    var value = document.createElement('h2');
    value.appendChild(document.createTextNode(
        getAnswer(question.name, answers)
    ));
    document.body.appendChild(heading);
    document.body.appendChild(value);

}

function getAnswer(answerKey, answers) {
    return Math.floor(answers.map(function(answer) {
        return answer[answerKey];
    }).reduce(function(previous, current) {
        return previous + current;
    }, 0) / answers.length);
}

function updateCount(answers) {
    document.getElementById('count')
        .appendChild(document.createTextNode(answers.length));

    return answers;
}
var QUESTIONS = [
        {
            "id": 0,
            "text": "Email",
            "name": "email",
            "type": "email",
            "value":"sulmanen@foo.bar",
            "config": {}
        },
    {
            "id": 1,
            "text": "I am a...",
            "name": "gender",
            "type": "boolean",
            "config" :{
                "min": 0,
                "max": 1,
                "minText": "Girl",
                "maxText": "Boy"
            }
        },
        {
            "id": 2,
            "text": "I am an exchange student.",
            "name": "exchange",
            "type": "boolean",
            "config" :{
                "min": 0,
                "max": 1,
                "minText": "No",
                "maxText": "Yes"
            }
        },
        {
            "id": 3,
            "text": "Started studies at Aalto University",
            "name": "enrolled",
            "type": "range",
            "config": {
                "min": 1990,
                "max": 2015,
                "step": 1
            }
        },
        {
            "id": 4,
            "text": "Graduated",
            "name": "graduated",
            "type": "range",
            "config": {
                "min": 1980,
                "max": 2015,
                "step": 1,
                "skip": true,
                "skipText": "Not yet"
            }
        },
        {
            "id": 5,
            "text": "Birth year",
            "name": "birth",
            "type": "range",
            "config": {
                "min": 1970,
                "max": 2000,
                "step": 1
            }
        },
        {
            "id": 6,
            "text": "I am better at groupwork due to my studies at Aalto University.",
            "name": "groupwork",
            "type": "range",
            "config" :{
                "min": 1,
                "max": 10,
                "minText": "Disagree",
                "maxText": "Agree"
            }
        },
     {
            "id": 7,
            "text": "Group work skills are important to me.",
            "name": "important",
            "type": "range",
            "config" :{
                "min": 1,
                "max": 10,
                "minText": "Disagree",
                "maxText": "Agree"
            }
     },
    {
            "id": 8,
            "text": "There are too many groupwork assigments at Aalto University",
            "name": "toomany",
            "type": "range",
            "config" :{
                "min": 1,
                "max": 10,
                "minText": "Disagree",
                "maxText": "Agree"
            }
    },
    {
            "id": 9,
            "text": "Group work helps me learn better.",
            "name": "helps_me",
            "type": "range",
            "config" :{
                "min": 1,
                "max": 10,
                "minText": "Disagree",
                "maxText": "Agree"
            }
    },
    {
            "id": 10,
            "text": "I have trouble forming a group for an assignment.",
            "name": "trouble",
            "type": "range",
            "config" :{
                "min": 1,
                "max": 10,
                "minText": "Disagree",
                "maxText": "Agree"
            }
    },
    {
            "id": 11,
            "text": "Our group gets enough support from our teacher during group work.",
            "name": "support",
            "type": "range",
            "config" :{
                "min": 1,
                "max": 10,
                "minText": "Disagree",
                "maxText": "Agree"
            }
    },
    {
            "id": 12,
            "text": "I run into conflicts in group work at Aalto.",
            "name": "conflicts",
            "type": "range",
            "config" :{
                "min": 1,
                "max": 10,
                "minText": "Disagree",
                "maxText": "Agree"
            }
    },
    {
            "id": 13,
            "text": "I am able to solve conflics in my group work.",
            "name": "solve_conflicts",
            "type": "range",
            "config" :{
                "min": 1,
                "max": 10,
                "minText": "Disagree",
                "maxText": "Agree"
            }
    },
    {
            "id": 14,
            "text": "Grading of group work is fair.",
            "name": "fair",
            "type": "range",
            "config" :{
                "min": 1,
                "max": 10,
                "minText": "Disagree",
                "maxText": "Agree"
            }
    },
    {
            "id": 15,
            "text": "My group work skills are improving at Aalto Universtiy.",
            "name": "improving",
            "type": "range",
            "config" :{
                "min": 1,
                "max": 10,
                "minText": "Disagree",
                "maxText": "Agree"
            }
    },
     {
            "id": 16,
            "text": "I would recommend Aalto University to a friend based on my experiences with group work here.",
            "name": "nps",
            "type": "range",
            "config" :{
                "min": 1,
                "max": 10,
                "minText": "Disagree",
                "maxText": "Agree"
            }
    }
];
