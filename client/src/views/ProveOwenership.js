import React, { Component } from 'react'
import { DropzoneArea } from 'material-ui-dropzone';
import TimeStamperContract from "../contracts/TimeStamper.json";
import getWeb3 from "../utils/getWeb3";
import sha256 from 'crypto-js/sha256';
import enc from 'crypto-js/enc-hex'
import VerificationCard from '../components/VerificationCard.js';


export default class ProveOwenership extends Component {
  constructor(props) {
    super(props);
    this.state = {
        web3: null,
        contract: null,
        hash: "",
        file:null,
        imgSrc:'',
        fileHash:'',
        timestamp:0
    };

    // this.handleSubmit = this.handleSubmit.bind(this);
    // this.handleFileUpload = this.handleFileUpload.bind(this);
    // this.getStepContent = this.getStepContent.bind(this);
    this.getHashFromETH = this.getHashFromETH.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);

  };

  async getHashFromETH(e){
    var hash = sha256( e.target.result );
    var encrypted = hash.toString(enc.Base64);
    
    console.log(encrypted);

    const { accounts, tsContract } = this.state;

    //Read from the smart contract if this hash was submitted by this address
    var timestamp = await tsContract.methods.verify(encrypted).call();    
    timestamp = parseInt(timestamp)
    console.log(timestamp)

    const date = new Date(timestamp * 1000)
    
    //store the timestamp
    if (timestamp !== 0){
      this.setState({ 
        timestamp: timestamp,
        fileHash: encrypted,
        date: date.toString(),
        account: String(accounts[0])
      });
    }
  }

  handleFileUpload(files) {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = this.getHashFromETH.bind(this);
    reader.readAsBinaryString(file);
    this.setState({
      fileUploaded: true,
      file:file,
      imgSrc:reader.result,
  })
}
  
  componentDidMount = async () => {
    try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = TimeStamperContract.networks[networkId];
        const timeStamperContract = new web3.eth.Contract(
            TimeStamperContract.abi,
            deployedNetwork && deployedNetwork.address,
        )
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        this.setState({
            web3, 
            accounts, 
            tsContract: timeStamperContract
        });
    } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
    }

}
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
  }
    return (
      <div>
        <DropzoneArea onChange={this.handleFileUpload} filesLimit={1}/>
        {this.state.fileUploaded && <VerificationCard date={this.state.date} fileHash={this.state.fileHash} address={this.state.accounts[0]} timestamp={this.state.timestamp}/>}
      </div>
    )
  }
}
