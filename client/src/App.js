import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import GetPieces from "./GetPieces";

class App extends Component {
  state = {
      loading: true, // initializing drizzle
      drizzleState: null
  };


  componentDidMount() {
    const { drizzle } = this.props;

    // subscribe to changes in the store
    // This callback function of subscribe() is called whenever the Drizzle store is updated
    this.unsubscribe = drizzle.store.subscribe(() => {

      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();

      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
  if (this.state.loading) return "Loading Drizzle...";
  return (
    <div className="App">
      <GetPieces
        drizzle={this.props.drizzle}
        drizzleState={this.state.drizzleState}
      />
      
    </div>
  );
}


}

export default App;
