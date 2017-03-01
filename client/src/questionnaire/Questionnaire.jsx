import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { QuestionnaireProgress, Questions } from './';

import {
  nextQuestionCheckDone,
  previousQuestion,
  changeAnswer,
  showError,
  postAnswers,
} from './actions';

class Questionnaire extends React.Component {
  static displayName = 'Questionnaire';

  static propTypes = {
    onNextQuestionCheckDone: PropTypes.func.isRequired,
    onPreviousQuestion: PropTypes.func.isRequired,
    onChangeAnswer: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    onSendAnswers: PropTypes.func.isRequired,
    error: PropTypes.bool.isRequired,
    thanks: PropTypes.bool.isRequired,
    sending: PropTypes.bool.isRequired,
    currentQuestion: PropTypes.number.isRequired,
    answers: PropTypes.object.isRequired, // eslint-disable-line jsx/forbid-prop-types
    questions: PropTypes.arrayOf(PropTypes.object).isRequired,
    intro: PropTypes.shape({
      title: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    return (<div className={this.props.sending ? 'spinner q-groupwork' : 'q-groupwork'}>

      <div style={{ display: this.props.thanks ? 'block' : 'none' }}>
        <div className="checkmark" />
        <h1>Thank you!</h1>
      </div>

      <div style={{ display: this.props.error ? 'block' : 'none' }} >
        <div className="q-error">X</div>
        <h1>Oops. We messed up!</h1>
      </div>

      <button
        onClick={this.props.onPreviousQuestion}
        className="q-back fa fa-arrow-circle-left fa-5"
        style={{ display: this.props.currentQuestion > 0 && !this.props.thanks && !this.props.error && !this.props.sending ? 'block' : 'none' }}
      />

      <section style={{ display: this.props.currentQuestion === 0 ? 'block' : 'none' }}>
        <h1>{this.props.intro.title}</h1>
        <h5>{this.props.intro.text}</h5>
      </section>
      <Questions
        questions={this.props.questions}
        answers={this.props.answers}
        currentQuestion={this.props.currentQuestion}
        error={this.props.error}
        onChangeAnswer={this.props.onChangeAnswer}
        onNextQuestion={this.props.onNextQuestionCheckDone}
        onError={this.props.onError}
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

export default connect(({ questionnaire }) => ({
  currentQuestion: questionnaire.currentQuestion,
  sending: questionnaire.sending,
  answers: questionnaire.answers,
  error: questionnaire.error,
  thanks: questionnaire.thanks,
}), dispatch => ({
  onNextQuestionCheckDone: (currentQuestion, totalSize, answers) =>
    dispatch(nextQuestionCheckDone(currentQuestion, totalSize, answers)),
  onPreviousQuestion: () => dispatch(previousQuestion()),
  onChangeAnswer: (question, answer) => dispatch(changeAnswer(question, answer)),
  onError: () => dispatch(showError()),
  onSendAnswers: answers => dispatch(postAnswers(answers)),
}))(Questionnaire);
