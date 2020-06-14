import { action, observable } from "mobx";
import { WEB_API } from "../consts";

export default class SearchStore {
  @observable public key: string = "李白";
  @observable public songList: any[] = [];

  constructor() {
    if (this.key) {
      this.search(this.key);
    }
  }

  @action
  public setKey(v: string) {
    this.key = v;
  }

  @action
  public setList(list: any[]) {
    this.songList = list;
  }

  public handleFetch(source: string, key: string) {
    return fetch(WEB_API + `/${source}?name=${key}`)
      .then(data => data.json())
      .then(data =>
        data.map((e: any) => ({
          ...e,
          source
        }))
      )
      .then(data => {
        const fetchCoverUrl = data.map((item: any) =>
          fetch(WEB_API + `/${source}?id=${item.pic_id}&type=pic`).then(
            (res: any) => res.json()
          )
        );

        return Promise.all(fetchCoverUrl).then((res: any) => {
          return data.map((item: any, index: number) => {
            item.coverSmall = res[index].url.replace("https", "http");
            return item;
          });
        });
      });
  }

  public handleSerach(key: string, page?: number, limit?: number) {
    return Promise.all([
      this.handleFetch("netease", key),
      this.handleFetch("tencent", key),
      this.handleFetch("xiami", key)
    ]);
  }

  public search(key: string, page?: number, limit?: number) {
    this.handleSerach(key, page, limit).then((data: any) => {
      data = data.reduce(
        (songs: any, current: any) => songs.concat(current),
        []
      );
      this.setList(data);
    });
  }
}
