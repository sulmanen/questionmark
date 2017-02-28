import { INITIAL_STATE } from '../';

const questionnaireReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'NEXT_QUESTION': {
      const nextQuestionIndex = this.state.currentQuestion + 1;
      return {
        ...state,
        currentQuestion: nextQuestionIndex,
        displayError: false,
      };
    }
    case 'PREVIOUS_QUESTION': {
      const previousQuestionIndex = this.state.currentQuestion - 1;
      return {
        ...state,
        currentQuestion: previousQuestionIndex,
        displayError: false,
      };
    }
    case 'CHANGE_ANSWER': {
      const answers = {
        ...state.answers,
      };

      answers[action.questionId] = action.answer;

      return {
        ...state,
        answers,
        displayError: false,
      };
    }
    case 'SHOW_ERROR':
      return {
        ...state,
        sending: false,
        displayError: true,
      };
    case 'SAY_THANKS':
      return {
        ...state,
        displayThankYou: true,
        displayError: false,
      };
    default:
      return state;
  }
};

export default questionnaireReducer;
