import { INITIAL_STATE } from '../';

const questionnaire = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'NEXT_QUESTION': {
      const nextQuestionIndex = this.state.currentQuestion + 1;
      return {
        ...state,
        currentQuestion: nextQuestionIndex,
        error: false,
      };
    }
    case 'PREVIOUS_QUESTION': {
      const previousQuestionIndex = this.state.currentQuestion - 1;
      return {
        ...state,
        currentQuestion: previousQuestionIndex,
        error: false,
      };
    }
    case 'POST_ANSWERS_REQUEST': {
      return {
        ...state,
        sending: true,
      };
    }
    case 'POST_ANSWERS_SUCCESS': {
      return {
        ...state,
        sending: false,
        thanks: true,
      };
    }
    case 'POST_ANSWERS_FAILURE': {
      return {
        ...state,
        sending: false,
        error: true,
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
        error: false,
      };
    }
    case 'SHOW_ERROR':
      return {
        ...state,
        sending: false,
        error: true,
      };
    case 'SAY_THANKS':
      return {
        ...state,
        displayThankYou: true,
        error: false,
      };
    default:
      return state;
  }
};

export default questionnaire;
