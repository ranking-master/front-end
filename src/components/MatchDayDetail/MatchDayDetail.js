import React from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from 'react-redux'
import {
  Box, Button, Card, CardActionArea, CardActions, CardContent,
  Divider,
  Grid,
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
import {
  fetchMatchDayById,
  fetchMatchMembers,
  expireMatchDay,
  isMatchDayExpired
} from "../../features/match/matchSlice";

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
  const history = useHistory()

  const members = useSelector((state) => state.match.members)
  const [matchDay, setMatchDay] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [showTooltip, setShowTooltip] = React.useState(false)
  const [isExpired, setIsExpired] = React.useState(true)

  const getMatchMembers = React.useCallback(async () => {
    setLoading(true)
    await dispatch(fetchMatchMembers({user, matchDayId}))
    setLoading(false)
  }, [])

  const isMatchExpired = React.useCallback(async () => {
    const response = await dispatch(isMatchDayExpired({user, matchDayId}))
    const output = response.payload?.is_expired
    setIsExpired(output)
  }, [])


  React.useEffect(() => {
    isMatchExpired();
    getMatchMembers();
  }, [])


  const getMatchDay = React.useCallback(async () => {
    const res = await dispatch(fetchMatchDayById({user, matchDayId}))
    setMatchDay(res.payload)
  }, [matchDayId])

  React.useEffect(() => {
    getMatchDay()
  }, [])

  const setMatchDayAsExpired = async () => {
    await dispatch(expireMatchDay({user, matchDayId}))
    history.push(`/match-day-detail/${matchDayId}`)
  }

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
                  {user.uid === matchDay.uid && <CardActions>
                    <Tooltip title={showTooltip ? 'Copied' : ''}>
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
                    </Tooltip>
                    {!isExpired && <Button
                      size="small"
                      color="primary"
                      onClick={setMatchDayAsExpired}
                    >
                      Close Rating
                    </Button>}
                  </CardActions>}
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
