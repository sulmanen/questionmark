import fetch from 'isomorphic-fetch';
import Promise from 'bluebird';

export const nextQuestion = () =>
{
  type: 'NEXT_QUESTION',
};

export const previousQuestion = () =>
{
  type: 'PREVIOUS_QUESTION',
};

export const toggleSpinner = () =>
{
  type: 'TOGGLE_SPINNER',
};

export const startSpinner = () =>
{
  type: 'START_SPINNER',
};

export const stopSpinner = () =>
{
  type: 'STOP_SPINNER',
};


export const changeAnswer = (question, answer) =>
{
  type: 'CHANGE_ANSWER',
  question,
  answer
};

export const showError = () =>
{
  type: 'SHOW_ERROR',
};

export const sayThanks = () =>
{
  type: 'SAY_THANKS',
}

export const postAnswersRequest = () =>
{
  type: 'POST_ANSWERS_REQUEST'
}

export const postAnswers = answers => dispatch => {
    dispatch(postAnswersRequest);
    return fetch('anwers', {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ ...answers, sent: Date.now() })
    }).then((response) => {
      dispatch(postAnswersSuccess());
      return response;
    }, (err) => {
      dispatch(postAnswersFailure());
      return err;
    });
  }
}

export const postAnswersSuccess = () =>
{
  type: 'POST_ANSWERS_SUCCESS',
}

export const postAnswersFailure = () =>
{
  type: 'POST_ANSWERS_FAILURE',
}
