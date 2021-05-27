import React, { useEffect } from "react";
import { withRouter } from "react-router";

const ProtectedRouteWrap = withRouter((props) => {
  useEffect(() => {
    if (!props.access) {
      props.history.replace(props.redirectPath);
    }
  }, []);
  return props.component;
});

export default ProtectedRouteWrap;
