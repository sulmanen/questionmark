import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';

import questions from './data/questions.json';
import intro from './data/intro.json';
import Questionnaire from './questionnaire/Questionnaire';
import appReducer from './appReducer';

const store = createStore(appReducer,
  applyMiddleware(thunk, promise, createLogger()));

render(
  <Provider store={store}>
    <Questionnaire questions={questions} intro={intro} />
  </Provider>,
  window.document.getElementById('questions'));
