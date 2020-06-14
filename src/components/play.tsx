import { inject, observer } from "mobx-react";
import * as React from "react";
import { Link } from "react-router-dom";

import { WEB_API } from "../consts";
import Player from "../stores/play";
import StackStore from "../stores/stack";

import "./play.scss";

export interface IPlayRouterProps {
  location: any | object;
  history: any | object;
  match: { params: { id: string; source: string; name: string } };
  playStore: Player;
  stackStore: StackStore;
}

// TODO: ✔底部当前播放插件 导入网易歌单 上一曲下一曲随机播放 热门列表 版权造成的异常 上传服务器

interface IPlayStates {
  like: boolean;
}

@inject("playStore")
@inject("stackStore")
@observer
export default class Play extends React.Component<
  IPlayRouterProps,
  IPlayStates
> {
  private id: any;
  private source: any;
  private name: any;

  private playStore: Player;

  private count: number = 0;

  private pm: any;
  private lyLines: any;

  constructor(props: any) {
    super(props);
    const s = this.props.location.state;
    this.id = s.id;
    this.source = s.source;
    this.name = s.name;

    this.playStore = this.props.playStore;
    this.state = { like: s.like };
    this.props.stackStore.setPrevIndex(s.prevIndexForPos + 1);
  }

  public componentDidMount() {
    const s = this.props.location.state;
    this.playStore.init(s, false);
    // fetch(WEB_API + `/${this.source}?id=${s.pic_id}&type=pic`)
    //   .then((res: any) => res.json())
    //   .then(res => {
    //     s.coverSmall = res.url;
    //     this.playStore.init(s, false);
    //   });

    this.playStore.onTimeUpdate(this.scrolling);
  }

  public getLyric = () => {
    this.pm = document.getElementsByClassName("play-main")[0];
    this.lyLines = [].slice.call(document.getElementsByClassName("ly-line"));
  };

  public scrolling = () => {
    requestAnimationFrame(() => {
      const contaionerH = this.pm.clientHeight;
      if (!this.lyLines.length) {
        return;
      }
      this.lyLines.some((element: any) => {
        const curTime = this.playStore.getRawTime();
        const { start, end } = element.dataset;

        if (curTime >= start && curTime <= end) {
          if (!~element.className.indexOf("active")) {
            element.className = "ly-line active";
            const offset = element.offsetTop + 200;
            if (offset > contaionerH) {
              this.pm.scrollTop = offset - contaionerH;
            }
          }
        } else {
          element.className = "ly-line";
        }
      });
    });
  };

  public componentDidUpdate(prevProps: any, prevState: any) {
    this.getLyric();
  }

  public componentWillUnmount() {
    this.playStore.removeListener(this.scrolling);
  }

  public seek = (e: any) => {
    const eleWidth = document
      .getElementsByClassName("app")[0]
      .getBoundingClientRect().width;
    const windowWidth = window.innerWidth;
    const x =
      eleWidth < windowWidth
        ? e.clientX - (windowWidth - eleWidth) / 2
        : e.clientX;

    this.playStore.seek(x / eleWidth);
  };

  // TODO: http://192.168.1.101:8080/play/436514312/netease/%E6%88%90%E9%83%BD?url=test 歌词问题

  public toggleLike = () => {
    this.playStore.likeHandle(this.state.like);
    this.setState({ like: !this.state.like });
  };
  // TODO: 붉은 노을 在我得列表中 歌词修正

  public render() {
    const { playStore } = this.props;
    return (
      <div className="play">
        <div className="play-top">
          {this.playStore.curSong
            ? decodeURIComponent(this.playStore.curSong.name)
            : ""}
        </div>
        <div className="play-main">
          <div
            className="lyric"
            dangerouslySetInnerHTML={{ __html: playStore.lyric }}
          />
        </div>
        <div className="play-bottom">
          <div className="progress" onClick={this.seek}>
            <div className="progress-bar" />
            <div
              className="progress-bar-ing"
              id="pbi"
              style={{ width: playStore.percent * 99 + "%" }}
            />

            <span className="currentTime">{playStore.curTime}</span>
            <span className="duration">{playStore.duration}</span>
          </div>

          <div className="control">
            <span className="like" onClick={this.toggleLike}>
              <span
                className="i_love"
                style={this.state.like ? { color: "#FF0000" } : {}}
              />
            </span>
            <span className="prev" onClick={playStore.prev}>
              <span className="i_previous" />
            </span>
            <span className="pause">
              <span
                className={playStore.paused ? "i_play" : "i_pause"}
                onClick={playStore.play}
              />
            </span>
            <span className="next" onClick={playStore.next}>
              <span className="i_next" />
            </span>
            <span className="repeat" onClick={playStore.toggleRepeat}>
              <span className={playStore.repeat} />
            </span>
          </div>
        </div>
      </div>
    );
  }
}
