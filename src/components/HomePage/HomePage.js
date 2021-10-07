import React from "react";

import PropTypes from "prop-types";
import { useSelector, useDispatch } from 'react-redux'
import { createGroup, fetchGroups } from "../../features/group/groupSlice";

import {
  Box,
  Divider,
  Grid, IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import AddIcon from '@material-ui/icons/Add';
import { Link, withRouter } from "react-router-dom";

import { auth, storage } from "../../firebase";

import authentication from "../../services/authentication";

import EmptyState from "../EmptyState";

import { ReactComponent as InsertBlockIllustration } from "../../illustrations/insert-block.svg";


const useStyles = makeStyles((theme) => ({
  listRoot: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

function HomePage({user}) {
  const classes = useStyles();
  const dispatch = useDispatch()

  const groups = useSelector((state) => state.group.groups)
  const [group, setGroup] = React.useState('')
  const [groupIcon, setGroupIcon] = React.useState({groupImage: null, groupImageUrl: null})

  React.useEffect(() => {
    signInWithEmailLink(user)
  }, [])

  React.useEffect(() => {
    dispatch(fetchGroups({user}))
  }, [])

  const handleGroupNameChange = (event) => {
    if (!event) {
      return;
    }

    const groupName = event.target.value;

    setGroup(groupName)
  };


  const changeGroupName = () => {
    dispatch(createGroup({user, group}))
    setGroup('')
  };

  const handleAvatarChange = (event) => {
    if (!event) {
      return;
    }

    const files = event.target.files;

    if (!files) {
      return;
    }

    const avatar = files[0];

    if (!avatar) {
      return;
    }

    const fileTypes = [
      "image/gif",
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];

    if (!fileTypes.includes(avatar.type)) {
      return;
    }

    if (avatar.size > 20 * 1024 * 1024) {
      return;
    }

    setGroupIcon({
      groupImage: avatar,
      groupImageUrl: URL.createObjectURL(avatar)
    })
  };

  const signInWithEmailLink = (user) => {
    if (user) {
      return;
    }

    const emailLink = window.location.href;

    if (!emailLink) {
      return;
    }

    if (auth.isSignInWithEmailLink(emailLink)) {
      let emailAddress = localStorage.getItem("emailAddress");

      if (!emailAddress) {
        this.props.history.push("/");

        return;
      }

      authentication
        .signInWithEmailLink(emailAddress, emailLink)
        .then((value) => {
          const user = value.user;
          const displayName = user.displayName;
          const emailAddress = user.email;

          this.props.openSnackbar(
            `Signed in as ${displayName || emailAddress}`
          );
        })
        .catch((reason) => {
          const code = reason.code;
          const message = reason.message;

          switch (code) {
            case "auth/expired-action-code":
            case "auth/invalid-email":
            case "auth/user-disabled":
              this.props.openSnackbar(message);
              break;

            default:
              this.props.openSnackbar(message);
              return;
          }
        })
        .finally(() => {
          this.props.history.push("/");
        });
    }
  };


  if (user) {
    return (
      <div style={{flexGrow: 1}}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box textAlign="center" padding={5}>
              <TextField
                id="outlined-basic"
                label="Group name"
                variant="outlined"
                onChange={handleGroupNameChange}
                value={group}
              />
              <IconButton onClick={changeGroupName}>
                <AddIcon/>
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Divider/>
        <Grid container>
          <Grid
            item xs={12}
            container direction="row"
            justifyContent="center"
            alignItems="center"
          >
            {groups.length !== 0 && <div className={classes.listRoot}>
              <List component="nav" aria-label="secondary mailbox folder">
                {groups.map((group, index) =>
                  <ListItem
                    key={index}
                    button
                    component={Link}
                    to={`/group/${group.id}`}
                  >
                    <ListItemText primary={group.name}/>
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="go"
                        component={Link}
                        to={`/group/${group.id}`}
                      >
                        <NavigateNextIcon/>
                      </IconButton>
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
      title="RMUIF"
      description="Supercharged version of Create React App with all the bells and whistles."
    />
  );
}

HomePage.propTypes = {
  user: PropTypes.object,
};

export default withRouter(HomePage);
