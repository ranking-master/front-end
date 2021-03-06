import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { IconButton, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from "@material-ui/core";
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  listStyle: {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: theme.palette.primary.main,
    cursor: 'move',
  },
  buttonHoverCursor: {
    cursor: 'move'
  }
}));

const RatePlayerList = ({id, text, index, moveCard}) => {
  const classes = useStyles();
  const ref = useRef(null);
  const [{handlerId}, drop] = useDrop({
    accept: 'card',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{isDragging}, drag] = useDrag({
    type: 'card',
    item: () => {
      return {id, index};
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <ListItem
      ref={ref}
      data-handler-id={handlerId}
      className={classes.listStyle}
    >
      <ListItemIcon>
        <ListItemText primary={index + 1}/>
      </ListItemIcon>
      <ListItemText primary={text}/>
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="go"
          className={classes.buttonHoverCursor}
        >
          <DragIndicatorIcon/>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
};

export default RatePlayerList
