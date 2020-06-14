import * as React from "react";
import { Link } from "react-router-dom";

import { inject, observer } from "mobx-react";
import Player from "../stores/play";

import "./play-widget.scss";

@inject("playStore")
@observer
export default class PlayWidget extends React.Component<
  { playStore?: Player },
  {}
> {
  private curSong: any;

  public constructor(props: any) {
    super(props);
    this.curSong = {
      authors: "李荣浩",
      coverSmall:
        "http://p1.music.126.net/Qdi7VcmK2-FH9na5N8CtdA==/1362294906878892.jpg?param=140y140",
      id: 27678655,
      like: true,
      name: "李白",
      source: "netease",
      url:
        "http://m10.music.126.net/20180305164404/f2682a37828a1fe0808b9a98a3a105b7/ymusic/e801/2c76/4a91/9c4194a49ce9aaf631c807f010438fd2.mp3"
    };
  }

  public togglePlay = () => {
    this.props.playStore.play();
  };

  public render() {
    const curSong = this.props.playStore.curSong;
    // const curSong = this.curSong;

    if (curSong) {
      const { authors, coverSmall, name } = curSong;
      const { playStore } = this.props;
      return (
        <div className="pw">
          <Link
            to={{
              pathname: `/play`,
              state: curSong
            }}
            className="pw-to"
          >
            <img
              src={coverSmall}
              alt="logo"
              width="40"
              height="40"
              className={
                playStore.paused ? "pw-logo" : "pw-logo pw-logo-rotate"
              }
            />
            <span className="pw-info">
              <span className="pw-name">{decodeURIComponent(name)}</span>
              <span>{decodeURIComponent(authors)} </span>
            </span>
          </Link>
          <span
            className={playStore.paused ? "pw-play i_play" : "pw-play i_pause"}
            onClick={this.togglePlay}
          />
        </div>
      );
    } else {
      return "";
    }
  }
}
