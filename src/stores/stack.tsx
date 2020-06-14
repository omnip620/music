import { action, observable } from "mobx";
export default class Stack {
  @observable public prevIndex: number = 0;

  @action
  public setPrevIndex(index: number) {
    this.prevIndex = index;
  }
}
