import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

function VerificationCard(props) {
  var {address, fileHash, date, timestamp} = props;
  if(timestamp === 0){
    return(
      <Card >
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2" color="error">
              Verification Error
            </Typography>
            <Typography component="p">
              Timestamp: Not Found
            </Typography>
            <Typography component="p">
              File: Not Found
            </Typography>
            <Typography component="p">
              Address: {address}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    )
  }
  else{
    return (
      <Card >
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2" color="textSecondary">
              Verification Proof
            </Typography>
            <Typography component="p">
              Timestamp: {date}
            </Typography>
            <Typography component="p">
              File: {fileHash}
            </Typography>
            <Typography component="p">
              Address: {address}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
}

export default (VerificationCard);