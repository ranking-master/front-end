import React from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from 'react-redux'
import firebase, { auth, storage } from "../../firebase";
import {
  AppBar,
  Box, Button, Card, CardActionArea, CardActions, CardContent,
  Divider,
  Grid, IconButton,
  List,
  ListItem, ListItemIcon,
  ListItemSecondaryAction,
  ListItemText, ListSubheader, Menu, MenuItem, Tab, Tabs,
  Tooltip, Typography
} from "@material-ui/core";
import {
  WhatsappShareButton,
  WhatsappIcon,
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  TwitterIcon, TelegramShareButton, TelegramIcon
} from "react-share";

import { makeStyles, useTheme } from '@material-ui/core/styles';

import Loader from '../Loader'
import { fetchGroupById, updateGroup } from "../../features/group/groupSlice";
import { fetchMembers } from "../../features/member/memberSlice";

import { useHistory, useParams } from "react-router-dom";
import { fetchMatches, fetchFinishedMatches } from "../../features/match/matchSlice";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import UnAuthenticated from "../UnAuthenticated";
import { formatName } from "../../data/formatName";

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
  },
  appBar: {
    width: '100%'
  },
  appBarContainer: {
    width: '100%'
  }
}));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Grid container>
          <Grid
            item xs={12}
            container direction="row"
            justifyContent="space-evenly"
            alignItems="flex-start"
          >
            {children}
          </Grid>
        </Grid>
      )}
    </div>
  );
}

