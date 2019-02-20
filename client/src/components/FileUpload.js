import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

const React = require('react')
const ipfsClient = require('ipfs-http-client')


// create a stream from a file, which enables uploads of big files without allocating memory twice
const fileReaderPullStream = require('pull-file-reader')

class FileUpload extends React.Component {
    constructor () {
        super()
        this.state = {
            added_file_hash: null,
            file:null,
            fileUploaded:false
        }
        this.ipfs = ipfsClient('localhost', '5001')

        // bind methods
        this.captureFile = this.captureFile.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.uploadFile = this.uploadFile.bind(this)
    }

    captureFile (event) {
        event.stopPropagation()
        event.preventDefault()
        this.setState({file:event.target.files[0]})
    }

    uploadFile (event){
        this.saveToIpfsWithFilename(this.state.file)
        this.setState({fileUploaded:true})
    }

    // Add file to IPFS and wrap it in a directory to keep the original filename
    saveToIpfsWithFilename (file) {
        let ipfsId
        const fileStream = fileReaderPullStream(file)
        const fileDetails = {
            path: file.name,
            content: fileStream
        }
        const options = {
            wrapWithDirectory: true,
            progress: (prog) => console.log(`received: ${prog}`)
        }
        this.ipfs.add(fileDetails, options)
            .then((response) => {
                console.log(response)
                // CID of wrapping directory is returned last
                ipfsId = response[response.length - 1].hash
                console.log(ipfsId)
                this.setState({added_file_hash: ipfsId})
                this.props.setHash(ipfsId)
            }).catch((err) => {
            console.error(err)
        })
    }

    handleSubmit (event) {
        event.preventDefault()
    }

    render () {
        return (
            <div>
                <form id='captureMedia' onSubmit={this.handleSubmit}>
                    <br/>
                    <input type='file' onChange={this.captureFile} />
                    <br/>
                    <br/>
                    <Button variant="contained" color="primary" onClick={this.uploadFile}>
                        Upload File to IPFS
                    </Button>
                </form>
                <br/>
                    {this.state.fileUploaded &&
                    <Link href={'https://ipfs.io/ipfs/' + this.state.added_file_hash}>
                        Find Your Uploaded File Here On IPFS
                    </Link>
                    }
                <br/>
            </div>
        )
    }
}
export default FileUpload