import React from "react";
import EmptyState from "../EmptyState";
import { ReactComponent as InsertBlockIllustration } from "../../illustrations/insert-block.svg";

const UnAuthenticated = () => {
  return (
    <EmptyState
      image={<InsertBlockIllustration/>}
      title="Ranking Pro"
      description="The rating app you need for your next game"
    />
  )
}

export default UnAuthenticated
