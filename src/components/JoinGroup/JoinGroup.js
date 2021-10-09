import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from 'react-redux'
import {
  Box, Button,
  Grid,
} from "@material-ui/core";

import { fetchGroupById, joinGroup } from "../../features/group/groupSlice";

import { useParams, useHistory } from "react-router-dom";
import Loader from "../Loader";
import UnAuthenticated from "../UnAuthenticated";


function JoinGroup({user}) {
  const dispatch = useDispatch()
  let history = useHistory();
  const {uuid, groupId} = useParams()
  const [loading, setLoading] = React.useState(true)
  const [group, setGroup] = React.useState(null)

  const fetchGroup = React.useCallback(async () => {
    const groupResponse = await dispatch(fetchGroupById({user, groupId}))
    setGroup(groupResponse.payload)
    setLoading(false)
  }, [user])

  
  React.useEffect(() => {
    fetchGroup()
  }, [user])

  if (user) {
    if (loading) {
      return <Loader/>
    } else {
      if (user.uid === group?.uid) {
        history.push('/')
      }

      return (
        <div style={{flexGrow: 1}}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {group && <Box textAlign="center" padding={5}>
                <Button variant="contained" color="secondary" onClick={async () => {
                  await dispatch(joinGroup({user, uuid}))
                  history.push(`/group/${groupId}`)
                }}>
                  {`JOIN ${group?.name}`}
                </Button>
              </Box>}
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

JoinGroup.propTypes = {
  user: PropTypes.object,
};

export default JoinGroup
