import axios from "axios";
import { action, observable, toJS } from "mobx";

import { LIST_API } from "../consts";

export interface ISong {
  id: string | number;
  url: string;
  coverSmall: string;
  name: string;
  source: string;
  like: boolean;
  authors?: string;
  localUrl?: string;
}

interface IResponse {
  code: number;
  message: string;
  result: string;
}

const instance = axios.create({
  baseURL: `${LIST_API}/self/api/`,
  headers: { "Content-Type": "application/json" },
  timeout: 10000
});

export default class Favourite {
  public static getInstance() {
    if (!Favourite.instance) {
      Favourite.instance = new Favourite();
    }
    return Favourite.instance;
  }

  private static instance: Favourite;

  @observable public list: ISong[] = [];
  public originList: ISong[] | any = [];

  constructor() {
    this.originList = this.getList();
  }

  @action
  public getList = async () => {
    this.list = this.list.length
      ? this.list
      : ((await instance.get("/")) as any).data || [];

    return this.list;
  };

  @action
  public add = (song: any) => {
    song = JSON.parse(JSON.stringify(toJS(song)));
    song.prevIndexForPos = undefined;
    song.id = song.id.toString();

    instance
      .post("/", song)
      .then((response: any) => {
        if (response.data.code === 200) {
          this.list.unshift(song);
        }
      })
      .catch(error => {
        throw new Error(error);
      });
  };

  @action
  public remove = (song: ISong) => {
    instance
      .delete("/", { params: { id: song.id } })
      .then((response: any) => {
        if (response.data.code === 200) {
          this.list = this.list.filter(el => el.id !== "" + song.id);
        }
      })
      .catch(error => {
        throw new Error(error);
      });
  };

  @action
  public search = (val: string): number => {
    const copy = toJS(this.list);
    for (let i = 0, l = copy.length; i < l; i++) {
      const song = copy[i];
      const name = decodeURIComponent(song.name).toLowerCase();

      if (name.indexOf(val) > -1) {
        return i;
      }
    }

    return -1;
  };

  @action
  public localify = (song: ISong) => {
    instance
      .post("/localify", song)
      .then((response: any) => {
        if (response.data.code !== 200) {
          throw new Error(response.data);
        }
      })
      .catch(error => {
        throw new Error(error);
      });
  };
}
