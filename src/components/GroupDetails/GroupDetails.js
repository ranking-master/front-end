import React, { Component } from "react";

import PropTypes from "prop-types";

import { withRouter } from "react-router-dom";
import EmptyState from "../EmptyState";
import { ReactComponent as InsertBlockIllustration } from "../../illustrations/insert-block.svg";
class GroupDetails extends Component {
  render() {
    return (
      <div>
        <EmptyState
          image={<InsertBlockIllustration />}
          title="Group Details"
          description="This is Group details page"
        />
      </div>
    );
  }
}

GroupDetails.propTypes = {
  user: PropTypes.object,
};

export default withRouter(GroupDetails);
