var Questionnaire = React.createClass({
    timeout: null,
    nextQuestion: function() {
        this.setState({ answers: this.state.answers, currentQuestion: ++this.state.currentQuestion, sending: this.state.sending, displayThankYou: this.stateDisplayThankYou });
    },
    changeAnswer: function(name, value) {
        var answers = this.state.answers;
        answers[name] = value;
        this.setState({ answers: answers, currentQuestion: this.state.currentQuestion, sending: this.state.sending, displayThankYou: this.stateDisplayThankYou });

        if (this.state.currentQuestion >= (this.props.questions.length - 1)) {
            window.clearTimeout(this.timeout);
            window.setTimeout(function() {
                this.sendAnswers();
            }.bind(this), 1000);
        }
    },
    sayThanks: function() {
        this.setState({ answers: this.state.answers, currentQuestion: this.state.currentQuestion, sending: this.state.sending, displayThankYou: true });
    },
    getInitialState: function() {
        return {
            answers: {},
            currentQuestion: 0,
            sending: false,
            displayThankYou: false
        };
    },
    toggleSpinner: function(isSending) {
        this.setState({ answers: this.state.answers, currentQuestion: this.state.currentQuestion, sending: isSending, displayThankYou: this.state.displayThankYou});
    },
    startSpinner: function() {
        this.toggleSpinner(true);
    },
    stopSpinner: function() {
        this.toggleSpinner(false);
    },
    sendAnswers: function() {
        var request = new XMLHttpRequest();
        this.startSpinner();
        request.onreadystatechange = function() {
            if (request.readyState == XMLHttpRequest.DONE ) {
                if(request.status == 201){
                    this.stopSpinner();
                    this.sayThanks();
                }
                else {
                    alert('Oops!')
                }
            }
        }.bind(this);

        request.open("POST", "answers", true);
        request.setRequestHeader("Content-type", "application/json");
        request.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        request.send(JSON.stringify(this.state.answers));
    },
    render: function() {
        var questions = this.props.questions.map(function(question){
            if (question.type === 'email') {
                return <EmailQuestion currentQuestion={this.state.currentQuestion}
                id={question.id} key={question.id} name={question.name} text={question.text} nextQuestion={this.nextQuestion} changeAnswer={this.changeAnswer}/>
            }

            if (question.type === 'range') {
                return <RangeQuestion currentQuestion={this.state.currentQuestion} id={question.id} key={question.id} name={question.name} text={question.text} config={question.config} changeAnswer={this.changeAnswer} nextQuestion={this.nextQuestion}/>
            }
        }.bind(this));
        return<div className={this.state.sending ? 'spinner q-groupwork': 'q-groupwork'}><div style={{ display: this.state.displayThankYou ? 'block' : 'none'}}><h1>Thank you!</h1> <div className="checkmark"></div></div>{questions}</div>;
    }
});

var EmailQuestion = React.createClass({
    getInitialState: function() {
        return { value: ''};
    },
    onDone: function(e) {
        if (e.keyCode === 13) {
            this.setState({ value: e.target.value });
            this.props.changeAnswer(this.props.name, e.target.value);
            this.props.nextQuestion();
        }
    },
    render: function() {
        return <div className="range-question" style={{display: this.props.currentQuestion === this.props.id ? 'block' : 'none'}}>
        <input className="q-email" type="email" name={this.props.name} autoComplete="email" autoFocus="autofocus" maxLength="255" minLength="4" placeholder="Email" onKeyDown={this.onDone}/>
        </div>
    }

});
var RangeQuestion = React.createClass({
    getInitialState: function() {
        return { value: Math.floor((this.props.config.max - this.props.config.min)/2) + this.props.config.min };
    },
    onInput: function(e) {
        this.setState({value: e.target.value});
        this.props.changeAnswer(this.props.name, parseInt(e.target.value, 10));
    },
    render: function() {
        return <div className="range-question" style={{ display: this.props.currentQuestion === this.props.id ? 'block' : 'none'}}>
        <h1>{this.props.text}</h1>


        <input className="q-range" type="range"
        onInput={this.onInput}
        onMouseUp={this.props.nextQuestion}
        min={this.props.config.min} max={this.props.config.max}
        step={this.props.config.step}/>

        <div className="q-range-value">{this.state.value}</div>
        </div>
    }
});

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
            "id": 2,
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
            "id": 3,
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
            "id": 4,
            "text": "I am better at groupwork due to my studies at Aalto University.",
            "name": "groupwork",
            "type": "range",
            "config" :{
                "min": 1,
                "max": 10
            }
        }
];

ReactDOM.render(<Questionnaire questions={QUESTIONS} />, document.getElementById('questions'));