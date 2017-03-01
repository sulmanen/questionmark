import React, { PropTypes } from 'react';

export default class RangeQuestion extends React.PureComponent {

  static displayName = 'RangeQuestion';

  static defaultProps = {
    answer: null,
  };

  static propTypes = {
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    config: PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
      step: PropTypes.number,
      skip: PropTypes.bool,
      skipText: PropTypes.string,
      minText: PropTypes.string,
      maxText: PropTypes.string,
    }).isRequired,
    defaultValue: PropTypes.number.isRequired,
    answer: PropTypes.number,
    name: PropTypes.string.isRequired,
    onChangeAnswer: PropTypes.func.isRequired,
    onNextQuestionCheckDone: PropTypes.func.isRequired,
    currentQuestion: PropTypes.number.isRequired,
  };

  onInput = (e) => {
    this.props.onChangeAnswer(this.props.name, parseInt(e.target.value, 10));
  }

  handleAnswer = (e) => {
    this.props.onChangeAnswer(this.props.name, parseInt(e.target.value, 10));
    this.props.onNextQuestionCheckDone(this.props.currentQuestion);
  }

  skip = () => {
    this.props.onChangeAnswer(this.props.name, 0);
    this.props.onNextQuestionCheckDone(this.props.currentQuestion);
  }

  render() {
    return (<div className="range-question" style={{ display: this.props.currentQuestion === this.props.id ? 'block' : 'none' }}>
      <h1>{this.props.id + 1}<br /> {this.props.text}</h1>

      <button
        className="q-skip" onClick={this.skip}
        style={{ display: this.props.config.skip === true ? 'block' : 'none' }}
      >
        {this.props.config.skipText} <span className="q-skip-arrow">&gt;&gt;</span>
      </button>

      <div className="q-range-value">{this.props.answer || this.props.defaultValue}</div>

      <input
        className="q-range"
        type="range"
        defaultValue={this.props.defaultValue}
        onInput={this.onInput}
        onMouseMove={this.onInput}
        onMouseDown={this.onInput}
        onMouseUp={this.handleAnswer}
        onTouchStart={this.onInput}
        onTouchEnd={this.handleAnswer}
        min={this.props.config.min} max={this.props.config.max}
        step={this.props.config.step}
      />

      <div className="q-range-min"><small>{this.props.config.min}</small> {this.props.config.minText}</div>
      <div className="q-range-max">{this.props.config.maxText} <small>{this.props.config.max}</small></div>
    </div>);
  }
}
