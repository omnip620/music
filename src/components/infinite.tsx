// import { inject, observer } from "mobx-react";

// import * as React from "react";

// import List from "react-virtualized/dist/commonjs/List";

// export default class Infinite extends React.Component<
//   { className?: string; children?: any },
//   { beforeH: number; afterH: number; curInex: number; scrollToIndex: any }
// > {
//   private listDOM: any = { scrollTop: 0 };

//   private scrollCount: number = 0;

//   constructor(props: any) {
//     super(props);
//     this.state = {
//       afterH: 0,
//       beforeH: 0,
//       curInex: 0,
//       scrollToIndex: undefined
//     };
//   }

//   public componentDidMount() {
//     // this.listDOM.addEventListener("scroll", this.onScroll);
//     // console.log(React.Children.count(this.props.children));
//   }

//   public onScroll = () => {
//     // console.log(
//     //   this.listDOM.scrollTop,
//     //   ~~(this.listDOM.scrollTop / 300),
//     //   this.listDOM.scrollTop % 300
//     // );

//     this.setState({ curInex: ~~(this.listDOM.scrollTop / 300) });
//     // if (this.scrollCount++ >= 20) {
//     //   this.setState({ curInex: this.state.curInex + 1 });
//     //   this.scrollCount = 0;
//     // }
//   };

//   public _noRowsRenderer() {
//     return <div className="no-rows">No rows</div>;
//   }

//   public getDatum = (index: number) => {
//     const list = this.props.children;

//     return list[index % this.props.children.length];
//   };

//   public rowRenderer = ({ index, isScrolling, key, style }) => {
//     let datum = this.getDatum(index);
//     datum = datum.props.children.props.to.state;

//     return (
//       <div key={key} className="li">
//         <div>{datum.authors}</div>
//         <div>
//           <div>{datum.name}</div>
//           <div>This is row {index}</div>
//         </div>
//       </div>
//     );
//   };

//   public render() {
//     // console.log(this.props.className, "----");
//     // const start = this.state.curInex * 5;
//     // const end = start + 30;

//     // const startH = this.state.curInex * 300 + this.listDOM.scrollTop % 300;
//     // const afterH = (this.props.children.length - end) * 60;
//     return (
//       <div
//         className={this.props.className}
//         style={{ height: window.screen.height - 71 - 34 }}
//       >
//         <List
//           ref={(ref: any) => (this.listDOM = ref)}
//           className={this.props.className}
//           height={window.screen.height - 71 - 34}
//           // overscanRowCount={overscanRowCount}
//           noRowsRenderer={this._noRowsRenderer}
//           rowCount={this.props.children.length}
//           rowHeight={60}
//           rowRenderer={this.rowRenderer}
//           scrollToIndex={this.state.scrollToIndex}
//           width={400}
//         />
//       </div>
//     );
//   }
// }
