import React from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from 'react-redux'
import {
  Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia,
  Divider,
  Grid, IconButton,
  List,
  ListItem, ListItemIcon,
  ListItemSecondaryAction,
  ListItemText, ListSubheader,
  Tooltip, Typography
} from "@material-ui/core";
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { ReactComponent as InsertBlockIllustration } from "../../illustrations/insert-block.svg";
import EmptyState from "../EmptyState";
import Loader from '../Loader'

import { useHistory, useParams } from "react-router-dom";
import { fetchMatchDayById, fetchMatchMembers } from "../../features/match/matchSlice";

const useStyles = makeStyles((theme) => ({
  listRoot: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    margin: '5px'
  },
  cardRoot: {width: '100%',}, media: {height: 250},
  listContainer: {
    margin: '5px'
  }
}));

function MatchDayDetail({user}) {
  const classes = useStyles();
  const theme = useTheme()
  const dispatch = useDispatch()
  const {matchDayId} = useParams()

  const members = useSelector((state) => state.match.members)
  const [matchDay, setMatchDay] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [showTooltip, setShowTooltip] = React.useState(false)

  const getMatchMembers = React.useCallback(async () => {
    setLoading(true)
    await dispatch(fetchMatchMembers({user, matchDayId}))
    setLoading(false)
  }, [])


  React.useEffect(() => {
    getMatchMembers();
  }, [])


  const getMatchDay = React.useCallback(async () => {
    const res = await dispatch(fetchMatchDayById({user, matchDayId}))
    setMatchDay(res.payload)
  }, [matchDayId])

  React.useEffect(() => {
    getMatchDay()
  }, [])

  if (user) {
    if (loading) {
      return <Loader/>
    } else {
      return (
        <div style={{flexGrow: 1}}>
          {matchDay && <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box padding={5}>
                <Card className={classes.cardRoot}>
                  <CardActionArea>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {matchDay.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    {user.uid === matchDay.uid && <Tooltip title={showTooltip ? 'Copied' : ''}>
                      <Button
                        size="small"
                        color="secondary"
                        onClick={() => {
                          navigator.clipboard.writeText(`${process.env.REACT_APP_HOMEPAGE}/rate/${matchDay.uuid}/${matchDay.id}`)
                          setShowTooltip(true)
                        }}
                      >
                        Share Rate Link
                      </Button>
                    </Tooltip>}
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => {
                        // history.push(`/match-day/${groupId}`)
                      }}
                    >
                      Create match
                    </Button>
                  </CardActions>
                </Card>
              </Box>

            </Grid>
          </Grid>}
          <Divider/>
          <Grid container>
            <Grid
              item xs={12}
              container direction="row"
              justifyContent="center"
              alignItems="center"
            >
              {members.length !== 0 &&
              <div className={classes.listRoot}>
                <List subheader={<ListSubheader>Members</ListSubheader>} component="nav"
                      aria-label="secondary mailbox folder">
                  {members.map((member, index) =>
                    <ListItem
                      key={index}
                      style={{
                        background: member.admin ? theme.palette.primary.main : null
                      }}
                    >
                      <ListItemIcon>
                        <ListItemText primary={index + 1}/>
                      </ListItemIcon>
                      <ListItemText
                        primary={member.firstName ? member.lastName ? member.firstName + ' ' + member.lastName : member.firstName : member.email}/>
                      <ListItemSecondaryAction>
                        <ListItemText primary={member.rating_point}/>
                      </ListItemSecondaryAction>
                    </ListItem>
                  )}
                </List>
              </div>}
              <Grid/>
            </Grid>
          </Grid>
        </div>
      );
    }
  }

  return (
    <EmptyState
      image={<InsertBlockIllustration/>}
      title="Ranking Master"
      description="The rating app you need for your next game"
    />
  );
}

MatchDayDetail.propTypes = {
  user: PropTypes.object,
};

export default MatchDayDetail
