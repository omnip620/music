import { action, observable } from "mobx";

import { WEB_API } from "../consts";

import { ISong } from "../models/cur-song";
import { IPlayer } from "../models/player";

import { b64DecodeUnicode, pad } from "../utils";

import Fav from "./favourite";

export default class Player implements IPlayer {
  @observable public duration: string;
  @observable public curTime: string;
  @observable public paused: boolean = true;
  @observable public id: string | number;
  @observable public percent: number = 0;
  @observable public lyric: string = "...";
  @observable public repeat: string = "i_random";

  @observable public curSong: ISong;

  private fav = (Fav as any).getInstance();

  private history: any;

  private timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g;

  private audio: HTMLAudioElement;

  private autoPlay: boolean = false;

  private repeatNames = ["i_random", "i_repeat", "i_repeat_1"];

  constructor() {
    this.fk();
  }

  public fk() {
    this.audio = new Audio();
    this.audio.load();
    this.audio.addEventListener("loadedmetadata", this.onLoadedMetaData);
    this.audio.addEventListener("ended", this.onEnded);
    this.audio.addEventListener("play", this.onPlay);
    this.audio.addEventListener("timeupdate", this.percentHandle);
    this.audio.addEventListener("timeupdate", this.timing);
    // this.audio.addEventListener("canplay", this.onCanPlay);
    this.audio.addEventListener("seeked", this.onSeeked);
    this.audio.addEventListener("pause", this.onPause);
    this.audio.addEventListener("loadeddata", this.onLoadedData);

    (window as any).setVolume = this.setVolume;
    this.audio.autoplay = true;
    this.setVolume(0.25);
  }

  public onSeeked = () => {
    if (this.audio.paused) {
      this.play();
    }
  };

  public onLoadedData = () => {
    if (this.audio.readyState >= 2) {
      this.audio.play();
    }
  };

  public onPlay = () => {
    this.paused = false;
  };

  public onPause = () => {
    this.paused = true;
  };

  public onCanPlay = () => {
    if (this.autoPlay) {
      this.play();
    }
  };

  public onLoadedMetaData = () => {
    this.setDuration(this.audio.duration);
  };

  public onEnded = () => {
    if (this.repeat === "i_repeat_1") {
      this.play();
    }

    if (this.repeat === "i_repeat") {
      this.next();
    }

    if (this.repeat === "i_random") {
      this.random();
    }
  };

  public random = () => {
    const list = this.fav.list;
    const index = ~~(Math.random() * list.length);
    this.init(list[index + 1], true);
  };

  public onTimeUpdate = (cb: any) => {
    this.audio.addEventListener("timeupdate", cb);
  };

  public removeListener = (cb: any) => {
    this.audio.removeEventListener("timeupdate", cb);
  };

  public setVolume = (val: number) => {
    this.audio.volume = val;
  };

  @action
  public toggleRepeat = () => {
    const index = this.repeatNames.indexOf(this.repeat);
    this.repeat = this.repeatNames[(index + 1) % this.repeatNames.length];
  };

  @action
  public async init(song: ISong, autoPlay: boolean) {
    const { id, source, localUrl = "" } = song;
    this.history = history;
    if (this.id === id) {
      return this.audio;
    }
    this.audio.src = null;
    this.audio.load();
    const url =
      localUrl ||
      (await fetch(`${WEB_API}/${source}?id=${id}&type=url`)
        .then(data => data.json())
        .then(data => {
          return data;
        })
        .then(data => data.url));
    if (!url) {
      alert("无版权或需要付费，请选择其它平台！");
      return;
    }
    if (!localUrl) {
      this.fav.localify(song);
    }
    this.id = id;
    this.curTime = "0:00";
    this.duration = "0:00";
    this.percent = 0;

    this.audio.src = url;
    this.autoPlay = autoPlay;
    this.curSong = { ...song, url };
    this.audio.play().catch();
    this.getLyric();
  }

  @action
  public pause = () => {
    this.audio.pause();
  };

  public likeHandle = (flag: boolean) => {
    if (flag) {
      this.fav.remove(this.curSong);
      this.curSong.like = false;
      return;
    }
    this.curSong.like = true;
    this.fav.add(this.curSong);
  };

  @action
  public setDuration = (duration: number) => {
    this.duration = ~~(duration / 60) + ":" + pad(duration % 60);
  };

  @action
  public play = () => {
    const song = this.audio;
    if (!song.paused) {
      this.pause();
      return;
    }

    song.play().catch(e => alert("无版权或需要付费，请选择其它平台！"));
  };

  public timing = () => {
    const min = this.audio.currentTime / 60;
    const sec = pad(this.audio.currentTime % 60);
    this.setCurTime(~~min + ":" + sec);
  };

  public percentHandle = () => {
    if (isNaN(this.audio.duration)) {
      this.percent = 0;
      return;
    }
    this.percent = this.audio.currentTime / this.audio.duration;
  };

  @action
  public setCurTime = (currentTime: string) => {
    this.curTime = currentTime;
  };

  @action
  public seek = (percent: number) => {
    this.audio.currentTime = percent * this.audio.duration;
  };

  @action
  public setLyric = (ly: string) => {
    this.lyric = ly;
  };

  public prev = () => {
    const list = this.fav.list;

    list.some((el: any, index: any) => {
      if (el.id === this.curSong.id) {
        if (index === 0) {
          alert("已经到第一首");
          return;
        }
        this.init(list[index - 1], true);
        return true;
      }
    });
  };

  public next = () => {
    const list = this.fav.list;
    const len = list.length;

    list.some((el: any, index: any) => {
      if (el.id === this.curSong.id) {
        if (index + 1 === len) {
          alert("已到最后一首");
          return;
        }
        this.init(list[index + 1], true);
        return true;
      }
    });
  };

  public getRawTime = () => {
    return this.audio.currentTime;
  };

  public getLyric = () => {
    fetch(`${WEB_API}/${this.curSong.source}?id=${this.curSong.id}&type=lyric`)
      .then(res => res.json())
      .then(res => this.renderPlayLyric(res.lyric));
  };

  public toRawTime = (line: string) => {
    const res: any = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g.exec(line);
    if (res) {
      return +res[1] * 60 + +res[2] + (+res[3] || 0) / 1000;
    }
    return null;
  };

  public renderPlayLyric = (lyr: string) => {
    if (this.curSong.source === "xiami") {
      lyr = lyr.replace(/<[^>]+>/g, "");
    }

    lyr = lyr
      .split("\n")
      .filter(el => !!el)
      .map((line: any, index: number, arr: any[]) => {
        const dataStart = this.toRawTime(line);
        const dataEnd =
          index + 1 === arr.length ? dataStart : this.toRawTime(arr[index + 1]);

        const tag = line.match(
          new RegExp(`\\[(ti|by|offset|al|ar):([^\\]]*)]`, "i")
        );

        return `<div
                key=${index}
                data-start=${dataStart}
                data-end=${dataEnd}
                class="ly-line"
              >${tag ? tag[2] : line.replace(this.timeExp, "").trim()}</div>`;
      })
      .join("");

    this.setLyric(lyr);
  };
}
