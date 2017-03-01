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

const Questionnaire = ({
  onNextQuestionCheckDone,
  onPreviousQuestion,
  onChangeAnswer,
  onError,
  error,
  thanks,
  sending,
  currentQuestion,
  answers,
  questions,
  intro,
}) =>
(<div className={sending ? 'spinner q-groupwork' : 'q-groupwork'}>

  <div style={{ display: thanks ? 'block' : 'none' }}>
    <div className="checkmark" />
    <h1>Thank you!</h1>
  </div>

  <div style={{ display: error ? 'block' : 'none' }} >
    <div className="q-error">X</div>
    <h1>Oops. We messed up!</h1>
  </div>

  <button
    onClick={onPreviousQuestion}
    className="q-back fa fa-arrow-circle-left fa-5"
    style={{ display: currentQuestion > 0 && !thanks && !error && !sending ? 'block' : 'none' }}
  />

  <section style={{ display: currentQuestion === 0 ? 'block' : 'none' }}>
    <h1>{intro.title}</h1>
    <h5>{intro.text}</h5>
  </section>
  <Questions
    questions={questions}
    answers={answers}
    currentQuestion={currentQuestion}
    error={error}
    onChangeAnswer={onChangeAnswer}
    onNextQuestionCheckDone={onNextQuestionCheckDone}
    onError={onError}
  />
  <div
    className="q-bubbles"
    style={{ display: currentQuestion === questions.length ? 'none' : 'block' }}
    >
      <QuestionnaireProgress
        questions={questions}
        currentQuestion={currentQuestion}
      />
    </div>
  </div>);

  Questionnaire.propTypes = {
    onNextQuestionCheckDone: PropTypes.func.isRequired,
    onPreviousQuestion: PropTypes.func.isRequired,
    onChangeAnswer: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
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

  export default connect(({ questionnaire }) => ({
    currentQuestion: questionnaire.currentQuestion,
    sending: questionnaire.sending,
    answers: questionnaire.answers,
    error: questionnaire.error,
    thanks: questionnaire.thanks,
  }), (dispatch, ownProps) => ({
    onNextQuestionCheckDone: currentQuestion =>
    dispatch(nextQuestionCheckDone(currentQuestion,
      ownProps.questions.length, ownProps.answers)),
      onPreviousQuestion: () => dispatch(previousQuestion()),
      onChangeAnswer: (question, answer) => dispatch(changeAnswer(question, answer)),
      onError: () => dispatch(showError()),
      onSendAnswers: answers => dispatch(postAnswers(answers)),
    }))(Questionnaire);
