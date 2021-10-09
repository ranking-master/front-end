import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Button,
  Grid, List, ListSubheader,
} from "@material-ui/core";
import update from 'immutability-helper';

import { Card } from '../Card/Card';

import { ReactComponent as InsertBlockIllustration } from "../../illustrations/insert-block.svg";
import EmptyState from "../EmptyState";
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory } from "react-router-dom";
import { fetchMatchMembers, isMemberInMatchDay, submitRate } from "../../features/match/matchSlice";
import Loader from "../Loader";


const useStyles = makeStyles((theme) => ({
  listRoot: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  listContainerStyle: {
    width: 400
  }
}));

function RatePlayer({user}) {
  const classes = useStyles();
  const dispatch = useDispatch()
  let history = useHistory();
  const {uuid, matchDayId} = useParams()

  const [loading, setLoading] = React.useState(true)
  const [isAllowed, setIsAllowed] = React.useState(false)
  const [members, setMembers] = React.useState([])

  const getPlayersIfAllowed = React.useCallback(async () => {
    setLoading(true)
    const response = await dispatch(isMemberInMatchDay({user, uuid}))
    const output = response.payload.is_authorized && !response.payload.is_expired
    setIsAllowed(output)
    const memberState = await dispatch(fetchMatchMembers({user, matchDayId}))
    const filteredUsers = memberState.payload.filter(member => member.firebase_id !== user.uid)
    setMembers(filteredUsers)
    setLoading(false)
  }, [])


  React.useEffect(() => {
    getPlayersIfAllowed();
  }, [])

  const moveCard = React.useCallback((dragIndex, hoverIndex) => {
    const dragCard = members[dragIndex];
    setMembers(update(members, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragCard],
      ],
    }));
  }, [members]);

  const renderCard = (member, index) => {
    return (<Card key={index + 'member.id'} index={index} id={member.id}
                  text={member.firstName ? member.lastName ? member.firstName + ' ' + member.lastName : member.firstName : member.email}
                  moveCard={moveCard}/>);
  };

  const submitRating = async () => {
    await dispatch(submitRate({user, matchDayId, userIds: members.map(member => member.id)}))
    history.push(`/match-day-detail/${matchDayId}`)
  }

  if (user) {
    if (loading) {
      return <Loader/>
    } else {
      if (!isAllowed) {
        history.push('/')
      } else {
        return (
          <div style={{flexGrow: 1}}>
            <Grid container spacing={3} justifyContent="center" alignItems="center">
              <Grid item xs={12} justifyContent="center" alignItems="center" container>
                <Box textAlign="center" padding={5}>
                  <List
                    subheader={<ListSubheader>Players</ListSubheader>}
                    component="nav"
                    aria-label="secondary mailbox folder"
                    className={classes.listContainerStyle}
                  >
                    {members.map((member, i) => renderCard(member, i))}
                  </List>
                  <Button
                    size="small"
                    color="primary"
                    onClick={submitRating}
                  >
                    Rate Players
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </div>
        );
      }
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
