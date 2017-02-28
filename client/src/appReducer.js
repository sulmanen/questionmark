import { combineReducers } from 'redux';

import { questionnaireReducer, postAnswersReducer } from './questionnaire/';

export default combineReducers({
  questionnaireReducer
});
