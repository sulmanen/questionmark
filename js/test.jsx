var STATE_KEY = 'tu2000survey';

var Questionnaire = React.createClass({
    timeout: null,
    nextQuestion: function() {
        var state = {
            answers: this.state.answers,
            currentQuestion: ++this.state.currentQuestion,
            sending: this.state.sending,
            displayThankYou: this.stateDisplayThankYou,
            displayError: false
        };

        localStorage.setItem(STATE_KEY, JSON.stringify(state));
        this.setState(state);
        if (this.state.currentQuestion === this.props.questions.length) {
            this.timeout = window.setTimeout(function() {
                this.sendAnswers();
            }.bind(this), 0);
        }
    },
    changeAnswer: function(name, value) {
        var answers = this.state.answers;
        answers[name] = value;
        window.clearTimeout(this.timeout);

        this.setState({
            answers: answers,
            currentQuestion: this.state.currentQuestion,
            sending: this.state.sending,
            displayThankYou: this.stateDisplayThankYou,
            displayError: false
        });
    },
    showError: function() {
        this.setState({
            answers: this.state.answers,
            currentQuestion: this.state.currentQuestion,
            sending: false,
            displayThankYou: this.state.displayThankYou,
            displayError: true
        });
    },
    sayThanks: function() {
        this.setState({
            answers: this.state.answers,
            currentQuestion: this.state.currentQuestion,
            sending: this.state.sending,
            displayThankYou: true,
            displayError: false
        });
    },
    getInitialState: function() {
        var savedState = localStorage.getItem(STATE_KEY);
        if (savedState) {
            return JSON.parse(savedState);
        } else {
            return {
                answers: {},
                currentQuestion: 0,
                sending: false,
                displayThankYou: false,
                displayError: false
            };
        }
    },
    toggleSpinner: function(isSending) {
        this.setState({
            answers: this.state.answers,
            currentQuestion: this.state.currentQuestion,
            sending: isSending,
            displayThankYou: this.state.displayThankYou
        });
    },
    startSpinner: function() {
        this.toggleSpinner(true);
    },
    stopSpinner: function() {
        this.toggleSpinner(false);
    },
    sendAnswers: function() {
        var request = new XMLHttpRequest(), data;
        this.startSpinner();
        request.onreadystatechange = function() {
            if (request.readyState == XMLHttpRequest.DONE ) {
                if(request.status == 201){
                    this.stopSpinner();
                    this.sayThanks();
                    localStorage.removeItem(STATE_KEY);
                }
                else {
                    this.showError();
                    localStorage.removeItem(STATE_KEY);
                }
            }
        }.bind(this);

        request.open("POST", "answers", true);
        request.setRequestHeader("Content-type", "application/json");
        request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        data = this.state.answers;
        data.sent = Date.now();
        request.send(JSON.stringify(data));
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

        var bubbles = this.props.questions.map(function(question) {
            if (this.state.currentQuestion >= question.id) {
                return <div key={question.id} className="q-bubble q-active"> </div>
            } else {
                return <div key={question.id} className="q-bubble"></div>
            }
        }.bind(this));

        return <div className={this.state.sending ? 'spinner q-groupwork': 'q-groupwork'}>

        <div style={{ display: this.state.displayThankYou ? 'block' : 'none'}}>
        <div className="checkmark"></div>
        <h1>Thank you!</h1>
        </div>
        <div style={{ display: this.state.displayError ? 'block' : 'none'}}>
        <div className="q-error">X</div>
        <h1>Oops. We messed up!</h1>
        </div>

        <div>

        </div>

       <section style={{ display: this.state.currentQuestion === 0 ? 'block' :'none'}}>
        <h1>{this.props.intro.title}</h1>
        <h3>{this.props.intro.text}</h3>
        </section>
        {questions}
        <div className="q-bubbles" style={{ display: this.state.currentQuestion === this.props.questions.length ? 'none' :'block'}}>{bubbles}</div>
        </div>;
    }
});

var EmailQuestion = React.createClass({
    getInitialState: function() {
        return { value: '', error: false};
    },
    onDone: function(e) {

        if (e.keyCode === 13) {
            if (e.target.checkValidity()) {
                this.setState({ value: e.target.value });
                this.props.changeAnswer(this.props.name, e.target.value);
                this.props.nextQuestion();
            } else {
                this.setState({ value: this.state.value, error: true });
            }
        } else {
            this.setState({ value: this.state.value, error: false });
        }

    },
    render: function() {
        return <div className="range-question" style={{display: this.props.currentQuestion === this.props.id ? 'block' : 'none'}}>
        <input className={this.state.error ? 'submitted q-email': 'q-email'} type="email" name={this.props.name} autoComplete="email" autoFocus="autofocus" maxLength="255" minLength="4" placeholder="Email" onKeyDown={this.onDone}/>
        <small className="q-email-error" style={{display: this.state.error ? 'block' : 'none'}}>Bogus email. Try harder.</small>
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
        <h1>{this.props.id + 1}.<br/> {this.props.text}</h1>

        <div className="q-range-value">{this.state.value}</div>

        <input className="q-range" type="range"
        onInput={this.onInput}
        onMouseDown={this.onInput}
        onMouseUp={this.props.nextQuestion}
        min={this.props.config.min} max={this.props.config.max}
        step={this.props.config.step}/>
        <div className="q-range-min"><small>{this.props.config.min}</small> {this.props.config.minText}</div>
        <div className="q-range-max">{this.props.config.maxText} <small>{this.props.config.max}</small></div>

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
                "min": 1980,
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
                "min": 1980,
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
                "min": 1970,
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
                "max": 10,
                "minText": "Disagree",
                "maxText": "Agree"
            }
        },
     {
            "id": 5,
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
            "id": 6,
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
            "id": 7,
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
            "id": 8,
            "text": "I have trouble forming a group for an assigment.",
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
            "id": 9,
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
            "id": 10,
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
            "id": 11,
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
            "id": 12,
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
            "id": 13,
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
            "id": 14,
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
var INTRO = {
    title: 'Welcome to the group work survey.',
    text: 'Please enter your email to start. It is only used to identify aalto students.'
}
ReactDOM.render(<Questionnaire questions={QUESTIONS} intro={INTRO}/>, document.getElementById('questions'));