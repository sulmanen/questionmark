import React from 'react';

export default class RangeQuestion extends React.Component {

  static displayName = 'RangeQuestion';

  static propTypes = {
    id: React.PropTypes.int.isRequired,
    text: React.PropTypes.int.isRequired,
    config: React.PropTypes.shape({
      min: React.PropTypes.number.isRequired,
      max: React.PropTypes.number.isRequired,
      step: React.PropTypes.number.isRequired,
      skip: React.PropTypes.boolean.isRequired,
      skipText: React.PropTypes.string,
      minText: React.PropTypes.string,
      maxText: React.PropTypes.string,
    }).isRequired,
    name: React.PropTypes.string.isRequired,
    changeAnswer: React.PropTypes.func.isRequired,
    nextQuestion: React.PropTypes.func.isRequired,
    currentQuestion: React.PropType.int.isRequired,
  };

  getInitialState() {
    return this.props.config.max === 1 ? { value: 1 } : { value: this.getInitialValue() };
  }

  onInput(e) {
    this.setState({ value: e.target.value });
    this.props.changeAnswer(this.props.name, parseInt(e.target.value, 10));
  }

  getInitialValue() {
    return Math.floor((this.props.config.max - this.props.config.min) / 2) + this.props.config.min;
  }

  skip() {
    this.setState({ value: 0 });
    this.props.changeAnswer(this.props.name, 0);
    this.props.nextQuestion();
  }

  render() {
    return (<div className="range-question" style={{ display: this.props.currentQuestion === this.props.id ? 'block' : 'none' }}>
      <h1>{this.props.id + 1}<br /> {this.props.text}</h1>

      <button
        className="q-skip" onClick={this.skip}
        style={{ display: this.props.config.skip === true ? 'block' : 'none' }}
      >
        {this.props.config.skipText} <span className="q-skip-arrow">&gt&gt</span>
      </button>

      <div className="q-range-value">{this.state.value}</div>

      <input
        className="q-range"
        type="range"
        onInput={this.onInput}
        onMouseMove={this.onInput}
        onMouseDown={this.onInput}
        onMouseUp={this.props.nextQuestion}
        onTouchStart={this.onInput}
        onTouchEnd={this.props.nextQuestion}
        min={this.props.config.min} max={this.props.config.max}
        step={this.props.config.step}
      />

      <div className="q-range-min"><small>{this.props.config.min}</small> {this.props.config.minText}</div>
      <div className="q-range-max">{this.props.config.maxText} <small>{this.props.config.max}</small></div>
    </div>);
  }
}
