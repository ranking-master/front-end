import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from 'react-redux'
import {
  Box, Button,
  Grid, List, ListSubheader, Typography,
} from "@material-ui/core";
import update from 'immutability-helper';

import RatePlayerList from '../RatePlayerList';

import { ReactComponent as InsertBlockIllustration } from "../../illustrations/insert-block.svg";
import EmptyState from "../EmptyState";
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory } from "react-router-dom";
import {
  fetchMatchMembers,
  isMemberInMatchDay,
  submitRate,
  isRateSubmitted,
  fetchMatchDayById
} from "../../features/match/matchSlice";
import Loader from "../Loader";
import UnAuthenticated from "../UnAuthenticated";
import { formatName } from "../../data/formatName";


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
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [members, setMembers] = React.useState([])
  const [matchDay, setMatchDay] = React.useState(null)
  const [thankYou, setThankYou] = React.useState(false)

  const getPlayersIfAllowed = React.useCallback(async () => {
    if (user) {
      setLoading(true)
      const response = await dispatch(isMemberInMatchDay({user, uuid}))
      const output = response.payload.is_authorized && !response.payload.is_expired
      setIsAllowed(output)
      const submittedResponse = await dispatch(isRateSubmitted({user, matchDayId}))
      setIsSubmitted(submittedResponse.payload.is_already_rated);
      const memberState = await dispatch(fetchMatchMembers({user, matchDayId}))
      const filteredUsers = memberState.payload.filter(member => member.firebase_id !== user.uid)
      setMembers(filteredUsers)
      setLoading(false)
    }
  }, [user])


  React.useEffect(() => {
    getPlayersIfAllowed();
  }, [user])

  const getMatchDay = React.useCallback(async () => {
    const matchDayResponse = await dispatch(fetchMatchDayById({user, matchDayId}))
    setMatchDay(matchDayResponse.payload)
  }, [thankYou])

  React.useEffect(() => {
    getMatchDay()
  }, [thankYou])

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
    return (
      <RatePlayerList
        key={index + 'member.id'}
        index={index}
        id={member.id}
        text={formatName(member)}
        moveCard={moveCard}
      />
    );
  };

  const submitRating = async () => {
    await dispatch(submitRate({user, matchDayId, userIds: members.map(member => member.id)}))
    setThankYou(true)
  }

  if (user) {
    if (loading) {
      return <Loader/>
    } else {
      if (!isAllowed) {
        history.push('/')
      } else {
        if (thankYou) {
          return (
            <EmptyState
              image={<InsertBlockIllustration/>}
              title={`Thank you for submitting your rating for ${matchDay.name}`}
              description={`The player's scores will be updated once the remaining players submit their ${matchDay.name} ratings.`}
            />
          )
        }

        if (isSubmitted) {
          return (
            <EmptyState
              image={<InsertBlockIllustration/>}
              title="Rating already submitted for this match day"
            />
          )
        }

        return (
          <div style={{flexGrow: 1}}>
            <Grid container spacing={3} justifyContent="center" alignItems="center">
              <Grid item xs={12} justifyContent="center" alignItems="center" container>
                <Box textAlign="center" padding={5}>
                  <Typography>
                    Rate the players by press and drag to <br/> their respective rankings for this match day
                  </Typography>
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
    <UnAuthenticated/>
  );
}

RatePlayer.propTypes = {
  user: PropTypes.object,
};

export default RatePlayer
