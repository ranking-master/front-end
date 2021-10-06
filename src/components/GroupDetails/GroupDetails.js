import React, { Component } from "react";

import PropTypes from "prop-types";

import { withRouter } from "react-router-dom";
class GroupDetails extends Component {
  render() {
    return <div>This is group detail page</div>;
  }
}

GroupDetails.propTypes = {
  user: PropTypes.object,
};

export default withRouter(GroupDetails);
