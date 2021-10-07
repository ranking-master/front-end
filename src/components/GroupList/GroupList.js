import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { TextField, Button } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";

class groupList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: "testpath",
      cart: [
        {
          name: "First Group",
          members: 20,
        },
        {
          name: "Second Group",
          members: 18,
        },
      ],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangemember = this.onChangemember.bind(this);
  }

  handleSubmit(event) {
    this.setState({
      cart: this.state.cart.concat({
        name: this.state.value,
        members: this.state.valuemember,
      }),
    });
    event.preventDefault();
  }

  onChange(event) {
    this.setState({ value: event.target.value });
  }

  onChangemember(event) {
    this.setState({ valuemember: event.target.value });
  }

  render() {
    const { user } = this.props;
    const { cart, path } = this.state;
    const menuItems = {
      name: "gdetails",
      to: user ? `/gdetails/${path}` : null,
    };
    // const styles = makeStyles({
    //   table: {
    //     minWidth: 700,
    //   },
    // });
    // const classes = styles();

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <TextField
            id="filled-basic"
            label="Group name"
            variant="filled"
            value={this.state.value || ""}
            onChange={this.onChange}
          />
          <TextField
            id="filled-basic"
            label="Member count"
            variant="filled"
            value={this.state.valuemember || ""}
            onChange={this.onChangemember}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            value="Submit"
          >
            Create Group
          </Button>
        </form>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Group Name</TableCell>
                <TableCell align="right">Member Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.map((row) => (
                <TableRow
                  key={row.name}
                  component={RouterLink}
                  to={menuItems.to}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.members}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}

groupList.propTypes = {
  user: PropTypes.object,
};

export default withRouter(groupList);
