const postAnswersReducer = (state, action) => {
  switch (action.type) {
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
        sayThanks: true,
      };
    }
    case 'POST_ANSWERS_FAILURE': {
      return {
        ...state,
        sending: false,
        error: true,
      };
    }
    default:
      return state;
  }
};

export default postAnswersReducer;
