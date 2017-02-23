import React from 'react';

export default class RangeQuestion extends React.Component {

  static displayName = 'RangeQuestion';

  static propTypes = {
    id: React.PropTypes.number.isRequired,
    text: React.PropTypes.string.isRequired,
    config: React.PropTypes.shape({
      min: React.PropTypes.number.isRequired,
      max: React.PropTypes.number.isRequired,
      step: React.PropTypes.number,
      skip: React.PropTypes.bool,
      skipText: React.PropTypes.string,
      minText: React.PropTypes.string,
      maxText: React.PropTypes.string,
    }).isRequired,
    name: React.PropTypes.string.isRequired,
    changeAnswer: React.PropTypes.func.isRequired,
    nextQuestion: React.PropTypes.func.isRequired,
    currentQuestion: React.PropTypes.number.isRequired,
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
    this.setState({ value: e.target.value });
    this.props.changeAnswer(this.props.name, parseInt(e.target.value, 10));
  }

  skip = () => {
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
        value={this.state.value}
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
