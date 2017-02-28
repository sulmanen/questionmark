import React, { PropTypes } from 'react';
import classNames from 'classnames';

const QuestionnaireProgress = ({ questions, currentQuestion }) => {
  const questionnaireProgressView = questions.map((question) => {
    const bubbleClass = classNames({
      'q-bubble': true,
      'q-active': currentQuestion >= question.id,
    });

    return (<div key={question.id} className={bubbleClass} />);
  });
  return (<div>{questionnaireProgressView}</div>);
};

QuestionnaireProgress.PropTypes = {
  questions: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentQuestion: PropTypes.number.isRequired,
};

export default QuestionnaireProgress;
