import React from 'react'
import Button from '@material-ui/core/Button';


export default function HashContainer({imgSrc, handleHashing, fileHash}) {
    console.log(imgSrc)
  return (
      <div>
        {fileHash === '' && <Button variant="contained" color="secondary" onClick={handleHashing}>Hash this file now!</Button>}
        <p>SHA256( <img height="100" src={imgSrc} alt="file" align="middle"/> ) = {fileHash}</p>
    </div>
  )
}