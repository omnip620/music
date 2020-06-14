import { inject, observer } from "mobx-react";

import { AutoSizer, List } from "react-virtualized";

import * as React from "react";
import { Link } from "react-router-dom";
import Favorite from "../stores/favourite";
import SearchStore from "../stores/search";
import StackStore from "../stores/stack";

import "./hot-list.scss";

interface IList {
  list: any;
}

@inject("searchStore")
@inject("stackStore")
@inject("favStore")
@observer
export default class HotList extends React.Component<
  { searchStore?: SearchStore; stackStore?: StackStore; favStore?: Favorite },
  { rowCount: number }
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
    const list = this.props.searchStore.songList;
    return list[index % list.length];
  };

  public rowRenderer = ({ index, isScrolling, key, style }: any) => {
    const el = this.getDatum(index);
    const { id, source, name, coverSmall, pic_id } = el;
    const authors = el.artist.join(" / ");
    return (
      <div className="li" key={key} style={style}>
        <Link
          to={{
            pathname: `/play`,
            state: {
              authors,
              coverSmall,
              id,
              like: this.props.favStore.list.some(
                (item: any) => item.id === id
              ),
              name,
              pic_id,
              prevIndexForPos: index,
              source
            }
          }}
        >
          <span className="source">
            <img
              src={`./vendors/${el.source}.svg`}
              alt={el.source}
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
            <h4>{el.name}</h4>
            <span className="singer">{authors}</span>
          </div>
        </Link>
      </div>
    );
  };

  public render() {
    const rowCount = this.props.searchStore.songList.length;
    return (
      <div>
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
              scrollToIndex={this.props.stackStore.prevIndex}
              width={width}
            />
          )}
        </AutoSizer>
      </div>
    );
  }
}