function GroupDetail({user}) {
  const classes = useStyles();
  const theme = useTheme()
  const dispatch = useDispatch()
  const {groupId} = useParams()
  const history = useHistory()

  const members = useSelector((state) => state.member.members)
  const matches = useSelector((state) => state.match.matches)
  const [group, setGroup] = React.useState(null)
  const [previousMatches, setPreviousMatches] = React.useState([])
  const [image, setImage] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [showTooltip, setShowTooltip] = React.useState(false)
  const [downloadUrl, setDownloadUrl] = React.useState(null)
  const [value, setValue] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const getMembers = React.useCallback(async () => {
    setLoading(true)
    await dispatch(fetchMembers({user, groupId}))
    setLoading(false)
  }, [user])

  const getMatches = React.useCallback(async () => {
    setLoading(true)
    await dispatch(fetchMatches({user, groupId}))
    setLoading(false)
  }, [user])

  const getFinishedMatches = React.useCallback(async () => {
    setLoading(true)
    const res = await dispatch(fetchFinishedMatches({user, groupId}))
    setPreviousMatches(res.payload)
    setLoading(false)
  }, [user])

  React.useEffect(() => {
    getMembers();
    getMatches();
    getFinishedMatches();
    getGroup();
  }, [user])

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleUpload = () => {
    try {
      if (image) {
        let file = image;
        let storageRef = storage.ref();
        let uploadTask = storageRef.child(`images/groups/${groupId}/${auth.currentUser.uid}`).put(file);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot) => {
            let progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes)) * 100
          }, (error) => {
            throw error
          }, () => {
            uploadTask.snapshot.ref.getDownloadURL().then(async (url) => {
              setDownloadUrl(url)
              await dispatch(updateGroup({user, groupId, groupImageUrl: url}))
            })
          }
        )
      }
    } catch (e) {
      console.error(e)
    }
  }

  const getGroup = React.useCallback(async () => {
    const res = await dispatch(fetchGroupById({user, groupId}))
    setGroup(res.payload)
  }, [groupId, user])

  if (user) {
    if (loading) {
      return <Loader/>
    } else {
      return (
        <div style={{flexGrow: 1}}>
          {group &&
          <Grid container item spacing={3} xs={12}>
            <Grid item xs={12}>
              <Box padding={5}>
                <Card className={classes.cardRoot}>
                  <CardActionArea>
                    {/*{!group.img_url ? !image && <>*/}
                    {/*  <input*/}
                    {/*    id="avatar-input"*/}
                    {/*    type="file"*/}
                    {/*    hidden*/}
                    {/*    accept="image/*"*/}
                    {/*    onChange={handleChange}*/}
                    {/*  />*/}
                    {/*  <label htmlFor="avatar-input">*/}
                    {/*    <Button*/}
                    {/*      color="primary"*/}
                    {/*      component="span"*/}
                    {/*      variant="contained"*/}
                    {/*      onClick={handleUpload}*/}
                    {/*    >*/}
                    {/*      Choose...*/}
                    {/*    </Button>*/}
                    {/*  </label>*/}
                    {/*</> : null}*/}
                    {/*{!group.img_url ? image && (*/}
                    {/*  <Button*/}
                    {/*    color="primary"*/}
                    {/*    variant="contained"*/}
                    {/*    onClick={handleUpload}*/}
                    {/*  >*/}
                    {/*    Upload*/}
                    {/*  </Button>*/}
                    {/*) : null}*/}
                    {/*<CardMedia*/}
                    {/*  className={classes.media}*/}
                    {/*  image={group.img_url ? group.img_url : downloadUrl || "https://via.placeholder.com/400x300"}*/}
                    {/*  title="Group Image"*/}
                    {/*/>*/}
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {group.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {group.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <>
                      <Button
                        size="small"
                        color="secondary"
                        aria-controls="share-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                      >
                        Share Group Link
                      </Button>
                      <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                      >
                        <MenuItem onClick={handleClose}>
                          <WhatsappShareButton url={`${process.env.REACT_APP_HOMEPAGE}/join/${group.uuid}/${group.id}`}>
                            <WhatsappIcon size={50} round={true}/>
                          </WhatsappShareButton>
                        </MenuItem>
                        {/*<MenuItem onClick={handleClose}>*/}
                        {/*  <FacebookShareButton url={`${process.env.REACT_APP_HOMEPAGE}/join/${group.uuid}/${group.id}`}>*/}
                        {/*    <FacebookIcon size={50} round={true}/>*/}
                        {/*  </FacebookShareButton>*/}
                        {/*</MenuItem>*/}
                        <MenuItem onClick={handleClose}>
                          <TwitterShareButton url={`${process.env.REACT_APP_HOMEPAGE}/join/${group.uuid}/${group.id}`}>
                            <TwitterIcon size={50} round={true}/>
                          </TwitterShareButton>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <TelegramShareButton url={`${process.env.REACT_APP_HOMEPAGE}/join/${group.uuid}/${group.id}`}>
                            <TelegramIcon size={50} round={true}/>
                          </TelegramShareButton>
                        </MenuItem>
                      </Menu>
                    </>
                    {group.uid === user.uid && <Button
                      size="small"
                      color="primary"
                      onClick={() => {
                        history.push(`/match-day/${groupId}`)
                      }}
                    >
                      Create match
                    </Button>}
                  </CardActions>
                </Card>
              </Box>
            </Grid>
          </Grid>}
          <Box p={2}>
            <Grid container item justifyContent="center" alignItems="center" xs={12}>
              <AppBar position="static" className={classes.appBar}>
                <Tabs
                  value={value}
                  onChange={handleTabChange}
                  aria-label="Group detail tabs"
                  variant="fullWidth"
                  centered
                >
                  <Tab label="Members" {...a11yProps(0)} />
                  <Tab label="Upcoming Matches" {...a11yProps(1)} />
                  <Tab label="Previous Matches" {...a11yProps(2)} />
                </Tabs>
              </AppBar>
            </Grid>
          </Box>
          <Box p={2}>
            <TabPanel value={value} index={0}>
              {members.length !== 0 &&
              <div className={classes.listRoot}>
                <List
                  subheader={<ListSubheader>Members</ListSubheader>}
                  component="nav"
                  aria-label="secondary mailbox folder"
                >
                  {members.map((member, index) =>
                    <ListItem
                      key={index}
                      button
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
            </TabPanel>
            <TabPanel value={value} index={1}>
              {matches.length !== 0 &&
              <div className={classes.listRoot}>
                <List
                  subheader={<ListSubheader>Matches</ListSubheader>}
                  component="nav"
                  aria-label="secondary mailbox folder"
                >
                  {matches.map((match, index) =>
                    <ListItem
                      key={index}
                    >
                      <ListItemText
                        primary={match.name}/>
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="go" onClick={() => {
                          history.push(`/match-day-detail/${match.id}?isPrevious=false`)
                        }}>
                          <NavigateNextIcon/>
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  )}
                </List>
              </div>}
            </TabPanel>
            <TabPanel value={value} index={2}>
              {previousMatches.length !== 0 &&
              <div className={classes.listRoot}>
                <List
                  subheader={<ListSubheader>Matches</ListSubheader>}
                  component="nav"
                  aria-label="secondary mailbox folder"
                >
                  {previousMatches.map((match, index) =>
                    <ListItem
                      key={index}
                    >
                      <ListItemText
                        primary={match.name}/>
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="go" onClick={() => {
                          history.push(`/match-day-detail/${match.id}?isPrevious=true`)
                        }}>
                          <NavigateNextIcon/>
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  )}
                </List>
              </div>}
            </TabPanel>
          </Box>
        </div>
      );
    }
  }

  return (
    <UnAuthenticated/>
  );
}

GroupDetail.propTypes = {
  user: PropTypes.object,
};

export default GroupDetail
