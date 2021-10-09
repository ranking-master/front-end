import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Button,
  Grid,
} from "@material-ui/core";

import { ReactComponent as InsertBlockIllustration } from "../../illustrations/insert-block.svg";
import EmptyState from "../EmptyState";
import { joinGroup } from "../../features/group/groupSlice";

import { useParams, useHistory } from "react-router-dom";
import { fetchMatchMembers } from "../../features/match/matchSlice";
import Loader from "../Loader";


function RatePlayer({user}) {
  const dispatch = useDispatch()
  let history = useHistory();
  const {uuid, matchDayId} = useParams()

  const members = useSelector((state) => state.match.members)
  const [loading, setLoading] = React.useState(true)
  // const [players, setPlayers] = React.useState([])

  const getPlayers = React.useCallback(async () => {
    setLoading(true)
    await dispatch(fetchMatchMembers({user, matchDayId}))
    // setPlayers(matchMembersState.payload)
    setLoading(false)
  }, [])

  React.useEffect(() => {
    getPlayers();
  }, [])

  if (user) {
    if (loading) {
      return <Loader/>
    } else {
      return (
        <div style={{flexGrow: 1}}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box textAlign="center" padding={5}>
                <Button variant="contained" color="secondary" onClick={() => {
                  dispatch(joinGroup({user, uuid}))
                  history.push(`/group/${matchDayId}`)
                }}>
                  JOIN
                </Button>
              </Box>
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

RatePlayer.propTypes = {
  user: PropTypes.object,
};

export default RatePlayer
