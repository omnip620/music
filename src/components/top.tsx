import { inject, observer } from "mobx-react";
import * as React from "react";
import { Link } from "react-router-dom";
import StackStore from "../stores/stack";

import "./top.scss";

@inject("stackStore")
export default class Top extends React.Component<
  { match: any; location: any; history: any; stackStore?: StackStore },
  {}
> {
  public handleClick = () => {
    this.props.stackStore.setPrevIndex(0);
  };

  public render() {
    const { path } = this.props.match;
    return (
      <h1 className="tag">
        <Link to="/">
          <span className={path === "/" ? "active" : ""}>热门</span>
        </Link>
        {/* <span>分类</span> */}
        <Link to="/fav">
          <span className={path === "/fav" ? "active" : ""}>我的</span>
        </Link>
      </h1>
    );
  }
}
