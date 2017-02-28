import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { QuestionnaireProgress, Questions } from './';

import {
  nextQuestion,
  previousQuestion,
  changeAnswer,
  showError,
  sayThanks,
  postAnswers,
} from './actions';

class Questionnaire extends React.Component {
  static displayName = 'Questionnaire';

  static propTypes = {
    onNextQuestion: PropTypes.func.isRequired,
    onPreviousQuestion: PropTypes.func.isRequired,
    onChangeAnswer: PropTypes.func.isRequired,
    onShowError: PropTypes.func.isRequired,
    onSendAnswers: PropTypes.func.isRequired,
    displayError: PropTypes.bool.isRequired,
    displayThankYou: PropTypes.bool.isRequired,
    sending: PropTypes.bool.isRequired,
    currentQuestion: PropTypes.number.isRequired,
    answers: PropTypes.arrayOf(React.PropTypes.object).isRequired,
    questions: PropTypes.arrayOf(React.PropTypes.object).isRequired,
    intro: PropTypes.shape({
      title: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired,
  };

  nextQuestion = () => {
    if (this.props.currentQuestion === this.props.questions.length) {
      this.props.onSendAnswers(this.props.answers);
    }
  }

  render() {
    return (<div className={this.props.sending ? 'spinner q-groupwork' : 'q-groupwork'}>

      <div style={{ display: this.props.displayThankYou ? 'block' : 'none' }}>
        <div className="checkmark" />
        <h1>Thank you!</h1>
      </div>

      <div style={{ display: this.props.displayError ? 'block' : 'none' }} >
        <div className="q-error">X</div>
        <h1>Oops. We messed up!</h1>
      </div>

      <button
        onClick={this.props.onPreviousQuestion}
        className="q-back fa fa-arrow-circle-left fa-5"
        style={{ display: this.props.currentQuestion > 0 && !this.props.displayThankYou && !this.props.displayError && !this.props.sending ? 'block' : 'none' }}
      />

      <section style={{ display: this.props.currentQuestion === 0 ? 'block' : 'none' }}>
        <h1>{this.props.intro.title}</h1>
        <h5>{this.props.intro.text}</h5>
      </section>
      <Questions
        questions={this.props.questions}
        currentQuestion={this.props.currentQuestion}
        onChangeAnswer={this.props.onChangeAnswer}
        onNextQuestion={this.props.onNextQuestion}
        onShowError={this.props.onShowError}
      />
      <div className="q-bubbles" style={{ display: this.props.currentQuestion === this.props.questions.length ? 'none' : 'block' }}>
        <QuestionnaireProgress
          questions={this.props.questions}
          currentQuestion={this.props.currentQuestion}
        />
      </div>
    </div>);
  }
}

export default connect(state =>
 {
  currentQuestion: state.currentQuestion,
  sending: state.sending,
  answers: state.answers,
  displayError: state.displayError,
  displayThankYou: state.displayThankYou,
},
dispatch => {
  onNextQuestion: () => dispatch(nextQuestion()),
  onPreviousQuestion: () => dispatch(previousQuestion()),
  onChangeAnswer: (question, answer) => dispatch(changeAnswer(question, answer)),
  onShowError: () => dispatch(showError()),
  onSayThanks: () => dispatch(sayThanks()),
  onSendAnswers: answers => dispatch(postAnswers(answers)),
})(Questionnaire);
