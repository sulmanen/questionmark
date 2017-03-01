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
  onNextQuestion,
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
            onNextQuestion={onNextQuestion}
            onChangeAnswer={onChangeAnswer}
          />);
        }

        case 'range': {
          const { max, min } = question.config;

          return (<RangeQuestion
            currentQuestion={currentQuestion}
            defaultValue={max === 1 ? 1 : Math.floor((max - min) / 2) + min}
            answer={answers[question.name]}
            id={question.id}
            key={question.id}
            name={question.name}
            text={question.text}
            config={question.config}
            onChangeAnswer={onChangeAnswer}
            onNextQuestion={onNextQuestion}
          />);
        }
        case 'boolean':
        default: {
          return (<BooleanQuestion
            currentQuestion={currentQuestion}
            id={question.id}
            key={question.id}
            name={question.name}
            text={question.text}
            config={question.config}
            onChangeAnswer={onChangeAnswer}
            onNextQuestion={onNextQuestion}
          />);
        }
      }
    });
    return (<div>{questionsView}</div>);
  };
  
  Questions.PropTypes = {
    questions: PropTypes.arrayOf(PropTypes.object).isRequired,
    currentQuestion: PropTypes.number.isRequired,
    error: PropTypes.bool.isRequired,
    onChangeAnswer: PropTypes.func.isRequired,
    onNextQuestion: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
  };
  export default Questions;
