import React, { Component } from 'react'

import TimeStamperContract from "../contracts/TimeStamper.json";

import getWeb3 from "../utils/getWeb3";
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { DropzoneArea } from 'material-ui-dropzone';
import HashContainer from '../components/HashContainer.js';
import sha256 from 'crypto-js/sha256';
import enc from 'crypto-js/enc-hex'
import ETHUpload from '../components/ETHUpload.js';


export default class TimestampIP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storageValue: 0,
            web3: null,
            accounts: null,
            contract: null,
            hash: "",
            fileSelected: false,
            fileUploaded: false,
            hashSubmitted: false,
            storedOnETH:false,
            activeStep: 0,
            file:null,
            imgSrc:'',
            fileHash:''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.getStepContent = this.getStepContent.bind(this);
        this.handleHashing = this.handleHashing.bind(this);

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
    };

    handleNext = () => {
        this.setState(state => ({
            activeStep: state.activeStep + 1,
        }));
    };

    handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }));
    };

    handleReset = () => {
        this.setState({
            activeStep: 0,
        });
    };

    handleSubmit() {
        this.storeHash(this.state.fileHash);
    }

    hashFile(event){
        var hash = sha256( event.target.result);
        var encrypted = hash.toString(enc.Base64);
        this.setState({ fileHash:encrypted });
    }

    handleHashing = () => {
        var file = this.state.file;
        var reader = new FileReader();
        reader.onload = this.hashFile.bind(this);
        reader.readAsBinaryString(file);
    }

    handleFileUpload(files) {
        const file = files[0];
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            this.setState({
                fileUploaded: true,
                file:file,
                imgSrc:reader.result
            })
        }, false)
        reader.readAsDataURL(file);
        this.handleNext()
    }


    storeHash = async (hash) => {
        const {accounts, tsContract} = this.state;
        // Stores a given value
        await tsContract.methods.timestamp(hash).send({from: accounts[0]});
        // Get the value from the contract to prove it worked.
        const response = await tsContract.methods.verify(hash).call();
        console.log(response);
        // Update state with the result.
        this.setState({storageValue: response, storedOnETH:true});
    };

    getStepContent(step) {
        switch (step) {
            case 0:
                return <div style={{marginBottom:50, marginTop:50}}>
                    <DropzoneArea showPreviewsInDropzone={false} onChange={this.handleFileUpload} filesLimit={1}/>
                </div>;
            case 1:
                return <div style={{marginBottom:50, marginTop:50}}>
                    <HashContainer imgSrc={this.state.imgSrc} handleHashing={this.handleHashing} fileHash={this.state.fileHash}/>
                </div>;
            case 2:
                return <div style={{marginBottom:50, marginTop:50}}>
                    <ETHUpload handleSubmit={this.handleSubmit} fileHash={this.state.fileHash}/>
                </div>;
            default:
                return 'Unknown step';
        }
    }

  render() {
    const steps = getSteps();
    const {activeStep} = this.state;
    if (!this.state.web3) {
        return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
        <div>
        <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((label, index) => (
                <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                    <StepContent>
                        {this.getStepContent(index)}
                        <div>
                                {this.state.activeStep !== 0 && <div>
                                    <Button
                                        disabled={activeStep === 0}
                                        onClick={this.handleBack}>
                                        Back
                                    </Button>
                                    <Button
                                        disabled={!this.state.fileHash || (!this.state.storedOnETH && activeStep === 2)}
                                        variant="contained"
                                        color="primary"
                                        onClick={this.handleNext}>
                                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                    </Button>
                                </div>}
                        </div>
                    </StepContent>
                </Step>
            ))}
        </Stepper>
        {activeStep === steps.length && (
            <Paper square elevation={0}>
                <Typography>All steps completed - you are finished</Typography>
                <Button onClick={this.handleReset}>
                    Reset
                </Button>
            </Paper>
        )}
    </div>
    )
  }
}

function getSteps() {
    return ['Select File', 'SHA256 the File', 'Ethereum Blockchain'];
}