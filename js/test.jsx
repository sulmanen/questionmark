var Questionnaire = React.createClass({
    render: function() {
        var questions = this.props.questions.map(function(question){
            return <Question key={question.id} name={question.name}/>
        });
        return<div>{questions}</div>;
    }
});

var Question = React.createClass({
    render: function() {
        return <h1>{this.props.name}</h1>
    }
});

var QUESTIONS = [
        {
            "id": "0",
            "text": "Email",
            "name": "email",
            "type": "email",
            "value":"sulmanen@foo.bar",
            "config": {}
        },
        {
        "id": "1",
            "text": "Started studies",
            "name": "enrolled",
            "type": "range",
            "config": {
                "from": 1960,
                "to": 2015,
                "delta": 1
            }
        },
        {
            "id": "2",
            "text": "Graduated",
            "name": "graduated",
            "type": "range",
            "config": {
                "from": 1970,
                "to": 2015,
                "delta": 1
            }
        },
        {
            "id": "3",
            "text": "Birth year",
            "name": "birth",
            "type": "rage",
            "config": {
                "from": 1940,
                "to": 2000,
                "delta": 1
            }
        },
        {
            "id": "4",
            "text": "I am better at groupwork due to my studies at Aalto University.",
            "name": "groupwork",
            "type": "range",
            "config" :{
                "from": 1,
                "to": 10
            }
        }
];

ReactDOM.render(<Questionnaire questions={QUESTIONS} />, document.getElementById('example'));