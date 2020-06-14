import { inject, observer } from "mobx-react";

import * as React from "react";

import Search from "./search";
import Top from "./top";

import PlayWidget from "./play-widget";

import { withRouter } from "react-router";

const TopWithRouter = withRouter(Top);
const SearchWithRouter = withRouter(Search);

@inject("playStore")
@observer
export default class List extends React.Component<
  { component: any; playStore?: any },
  {}
> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    const Ref = this.props.component;
    return (
      <div>
        <TopWithRouter /> <SearchWithRouter /> <Ref />
        {this.props.playStore.curSong && (
          <div style={{ marginBottom: "60px" }} />
        )}
        <PlayWidget />
      </div>
    );
  }
}
