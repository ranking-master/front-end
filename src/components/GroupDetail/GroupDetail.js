import React from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from 'react-redux'

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

import { ReactComponent as InsertBlockIllustration } from "../../illustrations/insert-block.svg";
import EmptyState from "../EmptyState";
import { fetchGroupById } from "../../features/group/groupSlice";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  listRoot: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

function GroupDetail({user}) {
  const classes = useStyles();
  const dispatch = useDispatch()
  const {groupId} = useParams()

  const [group, setGroup] = React.useState(null)

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
            <Box textAlign="center" padding={5}>
              <p>{group.name}</p>
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
            {/*{groups.length !== 0 && <div className={classes.listRoot}>*/}
            {/*  <List component="nav" aria-label="secondary mailbox folder">*/}
            {/*    {groups.map((group, index) =>*/}
            {/*      <ListItem*/}
            {/*        key={index}*/}
            {/*        button*/}
            {/*        selected={selectedIndex === index}*/}
            {/*        onClick={(event) => handleListItemClick(event, index)}*/}
            {/*      >*/}
            {/*        <ListItemText primary={group.name}/>*/}
            {/*        <ListItemSecondaryAction>*/}
            {/*          <IconButton edge="end" aria-label="go">*/}
            {/*            <NavigateNextIcon/>*/}
            {/*          </IconButton>*/}
            {/*        </ListItemSecondaryAction>*/}
            {/*      </ListItem>*/}
            {/*    )}*/}
            {/*  </List>*/}
            {/*</div>}*/}
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

GroupDetail.propTypes = {
  user: PropTypes.object,
};

export default GroupDetail
