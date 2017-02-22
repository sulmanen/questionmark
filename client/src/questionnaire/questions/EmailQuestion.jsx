import React from 'react';

export default class EmailQuestion extends React.Component {
  static displayName = 'EmailQuestion';

  static propTypes = {
    id: React.PropTypes.number.isRequired,
    name: React.PropTypes.string.isRequired,
    changeAnswer: React.PropTypes.func.isRequired,
    nextQuestion: React.PropTypes.func.isRequired,
    currentQuestion: React.PropTypes.number.isRequired,
  };

  state = {
    value: '',
    error: false,
  };

  onDone = (e) => {
    if (e.keyCode === 13) {
      this.submit(e.target.checkValidity(), e.target.value);
    } else {
      this.setState({ value: this.state.value, error: false });
    }
  }

  go = () => {
    const input = window.document.getElementById('q-email');
    this.submit(input.checkValidity(), input.value);
  }

  submit = (valid, value) => {
    if (valid) {
      this.setState({ value });
      this.props.changeAnswer(this.props.name, value);
      this.props.nextQuestion();
    } else {
      this.setState({ value: this.state.value, error: true });
    }
  }

  render() {
    return (
      <div
        className="range-question"
        style={{ display: this.props.currentQuestion === this.props.id ? 'block' : 'none' }}
      >
        <input
          required
          id="q-email"
          className={this.state.error ? 'submitted q-email' : 'q-email'}
          type="email"
          name={this.props.name}
          autoComplete="email"
          autoFocus="autofocus"
          maxLength="255"
          minLength="4"
          placeholder="Email"
          onKeyDown={this.onDone}
        />

        <small
          className="q-email-error"
          style={{ display: this.state.error ? 'block' : 'none' }}
        >Bogus email. Try harder.
        </small>
        <br />
        <button onClick={this.go} className="q-boolean-button">Go!</button>
      </div>
    );
  }
  }
