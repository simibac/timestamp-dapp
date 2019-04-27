import React, {Component} from "react";

import FullWidthTabs from "./views/FullWidthTabs";

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
    }
    
    render() {


        return (
            <div className="App">
                <FullWidthTabs/>
            </div>
        );
    }
}

export default App;
