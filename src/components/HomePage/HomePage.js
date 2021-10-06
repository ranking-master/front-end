import React from "react";

import PropTypes from "prop-types";
import { useSelector, useDispatch } from 'react-redux'
import { decrement, incrementByAmount } from '../../features/counter/counterSlice'

import { withRouter } from "react-router-dom";

import { auth } from "../../firebase";

import authentication from "../../services/authentication";

import EmptyState from "../EmptyState";

import { ReactComponent as CabinIllustration } from "../../illustrations/cabin.svg";
import { ReactComponent as InsertBlockIllustration } from "../../illustrations/insert-block.svg";

function HomePage({user}) {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()

  React.useEffect(() => {
    signInWithEmailLink(user)
  }, [])

  const signInWithEmailLink = (user) => {
    if (user) {
      return;
    }

    const emailLink = window.location.href;

    if (!emailLink) {
      return;
    }

    if (auth.isSignInWithEmailLink(emailLink)) {
      let emailAddress = localStorage.getItem("emailAddress");

      if (!emailAddress) {
        this.props.history.push("/");

        return;
      }

      authentication
        .signInWithEmailLink(emailAddress, emailLink)
        .then((value) => {
          const user = value.user;
          const displayName = user.displayName;
          const emailAddress = user.email;

          this.props.openSnackbar(
            `Signed in as ${displayName || emailAddress}`
          );
        })
        .catch((reason) => {
          const code = reason.code;
          const message = reason.message;

          switch (code) {
            case "auth/expired-action-code":
            case "auth/invalid-email":
            case "auth/user-disabled":
              this.props.openSnackbar(message);
              break;

            default:
              this.props.openSnackbar(message);
              return;
          }
        })
        .finally(() => {
          this.props.history.push("/");
        });
    }
  };


  if (user) {
    return (
      <>
        <EmptyState
          image={<CabinIllustration/>}
          title="Home"
          description="This is the home page. You can edit it from HomePage.js."
        />
        <div>
          <div>
            <button
              aria-label="Increment value"
              onClick={() => dispatch(incrementByAmount(10))}
            >
              Increment
            </button>
            <span>{count}</span>
            <button
              aria-label="Decrement value"
              onClick={() => dispatch(decrement())}
            >
              Decrement
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <EmptyState
      image={<InsertBlockIllustration/>}
      title="RMUIF"
      description="Supercharged version of Create React App with all the bells and whistles."
    />
  );
}

HomePage.propTypes = {
  user: PropTypes.object,
};

export default withRouter(HomePage);
