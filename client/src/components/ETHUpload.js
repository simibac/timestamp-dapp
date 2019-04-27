import React from 'react'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export default function ETHUpload({handleSubmit, fileHash}) {
  return (
    <div>
        <Typography>
            You can now store the hash of the uploaded file on the Ethereum blockchain. This will permanently link the hash of the file to your Ethereum Account. You will be asked to confirm the transaction within your Metamask.
        </Typography>
        <br></br>
        <Button 
            disabled={!fileHash} 
            variant="contained" 
            color="secondary"
            onClick={handleSubmit}>Store the Hash on the Ethereum Blockchain
        </Button>
    </div>
  )
}
