import React from 'react';
import classNames from 'classnames';

const QuestionnaireProgress = ({ questions, currentQuestion }) =>
questions.map((question) => {
  const bubbleClass = classNames({
    'q-bubble': true,
    'q-active': currentQuestion >= question.id,
  });

  return <div key={question.id} className={bubbleClass} />;
});

export default QuestionnaireProgress;
