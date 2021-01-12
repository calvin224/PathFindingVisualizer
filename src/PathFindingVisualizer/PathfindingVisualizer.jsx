import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstra } from "../Algorithms/Dijkstra";
import { bfs } from "../Algorithms/bfs";
import { dfs } from "../Algorithms/dfs";
import "./PathfindingVisualizer.css";
// default values
var startNodeColumn = 10;
var startNodeRow = 10;
var finishNodeColumn = 35;
var finishNodeRow = 10;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }
  /* Listener actions*/
  componentDidMount() {
    const grid = getStarterGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }
  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }
  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }
  /*Animates differnet algorithms*/
  animate(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const nodeClassName = document.getElementById(
          `node-${node.row}-${node.col}`
        ).className;
        if (
          nodeClassName !== "node node-start" &&
          nodeClassName !== "node node-finish"
        ) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited";
        }
      }, 10 * i);
    }
  }
  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[startNodeRow][startNodeColumn];
    const finishNode = grid[finishNodeRow][finishNodeColumn];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animate(visitedNodesInOrder, nodesInShortestPathOrder);
  }
  visualizebfs() {
    const { grid } = this.state;
    const startNode = grid[startNodeRow][startNodeColumn];
    const finishNode = grid[finishNodeRow][finishNodeColumn];
    const visitedNodesInOrder = bfs(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animate(visitedNodesInOrder, nodesInShortestPathOrder);
  }
  visualizeDFS() {
    const { grid } = this.state;
    const startNode = grid[startNodeRow][startNodeColumn];
    const finishNode = grid[finishNodeRow][finishNodeColumn];
    const visitedNodesInOrder = dfs(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animate(visitedNodesInOrder, nodesInShortestPathOrder);
  }
  /*Constant animation*/
  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];

        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  }
  fn1() {
    startNodeColumn =parseInt(document.getElementById("text2").value)-1;
    const grid = getStarterGrid();
    this.setState({ grid });
 }
 fn2(){
     startNodeRow = parseInt(document.getElementById("text1").value)-1;
     const grid = getStarterGrid();
     this.setState({ grid });
  }
  fn3() {
    finishNodeColumn =parseInt(document.getElementById("text4").value)-1;
    const grid = getStarterGrid();
    this.setState({ grid });
 }
 fn4(){
     finishNodeRow = parseInt(document.getElementById("text3").value)-1;
     const grid = getStarterGrid();
     this.setState({ grid });
  }
  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstra's Algorithm
        </button>
        <button onClick={() => this.visualizeDFS()}>
          Visualize Depth-First Search Algorithm
        </button>
        <button onClick={() => this.visualizebfs()}>
          Visualize Breadth-first Search Algorithm
        </button>
        <button onClick={() => this.componentDidMount()}>clear walls</button>
        <h3>instructions:</h3>
        <div3>
          You can place walls by clicking on white tiles, then click on desired
          path finding Algorithm
        </div3><br></br>
        <div4>
          <input id="text1" placeholder="Start node Row"></input>
          <button onClick={() => this.fn2()}>
          change
        </button>
        <input id="text2" placeholder="Start node Column"></input>
          <button onClick={() => this.fn1()}>
          change
        </button>
        <br></br>
        <input id="text3" placeholder="Finish node Row"></input>
          <button onClick={() => this.fn4()}>
          change
        </button>
        <input id="text4" placeholder="Finish node Column"></input>
          <button onClick={() => this.fn3()}>
          change
        </button>
        <br></br>
        <div5>
          Above you can change both the Start and the Finish nodes
          <br></br>
          Grid is 20 rows by 50 columns
        </div5>
        </div4>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      <footer><p>Made by Calvin Power(19242921)</p></footer>
      </>
    );
  }
}

const getStarterGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};
const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === startNodeRow && col === startNodeColumn,
    isFinish: row === finishNodeRow && col === finishNodeColumn,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};
const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
