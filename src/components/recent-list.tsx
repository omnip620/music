import { inject, observer } from "mobx-react";

import * as React from "react";

import { AutoSizer, List } from "react-virtualized";

import LazyLoad from "react-lazyload";
import { Link } from "react-router-dom";
import Favourite from "../stores/favourite";
import StackStore from "../stores/stack";

import "./hot-list.scss";

interface IList {
  list: any;
}

@inject("stackStore")
@inject("favStore")
@observer
export default class Fav extends React.Component<
  { stackStore?: StackStore; favStore?: Favourite },
  {}
> {
  public constructor(props: any) {
    super(props);
  }

  public onImgError(event: any) {
    event.target.src = "./vendors/default_album.jpg";
  }

  public noRowsRenderer = () => {
    return <div>No rows</div>;
  };

  public getDatum = (index: number) => {
    const list: any = this.props.favStore.list;
    return list[index % list.length];
  };

  public rowRenderer = ({ index, isScrolling, key, style }: any) => {
    const el = this.getDatum(index);
    const { id, source, name, coverSmall, authors, like, localUrl } = el;

    return (
      <div className="li" key={key} style={style}>
        <Link
          to={{
            pathname: `/play`,
            state: {
              authors: decodeURIComponent(authors),
              coverSmall,
              id,
              like,
              localUrl,
              name: decodeURIComponent(name),
              prevIndexForPos: index,
              source
            }
          }}
        >
          <span className="source">
            <img
              src={`./vendors/${el.source}.svg`}
              alt="netease"
              width="15"
              height="15"
              className="logo"
            />
            {coverSmall && (
              <img
                src={coverSmall}
                alt="netease"
                width="50"
                height="50"
                className="cover"
                onError={this.onImgError}
              />
            )}
          </span>
          <div className="info">
            <h4>{decodeURIComponent(name)}</h4>
            <span className="singer">{decodeURIComponent(authors)}</span>
          </div>
        </Link>
      </div>
    );
  };

  public render() {
    const rowCount = this.props.favStore.list.length;
    const index = this.props.stackStore.prevIndex;
    return (
      <AutoSizer disableHeight={true}>
        {({ width }: any) => (
          <List
            className="hot-list"
            height={window.screen.height - 71 - 34}
            overscanRowCount={0}
            noRowsRenderer={this.noRowsRenderer}
            rowCount={rowCount}
            rowHeight={60}
            rowRenderer={this.rowRenderer}
            scrollToIndex={index}
            width={width}
          />
        )}
      </AutoSizer>
    );
  }
}
