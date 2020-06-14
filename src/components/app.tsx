// import createBrowserHistory from "history/createBrowserHistory";

import * as React from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";
import HotList from "./hot-list";

import "./app.scss";
import List from "./list";
import Play from "./play";

import Fav from "./recent-list";

// const history = createBrowserHistory();

const WrapFav = () => <List component={Fav} />;
const WrapHot = () => <List component={HotList} />;

export class App extends React.Component<{}, {}> {
  public render() {
    return (
      <div>
        <Router>
          <div className="app">
            <Route exact={true} path="/" component={WrapHot} />
            <Route path="/play" component={Play} />
            <Route exact={true} path="/fav" component={WrapFav} />
          </div>
        </Router>
      </div>
    );
  }
}
