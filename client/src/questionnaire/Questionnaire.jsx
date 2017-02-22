import React from 'react';

import {
  BooleanQuestion,
  EmailQuestion,
  RangeQuestion,
} from './questions';

let timeout;
const STATE_KEY = 'survey-2017';

export default class Questionnaire extends React.Component {
  static displayName = 'Questionnaire';

  static propTypes = {
    questions: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    intro: React.PropTypes.shape({
      title: React.PropTypes.string.isRequired,
      text: React.PropTypes.string.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    const savedState = window.localStorage.getItem(STATE_KEY);
    if (savedState) {
      this.state = JSON.parse(savedState);
    }

    this.state = {
      answers: {},
      currentQuestion: 0,
      sending: false,
      displayThankYou: false,
      displayError: false,
    };
  }

  nextQuestion = () => {
    const nextQuestionIndex = this.state.currentQuestion + 1;
    const state = {
      answers: this.state.answers,
      currentQuestion: nextQuestionIndex,
      sending: this.state.sending,
      displayThankYou: this.stateDisplayThankYou,
      displayError: false,
    };

    window.localStorage.setItem(STATE_KEY, JSON.stringify(state));
    this.setState(state);

    if (this.state.currentQuestion === this.props.questions.length) {
      this.sendAnswers();
    }
  }

  goBack = () => {
    const previousQuestionIndex = this.state.currentQuestion - 1;

    const state = {
      answers: this.state.answers,
      currentQuestion: previousQuestionIndex,
      sending: this.state.sending,
      displayThankYou: this.stateDisplayThankYou,
      displayError: false,
    };
    window.localStorage.setItem(STATE_KEY, JSON.stringify(state));
    this.setState(state);
  }

  changeAnswer = (name, value) => {
    const answers = this.state.answers;
    answers[name] = value;
    window.clearTimeout(timeout);

    this.setState({
      answers,
      currentQuestion: this.state.currentQuestion,
      sending: this.state.sending,
      displayThankYou: this.stateDisplayThankYou,
      displayError: false,
    });
  }

  showError = () => {
    this.setState({
      answers: this.state.answers,
      currentQuestion: this.state.currentQuestion,
      sending: false,
      displayThankYou: this.state.displayThankYou,
      displayError: true,
    });
  }

  sayThanks = () => {
    this.setState({
      answers: this.state.answers,
      currentQuestion: this.state.currentQuestion,
      sending: this.state.sending,
      displayThankYou: true,
      displayError: false,
    });
  }

  toggleSpinner(isSending) {
    this.setState({
      answers: this.state.answers,
      currentQuestion: this.state.currentQuestion,
      sending: isSending,
      displayThankYou: this.state.displayThankYou,
    });
  }

  startSpinner = () => {
    this.toggleSpinner(true);
  }

  stopSpinner = () => {
    this.toggleSpinner(false);
  }

  sendAnswers = () => {
    const request = new window.XMLHttpRequest();
    const data = { ...this.state.answers, sent: Date.now() };

    this.startSpinner();
    request.onreadystatechange = () => {
      if (request.readyState === window.XMLHttpRequest.DONE) {
        if (request.status === 201) {
          this.stopSpinner();
          this.sayThanks();
          window.localStorage.removeItem(STATE_KEY);
        } else {
          this.showError();
          window.localStorage.removeItem(STATE_KEY);
        }
      }
    };

    request.open('POST', 'answers', true);
    request.setRequestHeader('Content-type', 'application/json');
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    request.send(JSON.stringify(data));
  }

  render() {
    const questions = this.props.questions.map((question) => {
      if (question.type === 'email') {
        return (<EmailQuestion
          currentQuestion={this.state.currentQuestion}
          id={question.id}
          key={question.id}
          name={question.name}
          text={question.text}
          nextQuestion={this.nextQuestion}
          changeAnswer={this.changeAnswer}
        />);
      }

      if (question.type === 'range') {
        return (<RangeQuestion
          currentQuestion={this.state.currentQuestion}
          id={question.id}
          key={question.id}
          name={question.name}
          text={question.text}
          config={question.config}
          changeAnswer={this.changeAnswer}
          nextQuestion={this.nextQuestion}
        />);
      }

      if (question.type === 'boolean') {
        return (<BooleanQuestion
          currentQuestion={this.state.currentQuestion}
          id={question.id}
          key={question.id}
          name={question.name}
          text={question.text}
          config={question.config}
          changeAnswer={this.changeAnswer}
          nextQuestion={this.nextQuestion}
        />);
      }

      return null;
    });

    const bubbles = this.props.questions.map((question) => {
      if (this.state.currentQuestion >= question.id) {
        return <div key={question.id} className="q-bubble q-active" />;
      }

      return <div key={question.id} className="q-bubble" />;
    });

    return (<div className={this.state.sending ? 'spinner q-groupwork' : 'q-groupwork'}>

      <div style={{ display: this.state.displayThankYou ? 'block' : 'none' }}>
        <div className="checkmark" />
        <h1>Thank you!</h1>
      </div>
      <div style={{ display: this.state.displayError ? 'block' : 'none' }} >
        <div className="q-error">X</div>
        <h1>Oops. We messed up!</h1>
      </div>

      <button
        onClick={this.goBack}
        className="q-back fa fa-arrow-circle-left fa-5"
        style={{ display: this.state.currentQuestion > 0 && !this.state.displayThankYou && !this.state.displayError && !this.state.sending ? 'block' : 'none' }}
      />

      <section style={{ display: this.state.currentQuestion === 0 ? 'block' : 'none' }}>
        <h1>{this.props.intro.title}</h1>
        <h5>{this.props.intro.text}</h5>
      </section>
      {questions}
      <div className="q-bubbles" style={{ display: this.state.currentQuestion === this.props.questions.length ? 'none' : 'block' }}>{bubbles}</div>
    </div>);
  }
}