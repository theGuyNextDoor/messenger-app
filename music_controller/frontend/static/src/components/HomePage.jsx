import React, { useEffect } from 'react'
import { Grid, Button, ButtonGroup, Typography } from '@material-ui/core'
import { Link, Redirect } from 'react-router-dom';


function HomePage() {
  return (
    <Grid container spacing={3}>

      <Grid item xs={12} align="center">
        <Typography variant="h3" component="h3">
          House Party
        </Typography>
      </Grid>

      <Grid item xs={12} align="center">
        <ButtonGroup disableElevation variant="contained">
          <Button color="primary" to="./join" component={Link}>Join A Room</Button>
          <Button color="secondary" to="./create" component={Link}>Create A Room</Button>
        </ButtonGroup>
      </Grid>

    </Grid>
  )
}

export default HomePage;