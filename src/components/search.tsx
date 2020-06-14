import { inject, observer } from "mobx-react";
import * as React from "react";
import StackStore from "../stores/stack";

import Favourite from "../stores/favourite";
import SearchStore from "../stores/search";

import "./search.scss";

@inject("searchStore")
@inject("favStore")
@inject("stackStore")
@observer
export default class Search extends React.Component<
  {
    searchStore?: SearchStore;
    match?: any;
    favStore?: Favourite;
    stackStore?: StackStore;
  },
  {}
> {
  private searchStore: SearchStore;
  private favStore: Favourite;
  private stackStore: StackStore;

  constructor(props: any) {
    super(props);
    this.searchStore = this.props.searchStore;
    this.favStore = this.props.favStore;
    this.stackStore = this.props.stackStore;
  }

  public handleChange = (event: any) => {
    this.searchStore.setKey(event.target.value);
  };

  public handleKeyDown = (event: any) => {
    if (event.keyCode === 13) {
      const { match } = this.props;
      if (match.path === "/") {
        this.searchStore.search(this.searchStore.key);
      } else {
        const index = this.favStore.search(this.searchStore.key);
        if (index > -1) {
          this.stackStore.setPrevIndex(index + 2);
          return;
        }
        alert("没有该歌曲");
      }
    }
  };

  public render() {
    return (
      <div className="search">
        <span className="search-prefix" />
        <input
          className="search-main"
          type="text"
          placeholder="search..."
          value={this.props.searchStore.key}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
        <span className="search-suffix" />
      </div>
    );
  }
}
