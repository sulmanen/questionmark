var Questionnaire = React.createClass({
    nextQuestion: function() {
        this.setState({ answers: this.state.answers, currentQuestion: ++this.state.currentQuestion});
        console.log(this.state);
    },
    changeAnswer: function(name, value) {
        var answers = this.state.answers;
        answers[name] = value;
        this.setState({ answers: answers, currentQuestion: this.state.currentQuestion });
    },
    getInitialState: function() {
        return {
            answers: {}, currentQuestion: 0
        };
    },
    send: function() {
        alert(1);
    },
    render: function() {
        var questions = this.props.questions.map(function(question){
            if (question.type === 'range') {
                return <RangeQuestion currentQuestion={this.state.currentQuestion} id={question.id} key={question.id} name={question.name} text={question.text} config={question.config} changeAnswer={this.changeAnswer} nextQuestion={this.nextQuestion}/>
            }
        }.bind(this));
        return<div>{questions} <button onClick={this.send}>Send</button></div>;
    }
});

var RangeQuestion = React.createClass({
    getInitialState: function() {
        return { value: Math.floor((this.props.config.max -this.props.config.min)/2)};
    },
    onInput: function(e) {
        this.setState({value: e.target.value});
        this.props.changeAnswer(this.props.name, e.target.value);
    },
    render: function() {
        return <div style={{display: this.props.currentQuestion === this.props.id ? 'block' : 'none'}}>
        <h1>{this.props.text}</h1>

        <div>{this.state.value}</div>
        <input className="q-range" type="range"
        onInput={this.onInput}
        onMouseUp={this.props.nextQuestion}
        min={this.props.config.min} max={this.props.config.max}
        step={this.props.config.step}/>

        <div>{this.props.config.min}</div><div>{this.props.config.max}</div></div>
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
        "id": 0,
            "text": "Started studies",
            "name": "enrolled",
            "type": "range",
            "config": {
                "min": 1960,
                "max": 2015,
                "step": 1
            }
        },
        {
            "id": 1,
            "text": "Graduated",
            "name": "graduated",
            "type": "range",
            "config": {
                "min": 1970,
                "max": 2015,
                "step": 1
            }
        },
        {
            "id": 2,
            "text": "Birth year",
            "name": "birth",
            "type": "range",
            "config": {
                "min": 1940,
                "max": 2000,
                "step": 1
            }
        },
        {
            "id": 3,
            "text": "I am better at groupwork due to my studies at Aalto University.",
            "name": "groupwork",
            "type": "range",
            "config" :{
                "min": 1,
                "max": 10
            }
        }
];

ReactDOM.render(<Questionnaire questions={QUESTIONS} />, document.getElementById('example'));