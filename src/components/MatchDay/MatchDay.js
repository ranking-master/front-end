import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { fetchMembers } from "../../features/member/memberSlice";
import Loader from "../Loader";
import { TextField } from "@material-ui/core";
import { createMatch } from "../../features/match/matchSlice";
import UnAuthenticated from "../UnAuthenticated";
import { formatName } from "../../data/formatName";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
  },
  list: {
    width: 400,
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  submitRoot: {
    flexGrow: 1,
    overflow: 'hidden',
    padding: theme.spacing(0, 3),
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  innerRoot: {margin: '10px'}
}));

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

function MatchDay({user}) {
  const classes = useStyles();
  const dispatch = useDispatch()
  const {groupId} = useParams()
  const history = useHistory()
  const [loading, setLoading] = React.useState(true)

  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([]);
  const [right, setRight] = React.useState([]);
  const [matchName, setMatchName] = React.useState('')

  const getMembers = React.useCallback(async () => {
    const membersState = await dispatch(fetchMembers({user, groupId}))
    setLeft(membersState.payload)
    setRight([])
    setLoading(false)
  }, [])

  React.useEffect(() => {
    getMembers();
  }, [])

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleMatchNameChange = (event) => {
    if (!event) {
      return;
    }

    const matchName = event.target.value

    setMatchName(matchName)
  }

  const createMatchDay = () => {
    dispatch(createMatch({user, groupId, matchName, userIds: right.map(item => item.id)}))
    setMatchName('')
    history.push(`/group/${groupId}`)
  }

  const customList = (title, items) => (
    <Card>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
            inputProps={{'aria-label': 'all items selected'}}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider/>
      <List className={classes.list} dense component="div" role="list">
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem key={value.id} role="listitem" button onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{'aria-labelledby': labelId}}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={formatName(value)}/>
            </ListItem>
          );
        })}
        <ListItem/>
      </List>
    </Card>
  );

  if (user) {
    if (loading) {
      return <Loader/>
    } else {
      return (
        <div>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            className={classes.root}
          >
            <Grid item>{customList('Players', left)}</Grid>
            <Grid item>
              <Grid container direction="column" alignItems="center">
                <Button
                  variant="outlined"
                  size="small"
                  className={classes.button}
                  onClick={handleCheckedRight}
                  disabled={leftChecked.length === 0}
                  aria-label="move selected right"
                >
                  &gt;
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  className={classes.button}
                  onClick={handleCheckedLeft}
                  disabled={rightChecked.length === 0}
                  aria-label="move selected left"
                >
                  &lt;
                </Button>
              </Grid>
            </Grid>
            <Grid item>{customList('Chosen players', right)}</Grid>
          </Grid>
          <div
            className={classes.submitRoot}
          >
            <Grid container justifyContent="center" alignItems="center" className={classes.innerRoot}>
              <TextField
                id="outlined-basic"
                label="Match name"
                variant="outlined"
                onChange={handleMatchNameChange}
                value={matchName}
              />
            </Grid>
            <Grid container justifyContent="center" alignItems="center" className={classes.innerRoot}>
              <Button color="primary" onClick={createMatchDay}>
                Create Match Day
              </Button>
            </Grid>
          </div>
        </div>
      )
    }
  }

  return (
    <UnAuthenticated/>
  );


}

MatchDay.protoTypes = {
  user: PropTypes.object
}

export default MatchDay
