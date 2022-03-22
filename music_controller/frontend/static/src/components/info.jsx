import React, { useState, useEffect } from 'react'
import { Grid, Button, Typography, IconButton } from '@mui/material'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link } from 'react-router-dom'

const pages = {
  JOIN: 'pages.join',
  CREATE: 'pages.create',
};

function Info() {
  const [page, setPage] = useState(pages.JOIN);

  function joinInfo() {
    return 'Join Page';
  }

  function createInfo() {
    return 'Create Page';
  }

  const changeInfoView = () => {
    page === pages.JOIN ? setPage(pages.CREATE) : setPage(pages.JOIN)
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          What is House Party?
        </Typography>
      </Grid>

      <Grid item xs={12} align="center">
        <Typography variant="body1">
          {page === pages.JOIN ? joinInfo() : createInfo()}
        </Typography>
      </Grid>

      <Grid item xs={12} align="center">
        <IconButton onClick={changeInfoView}>
          {page === pages.JOIN ? <NavigateNextIcon /> : <NavigateBeforeIcon />}
        </IconButton>
      </Grid>

      <Grid item xs={12} align="center">
        <Button color="secondary" variant="contained" to="/" component={Link}>Back</Button>
      </Grid>

    </Grid>
  )
}

export default Info;
