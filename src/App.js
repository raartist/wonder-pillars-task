import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Component } from "react";
import Invoice from "./Invoice";

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Invoice</h1>
        <Invoice />
      </div>
    );
  }
}

export default App;
