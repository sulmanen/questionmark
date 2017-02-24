import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import questions from './data/questions.json';
import intro from './data/intro.json';
import Questionnaire from './questionnaire/Questionnaire';

const store = createStore();

render(
  <Provider store={store}>
    <Questionnaire questions={questions} intro={intro} />
  </Provider>,
  window.document.getElementById('questions'));
