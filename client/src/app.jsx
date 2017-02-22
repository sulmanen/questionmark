import React from 'react';
import ReactDOM from 'react-dom';

import questions from './data/questions.json';
import intro from './data/intro.json';
import Questionnaire from './questionnaire/Questionnaire';

ReactDOM.render(<Questionnaire questions={questions} intro={intro} />,
window.document.getElementById('questions'));
