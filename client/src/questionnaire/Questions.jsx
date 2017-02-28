import React from 'react';

import {
  BooleanQuestion,
  EmailQuestion,
  RangeQuestion,
} from './questions';

const Questions = ({
  questions,
  currentQuestion,
  error,
  onChangeAnswer,
  onNextQuestion,
  onError }) =>
  questions.map((question) => {
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
        return (<RangeQuestion
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
          oneNxtQuestion={onNextQuestion}
        />);
      }
    }
  });

  export default Questions;
