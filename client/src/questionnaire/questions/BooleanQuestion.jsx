import React from 'react';

export default class BooleanQuestion extends React.Component {
  static displayName = 'BooleanQuestion';

  static propTypes = {
    id: React.PropTypes.number.isRequired,
    name: React.PropTypes.func.isRequired,
    text: React.PropTypes.string.isRequired,
    changeAnswer: React.PropTypes.func.isRequired,
    nextQuestion: React.PropTypes.func.isRequired,
    currentQuestion: React.PropTypes.func.isRequired,
    config: React.PropTypes.shape({
      minText: React.PropTypes.string.isRequired,
      maxText: React.PropTypes.string.isRequired,
    }).isRequired,
  };

  getInitialState() {
    return { value: '' };
  }

  answer(value) {
    this.setState({ value });
    this.props.changeAnswer(this.props.name, value);
    this.props.nextQuestion();
  }

  sayMin() {
    this.answer(0);
  }

  sayMax() {
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
