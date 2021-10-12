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
  ListItemText, ListSubheader, Menu, MenuItem,
  Tooltip, Typography
} from "@material-ui/core";
import { makeStyles, useTheme } from '@material-ui/core/styles';

import Loader from '../Loader'

import { useHistory, useParams } from "react-router-dom";
import {
  fetchMatchDayById,
  fetchMatchMembers,
  expireMatchDay,
  isMatchDayExpired, makeMatchDayRateActive
} from "../../features/match/matchSlice";
import UnAuthenticated from "../UnAuthenticated";
import { formatName } from "../../data/formatName";
import {
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton
} from "react-share";

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
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = async () => {
    setAnchorEl(null);
    if (!matchDay?.is_active) {
      await dispatch(makeMatchDayRateActive({user, matchDayId}))
    }
  };


  const getMatchMembers = React.useCallback(async () => {
    setLoading(true)
    await dispatch(fetchMatchMembers({user, matchDayId}))
    setLoading(false)
  }, [user])

  const isMatchExpired = React.useCallback(async () => {
    const response = await dispatch(isMatchDayExpired({user, matchDayId}))
    const output = response.payload?.is_expired
    setIsExpired(output)
  }, [user])


  React.useEffect(() => {
    isMatchExpired();
    getMatchMembers();
    getMatchDay()
  }, [user])


  const getMatchDay = React.useCallback(async () => {
    const res = await dispatch(fetchMatchDayById({user, matchDayId}))
    setMatchDay(res.payload)
  }, [matchDayId, user])

  const setMatchDayAsExpired = async () => {
    await dispatch(expireMatchDay({user, matchDayId}))
    setIsExpired(true)
  }

  if (user) {
    if (loading) {
      return <Loader/>
    } else {
      return (
        <div style={{flexGrow: 1}}>
          {matchDay && <Grid container spacing={3} xs={12} item>
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
                  {(user.uid !== matchDay.uid) && matchDay?.is_active && <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => {
                        history.push(`/rate/${matchDay.uuid}/${matchDay.id}`)
                      }}
                    >
                      Rate players
                    </Button>
                  </CardActions>}
                  {(user.uid === matchDay.uid ? !isExpired : false) &&
                  <CardActions>
                    <Button
                      size="small"
                      color="secondary"
                      aria-controls="share-menu"
                      aria-haspopup="true"
                      onClick={handleClick}
                    >
                      Share Rating Link
                    </Button>
                    <Menu
                      id="simple-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleClose}>
                        <WhatsappShareButton
                          url={`${process.env.REACT_APP_HOMEPAGE}/rate/${matchDay.uuid}/${matchDay.id}`}>
                          <WhatsappIcon size={50} round={true}/>
                        </WhatsappShareButton>
                      </MenuItem>
                      {/*<MenuItem onClick={handleClose}>*/}
                      {/*  <FacebookShareButton url={`${process.env.REACT_APP_HOMEPAGE}/join/${group.uuid}/${group.id}`}>*/}
                      {/*    <FacebookIcon size={50} round={true}/>*/}
                      {/*  </FacebookShareButton>*/}
                      {/*</MenuItem>*/}
                      <MenuItem onClick={handleClose}>
                        <TwitterShareButton
                          url={`${process.env.REACT_APP_HOMEPAGE}/rate/${matchDay.uuid}/${matchDay.id}`}>
                          <TwitterIcon size={50} round={true}/>
                        </TwitterShareButton>
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <TelegramShareButton
                          url={`${process.env.REACT_APP_HOMEPAGE}/rate/${matchDay.uuid}/${matchDay.id}`}>
                          <TelegramIcon size={50} round={true}/>
                        </TelegramShareButton>
                      </MenuItem>
                    </Menu>
                    <Button
                      size="small"
                      color="primary"
                      onClick={setMatchDayAsExpired}
                    >
                      Close Rating
                    </Button>
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
                        primary={formatName(member)}/>
                      <ListItemSecondaryAction>
                        <ListItemText primary={`${member.rating_point} pts`}/>
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
    <UnAuthenticated/>
  );
}

MatchDayDetail.propTypes = {
  user: PropTypes.object,
};

export default MatchDayDetail
