import React, {Component} from "react";
//import SimpleStorageContract from "./contracts/SimpleStorage.json";
import TimeStamperContract from "./contracts/TimeStamper.json";

import getWeb3 from "./utils/getWeb3";
import SimpleAppBar from "./components/SimpleAppBar.js"
import FileUpload from "./components/FileUpload.js"
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import "./App.css";

class App extends Component {

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
            activeStep: 0
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setHash = this.setHash.bind(this);
        this.updateFileSelected = this.updateFileSelected.bind(this);
        this.updateFileUploaded = this.updateFileUploaded.bind(this);
        this.getStepContent = this.getStepContent.bind(this);

    }

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

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            //const deployedNetwork = SimpleStorageContract.networks[networkId];
            //const instance = new web3.eth.Contract(
            //    SimpleStorageContract.abi,
            //    deployedNetwork && deployedNetwork.address,
            //);
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
                //contract: instance, 
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

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit() {
        this.runExample(this.state.hash);
    }

    setHash(hash) {
        this.setState({hash: hash});
    }

    updateFileSelected(selected) {
        this.setState({fileSelected: selected})
    }

    updateFileUploaded(uploaded) {
        this.setState({fileUploaded: uploaded})
    }


    runExample = async (hash) => {
        const {accounts, contract, tsContract} = this.state;

        // Stores a given value
        //await contract.methods.set(hash).send({from: accounts[0]});
        await tsContract.methods.timestamp(hash).send({from: accounts[0]});
        // Get the value from the contract to prove it worked.
        //const response = await contract.methods.get().call();
        const response = await tsContract.methods.verify(hash).call();
        // Update state with the result.
        this.setState({storageValue: response, storedOnETH:true});

    };

    getStepContent(step) {
        switch (step) {
            case 0:
                return <div style={{marginBottom:30}}>
                    <FileUpload
                        setHash={this.setHash}
                        fileUploaded={this.state.fileUploaded}
                        fileSelected={this.state.fileSelected}
                        updateFileUploaded={this.updateFileUploaded}
                        updateFileSelected={this.updateFileSelected}
                    />
                </div>;
            case 1:
                return <div style={{marginBottom:30}}>
                    <Typography>
                        Bravo! You successfully uploaded your file to IPFS. The unique ID of the file is {this.state.hash}. You can find your file with the following
                        link:
                    </Typography>
                    <br/>
                    <Link href={'https://ipfs.io/ipfs/' + this.state.hash}>
                        Find Your Uploaded File Here On IPFS
                    </Link>
                </div>;
            case 2:
                return <div style={{marginBottom:30, marginTop:30}}>
                    <Typography>You can now store the hash of the uploaded file on the Ethereum Blockchain. This will permanently link the hash of the file to your Ethereum Account.
                    You will be asked to confirm the transaction within your Metamask.
                    </Typography>
                    <br/>

                    <Button disabled={!this.state.hash} variant="contained" color="secondary"
                        onClick={() => this.handleSubmit()}>Store the Hash on the Ethereum Blockchain</Button>
            </div>;
            default:
                return 'Unknown step';
        }
    }


    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        const {classes} = this.props;
        const steps = getSteps();
        const {activeStep} = this.state;

        return (
            <div className="App">
                <SimpleAppBar/>
                 <div>
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                                <StepContent>
                                    {this.getStepContent(index)}
                                    <div>
                                        <div>
                                            <Button
                                                disabled={activeStep === 0}
                                                onClick={this.handleBack}>
                                                Back
                                            </Button>
                                            <Button
                                                disabled={!this.state.fileUploaded && activeStep === 0 || !this.state.storedOnETH && activeStep === 2}
                                                variant="contained"
                                                color="primary"
                                                onClick={this.handleNext}>
                                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                            </Button>
                                        </div>
                                    </div>
                                </StepContent>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length && (
                        <Paper square elevation={0}>
                            <Typography>All steps completed - you&apos;re finished</Typography>
                            <Button onClick={this.handleReset}>
                                Reset
                            </Button>
                        </Paper>
                    )}
                </div>
            </div>
        );
    }
}

function getSteps() {
    return ['Select and Upload File to IPFS', 'Check it out on IPFS', 'Upload Hash of the File to the Ethereum Blockchain'];
}

export default App;
