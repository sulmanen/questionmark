import React, { PropTypes } from 'react';

export default class EmailQuestion extends React.Component {
  static displayName = 'EmailQuestion';

  static propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    currentQuestion: PropTypes.number.isRequired,
    error: PropTypes.bool.isRequired,
    onChangeAnswer: PropTypes.func.isRequired,
    onNextQuestion: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
  };

  onDone = (e) => {
    if (e.keyCode === 13) {
      this.submit(e.target.checkValidity(), e.target.value);
    }
  }

  go = () => {
    const input = window.document.getElementById('q-email');
    this.submit(input.checkValidity(), input.value);
  }

  submit = (valid, value) => {
    if (valid) {
      this.props.onChangeAnswer(this.props.name, value);
      this.props.onNextQuestion();
    } else {
      this.props.onError();
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
          className={this.props.error ? 'submitted q-email' : 'q-email'}
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
          style={{ display: this.props.error ? 'block' : 'none' }}
        >Bogus email. Try harder.
        </small>
        <br />
        <button onClick={this.go} className="q-boolean-button">Go!</button>
      </div>
    );
  }
  }
