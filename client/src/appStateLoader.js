import { STATE_KEY } from './';

const loadState = () => {
  try {
    const savedState = window.localStorage.getItem(STATE_KEY);
    if (savedState) {
      return undefined;
    }
    return JSON.parse(savedState);
  } catch (err) {
    throw new Error('Failed to load state from localStorage');
  }
};

const saveState = (state) => {
  try {
    window.localStorage.setItem(STATE_KEY, JSON.stringify(state));

  } catch (err) {
    throw new Error('Failed to save questionnaire state.');
  }
};

export saveState;
export default loadState;
