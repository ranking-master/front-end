import React from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from 'react-redux'
import firebase, { auth, storage } from "../../firebase";
import {
  Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia,
  Divider,
  Grid, IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField, Tooltip, Typography
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

import { ReactComponent as InsertBlockIllustration } from "../../illustrations/insert-block.svg";
import EmptyState from "../EmptyState";
import { fetchGroupById, updateGroup } from "../../features/group/groupSlice";
import { fetchMembers } from "../../features/member/memberSlice";

import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  listRoot: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  cardRoot: {width: '100%',}, media: {height: 250}
}));

function GroupDetail({user}) {
  const classes = useStyles();
  const dispatch = useDispatch()
  const {groupId} = useParams()

  const members = useSelector((state) => state.member.members)
  const [group, setGroup] = React.useState(null)
  const [image, setImage] = React.useState(null)
  const [showTooltip, setShowTooltip] = React.useState(false)
  const [downloadUrl, setDownloadUrl] = React.useState(null)

  React.useEffect(() => {
    dispatch(fetchMembers({user, groupId}))
  }, [])

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
  }, [groupId])

  React.useEffect(() => {
    getGroup()
  }, [])

  if (user) {
    return (
      <div style={{flexGrow: 1}}>
        {group && <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box padding={5}>
              <Card className={classes.cardRoot}>
                <CardActionArea>
                  {!group.img_url ? !image && <>
                    <input
                      id="avatar-input"
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleChange}
                    />
                    <label htmlFor="avatar-input">
                      <Button
                        color="primary"
                        component="span"
                        variant="contained"
                        onClick={handleUpload}
                      >
                        Choose...
                      </Button>
                    </label>
                  </> : null}
                  {!group.img_url ? image && (
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={handleUpload}
                    >
                      Upload
                    </Button>
                  ) : null}
                  <CardMedia
                    className={classes.media}
                    image={group.img_url ? group.img_url : downloadUrl || "https://via.placeholder.com/400x300"}
                    title="Group Image"
                  />
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
                  <Tooltip title={showTooltip ? 'Copied' : null}>
                    <Button
                      size="small"
                      color="secondary"
                      onClick={() => {
                        navigator.clipboard.writeText(`${process.env.REACT_APP_HOMEPAGE}/join/${group.uuid}`)
                        setShowTooltip(true)
                      }}
                    >
                      Share Group Link
                    </Button>
                  </Tooltip>
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
            {members.length !== 0 && <div className={classes.listRoot}>
              <List component="nav" aria-label="secondary mailbox folder">
                {members.map((member, index) =>
                  <ListItem
                    key={index}
                    button
                  >
                    <ListItemText primary={member.name}/>
                    <ListItemSecondaryAction>
                      {/*<IconButton edge="end" aria-label="go">*/}
                      {/*  <NavigateNextIcon/>*/}
                      {/*</IconButton>*/}
                    </ListItemSecondaryAction>
                  </ListItem>
                )}
              </List>
            </div>}
          </Grid>
        </Grid>
      </div>
    );
  }

  return (
    <EmptyState
      image={<InsertBlockIllustration/>}
      title="Ranking Master"
      description="The rating app you need for your next game"
    />
  );
}

GroupDetail.propTypes = {
  user: PropTypes.object,
};

export default GroupDetail
