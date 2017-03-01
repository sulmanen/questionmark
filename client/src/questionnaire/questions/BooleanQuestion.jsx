import React, { PropTypes } from 'react';

export default class BooleanQuestion extends React.Component {
  static displayName = 'BooleanQuestion';

  static propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onChangeAnswer: PropTypes.func.isRequired,
    onNextQuestionCheckDone: PropTypes.func.isRequired,
    currentQuestion: PropTypes.number.isRequired,
    config: PropTypes.shape({
      minText: PropTypes.string.isRequired,
      maxText: PropTypes.string.isRequired,
    }).isRequired,
  };

  answer = (value) => {
    this.props.onChangeAnswer(this.props.name, value);
    this.props.onNextQuestionCheckDone(this.props.currentQuestion);
  }

  sayMin = () => {
    this.answer(0);
  }

  sayMax = () => {
    this.answer(1);
  }

  render() {
    return (
      <div
        className="range-question"
        style={{ display: this.props.currentQuestion === this.props.id ? 'block' : 'none' }}
      >
        <h1>{this.props.id + 1} <br />{this.props.text}</h1>
        <button onClick={this.sayMin} className="q-boolean-button">{this.props.config.minText}</button>
        <button onClick={this.sayMax} className="q-boolean-button">{this.props.config.maxText}</button>
      </div>
    );
  }
}
