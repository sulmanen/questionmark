import React, { PropTypes } from 'react';

import {
  BooleanQuestion,
  EmailQuestion,
  RangeQuestion,
} from './questions';

const Questions = ({
  questions,
  answers,
  currentQuestion,
  error,
  onChangeAnswer,
  onNextQuestionCheckDone,
  onError }) => {
  const questionsView = questions.map((question) => {
    switch (question.type) {
      case 'email': {
        return (<EmailQuestion
          currentQuestion={currentQuestion}
          id={question.id}
          key={question.id}
          name={question.name}
          text={question.text}
          error={error}
          onError={onError}
          onNextQuestionCheckDone={onNextQuestionCheckDone}
          onChangeAnswer={onChangeAnswer}
        />);
      }

      case 'range': {
        const { max, min } = question.config;

        return (
          <RangeQuestion
            currentQuestion={currentQuestion}
            defaultValue={max === 1 ? 1 : Math.floor((max - min) / 2) + min}
            answer={answers[question.name]}
            id={question.id}
            key={question.id}
            name={question.name}
            text={question.text}
            config={question.config}
            onChangeAnswer={onChangeAnswer}
            onNextQuestionCheckDone={onNextQuestionCheckDone}
          />);
      }
      case 'boolean':
      default: {
        return (
          <BooleanQuestion
            currentQuestion={currentQuestion}
            id={question.id}
            key={question.id}
            name={question.name}
            text={question.text}
            config={question.config}
            onChangeAnswer={onChangeAnswer}
            onNextQuestionCheckDone={onNextQuestionCheckDone}
          />);
      }
    }
  });
  return (<div>{questionsView}</div>);
};

Questions.propTypes = {
  answers: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  questions: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentQuestion: PropTypes.number.isRequired,
  error: PropTypes.bool.isRequired,
  onChangeAnswer: PropTypes.func.isRequired,
  onNextQuestionCheckDone: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};
export default Questions;
