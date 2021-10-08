import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from 'react-redux'
import {
  Box, Button,
  Grid,
} from "@material-ui/core";

import { ReactComponent as InsertBlockIllustration } from "../../illustrations/insert-block.svg";
import EmptyState from "../EmptyState";
import { joinGroup } from "../../features/group/groupSlice";

import { useParams, useHistory } from "react-router-dom";


function JoinGroup({user}) {
  const dispatch = useDispatch()
  let history = useHistory();
  const {uuid, groupId} = useParams()


  if (user) {
    return (
      <div style={{flexGrow: 1}}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box textAlign="center" padding={5}>
              <Button variant="contained" color="secondary" onClick={() => {
                dispatch(joinGroup({user, uuid}))
                history.push(`/group/${groupId}`)
              }}>
                JOIN
              </Button>
            </Box>
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

JoinGroup.propTypes = {
  user: PropTypes.object,
};

export default JoinGroup
