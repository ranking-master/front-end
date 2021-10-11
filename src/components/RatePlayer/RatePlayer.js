import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from 'react-redux'
import {
  Box, Button,
  Grid, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Typography,
} from "@material-ui/core";

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
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";


const useStyles = makeStyles((theme) => ({
  listRoot: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  listContainerStyle: {
    width: 400
  },
  listStyle: {
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: theme.palette.primary.light,
    cursor: 'move',
  },
  buttonHoverCursor: {
    cursor: 'move'
  }
}));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};


function RatePlayer({user}) {
  const classes = useStyles();
  const dispatch = useDispatch()
  let history = useHistory();
  const {uuid, matchDayId} = useParams()

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newMembers = reorder(
      members,
      result.source.index,
      result.destination.index
    );

    setMembers(newMembers)
  }

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
            <Grid container spacing={3} justifyContent="center" alignItems="center" xs={12}>
              <Grid item xs={12} justifyContent="center" alignItems="center" container>
                <Box textAlign="center" padding={5}>
                  <Typography variant="h6" gutterBottom>
                    Rate the players by pressing and then dragging to <br/> their respective rankings for this match day
                  </Typography>
                  {members && <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                      {(provided, snapshot) => (
                        <List
                          subheader={<ListSubheader>Players</ListSubheader>}
                          component="nav"
                          classes={classes.listContainerStyle}
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {members.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided, snapshot) => (
                                <ListItem
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={classes.listStyle}
                                >
                                  <ListItemIcon>
                                    <ListItemText primary={index + 1}/>
                                  </ListItemIcon>
                                  <ListItemText primary={formatName(item)}/>
                                </ListItem>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </List>
                      )}
                    </Droppable>
                  </DragDropContext>}


                  <Button
                    size="small"
                    color="primary"
                    onClick={submitRating}
                  >
                    Submit Rating
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
