import React from "react";
import Api from './api'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      greeting: '',
      excited: false,
      message: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.getGreeting = this.getGreeting.bind(this);
  }

  handleInputChange (event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  async getGreeting () {
    const { name, greeting, excited } = this.state
    
    if (!name) {
      return
    }

    const res = await Api.getGreeting(name, greeting, excited)
    if (res.status === 200) {
      this.setState({
        message: res.data.message
      });
    } else {
      throw new Error(res.statusText)
    }
  }

  render () {
    return (
      <div>
        <div>
          <h1>Sample App</h1>
        </div>

        <br />

        <div>
          <label>Name:
            <input
              name="name"
              type="text"
              id="name"
              placeholder="Name"
              value={this.state.name}
              onChange={this.handleInputChange}
            />
          </label>
          <br />
          <label>Greeting:
            <input
              name="greeting"
              type="text"
              id="greeting"
              placeholder="Hello"
              value={this.state.greeting}
              onChange={this.handleInputChange}
            />
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              name="excited"
              id="excited"
              checked={this.state.excited}
              onChange={this.handleInputChange}
            />
          &nbsp; Excited
          </label>
          <br />
          <br />
          <button onClick={this.getGreeting}>Get a greeting</button>
        </div>

        <br />

        <div>
          <h2>{this.state.message}</h2>
        </div>

        <br />

      </div>
    );
  }
}

export default App;
