import Button from '@material-ui/core/Button';
import {PropTypes} from 'react';
import {DropzoneArea} from 'material-ui-dropzone';


const React = require('react');
const ipfsClient = require('ipfs-http-client');


// create a stream from a file, which enables uploads of big files without allocating memory twice
const fileReaderPullStream = require('pull-file-reader');

class FileUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            added_file_hash: null,
            file: null,
        };
        this.ipfs = ipfsClient('localhost', '5001');

        // bind methods
        this.uploadFile = this.uploadFile.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(files) {
        this.setState({
            files: files,
            file: files[0]
        }, this.uploadFile);
        this.props.updateFileSelected(true);
    }

    uploadFile() {
        this.saveToIpfsWithFilename(this.state.file);
        this.props.updateFileUploaded(true);
    }

    // Add file to IPFS and wrap it in a directory to keep the original filename
    saveToIpfsWithFilename(file) {
        let ipfsId;
        const fileStream = fileReaderPullStream(file);
        const fileDetails = {
            path: file.name,
            content: fileStream
        };
        const options = {
            wrapWithDirectory: true,
            progress: (prog) => console.log(`received: ${prog}`)
        };
        this.ipfs.add(fileDetails, options)
            .then((response) => {
                console.log(response);
                // CID of wrapping directory is returned last
                ipfsId = response[response.length - 1].hash;
                console.log(ipfsId);
                this.setState({added_file_hash: ipfsId});
                this.props.setHash(ipfsId);
            }).catch((err) => {
            console.error(err)
        })
    }

    render() {
        return (
            <div>
                <br/>
                <DropzoneArea
                    onChange={this.handleChange}
                    filesLimit={1}
                />
            </div>
        )
    }
}


export default FileUpload