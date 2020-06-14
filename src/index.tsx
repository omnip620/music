import { Provider } from "mobx-react";
import "normalize.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/app";
import Favourite from "./stores/favourite";
import PlayStore from "./stores/play";
import SearchStore from "./stores/search";
import Stack from "./stores/stack";

const ps = new PlayStore();
const ss = new SearchStore();
const stack = new Stack();
const fav = Favourite.getInstance();
ReactDOM.render(
  <Provider playStore={ps} searchStore={ss} stackStore={stack} favStore={fav}>
    <App />
  </Provider>,
  document.getElementById("index")
);
