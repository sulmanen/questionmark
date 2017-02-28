import React, { PropTypes } from 'react';

export default class RangeQuestion extends React.PureComponent {

  static displayName = 'RangeQuestion';

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
    name: PropTypes.string.isRequired,
    onChangeAnswer: PropTypes.func.isRequired,
    onNextQuestion: PropTypes.func.isRequired,
    currentQuestion: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    const { max, min } = props.config;

    if (max === 1) {
      this.state = { value: 1 };
    } else {
      this.state = { value: Math.floor((max - min) / 2) + min };
    }
  }

  onInput = (e) => {
    this.props.onChangeAnswer(this.props.name, parseInt(e.target.value, 10));
  }

  skip = () => {
    this.props.onChangeAnswer(this.props.name, 0);
    this.props.onNextQuestion();
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

      <div className="q-range-value">{this.state.value}</div>

      <input
        className="q-range"
        type="range"
        defaultValue={this.state.value}
        onInput={this.onInput}
        onMouseMove={this.onInput}
        onMouseDown={this.onInput}
        onMouseUp={this.props.onNextQuestion}
        onTouchStart={this.onInput}
        onTouchEnd={this.props.onNextQuestion}
        min={this.props.config.min} max={this.props.config.max}
        step={this.props.config.step}
      />

      <div className="q-range-min"><small>{this.props.config.min}</small> {this.props.config.minText}</div>
      <div className="q-range-max">{this.props.config.maxText} <small>{this.props.config.max}</small></div>
    </div>);
  }
}
