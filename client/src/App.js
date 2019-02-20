import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
import SimpleAppBar from "./components/SimpleAppBar.js"
import FileUpload from "./components/FileUpload.js"
import Button from '@material-ui/core/Button';



import "./App.css";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            storageValue: 0,
            web3: null,
            accounts: null,
            contract: null,
            hash:""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setHash = this.setHash.bind(this);
    }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        this.runExample(this.state.hash);
    }

    setHash(hash){
        this.setState({hash:hash})
    }

  runExample = async (num) => {
    const { accounts, contract } = this.state;

    // Stores a given value
    await contract.methods.set(num).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
          <SimpleAppBar/>
          <br/>
          <FileUpload setHash={this.setHash}/>
          <br/>

          {this.state.hash !== "" &&

          <div>Hash: {this.state.hash}
          </div>
          }
          <br/>
          <br/>
          <Button variant="contained" color="secondary" onClick={() => this.handleSubmit()}>Store the Hash on the Ethereum Blockchain</Button>

      </div>
    );
  }
}

export default App;
