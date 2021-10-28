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
  ListItemText, ListSubheader, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Tooltip, Typography
} from "@material-ui/core";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import DoneIcon from '@material-ui/icons/Done';

import Loader from '../Loader'

import { useHistory, useParams, useLocation } from "react-router-dom";
import {
  fetchMatchDayById,
  fetchMatchMembers,
  expireMatchDay,
  isMatchDayExpired, makeMatchDayRateActive, fetchPreviousMatchMembers
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
import { isAdminUserOnMatchDay } from "../../features/match/matchSlice";

const useStyles = makeStyles((theme) => ({
  listRoot: {
    width: '100%',
    maxWidth: '80%',
    backgroundColor: theme.palette.background.paper,
    margin: '5px'
  },
  cardRoot: {width: '100%',}, media: {height: 250},
  listContainer: {
    margin: '5px'
  },
  table: {minWidth: '100%',}
}));

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

function MatchDayDetail({user}) {
  const classes = useStyles();
  const theme = useTheme()
  const dispatch = useDispatch()
  const {matchDayId} = useParams()
  const query = useQuery()
  const history = useHistory()

  const members = useSelector((state) => state.match.members)
  const [matchDay, setMatchDay] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [isExpired, setIsExpired] = React.useState(true)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(false)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = async () => {
    setAnchorEl(null);
    if (!matchDay?.is_active) {
      await dispatch(makeMatchDayRateActive({user, matchDayId}))
    }
  };

  const checkIsAdmin = React.useCallback(async () => {
    setLoading(true)
    const response = await dispatch(isAdminUserOnMatchDay({user, matchDayId}))
    setIsAdmin(response.payload.is_group_admin)
    setLoading(false)
  }, [user])

  const getMatchMembers = React.useCallback(async () => {
    setLoading(true)
    if (query.get('isPrevious') === 'true') {
      await dispatch(fetchPreviousMatchMembers({user, matchDayId}))
    } else {
      await dispatch(fetchMatchMembers({user, matchDayId}))
    }
    setLoading(false)
  }, [user])

  const isMatchExpired = React.useCallback(async () => {
    const response = await dispatch(isMatchDayExpired({user, matchDayId}))
    const output = response.payload?.is_expired
    setIsExpired(output)
  }, [user])


  React.useEffect(() => {
    checkIsAdmin();
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
                  {(isAdmin ? !isExpired : false) &&
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
                    {isAdmin && <Button
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
                {query.get('isPrevious') === 'true' && <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Rank</TableCell>
                        <TableCell align="center">User</TableCell>
                        <TableCell align="center">Previous Point</TableCell>
                        <TableCell align="center">New Point</TableCell>
                        <TableCell align="center">Rating</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {members.map((member, index) =>
                        <TableRow key={index} style={{
                          background: member.admin ? theme.palette.primary.main : null
                        }}>
                          <TableCell align="center">
                            {index + 1}
                          </TableCell>
                          <TableCell align="center">
                            {formatName(member)}
                          </TableCell>
                          <TableCell align="center">
                            {member?.previous_score}
                          </TableCell>
                          <TableCell align="center">
                            {member?.new_points}
                          </TableCell>
                          <TableCell align="center">
                            {`${member?.new_score} pts`}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>}
                {query.get('isPrevious') === 'false' &&
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
                        <ListItemText
                          primary={`${member.rating_point} pts`}
                          secondary={member?.is_rated ? <DoneIcon fontSize="small"/> : null}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  )}
                </List>}
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
