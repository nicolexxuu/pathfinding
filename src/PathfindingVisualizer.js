import React, { Component } from 'react'; // why
import Node from './Node';
import { bfs } from './algorithms/bfs'; // why braces
import { dfs } from './algorithms/dfs';
import { dijkstras } from './algorithms/dijkstras';
import { aStar } from './algorithms/aStar';


export default class PathfindingVisualizer extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            START_NODE_ROW: 5,
            START_NODE_COL: 5,
            END_NODE_ROW: 10,
            END_NODE_COL: 4,
            ROW_COUNT: 20,
            COL_COUNT: 30,
            currRow: 0,
            currCol: 0,
            mousePressed: false, //??
        }

        this.handleMouseDown = this.handleMouseDown.bind(this); // https://reactjs.org/docs/handling-events.html
        // this.handleMouseLeave = this.handleMouseLeave.bind(this);
        // this.toggleIsRunning = this.toggleIsRunning.bind(this);
    }

    componentDidMount() { // what is this for?
        const grid = this.getInitialGrid();
        this.setState({ grid });
    }

    /**** set up initial grid ****/
    getInitialGrid = (
        rowCount = this.state.ROW_COUNT,
        colCount = this.state.COL_COUNT,
    ) => {
        const initialGrid = [];
        for (let r = 0; r < rowCount; r++) {
            const currRow = [];
            for (let c = 0; c < colCount; c++) {
                currRow.push(this.createNode(r, c)); // localilty?
            }
            initialGrid.push(currRow);
        }

        return initialGrid;
    }

    createNode = (row, col) => {
        return {
            row,
            col,
            isStart: row === this.state.START_NODE_ROW && col === this.state.START_NODE_COL,
            isEnd: row === this.state.END_NODE_ROW && col === this.state.END_NODE_COL,
            distance: Infinity,
            isVisited: false,
            isWall: false,
            prevNode: null,
            //isNode: true
        };
    }

    handleMouseDown(row, col) {
        // if grid is clear
        //https://stackoverflow.com/questions/37755997/why-cant-i-directly-modify-a-components-state-really
        // why external method in github version?
        console.log(row + " " + col);
        const newGrid = this.state.grid.slice();
        newGrid[row][col] = {
            ...newGrid[row][col],
            isWall: true,
        }

        this.setState({
            grid: newGrid,
            mousePressed: true,
            currRow: row,
            currCol: col,
        });
    }

    /**** reset grid ****/
    clearGrid() { // isRunning, updae state
        const newGrid = this.state.grid.slice();
        for (const r of newGrid) {
            for (const n of r) {
                const node = document.getElementById(`node-${n.row}-${n.col}`);
                node.className = node.className.replace('animate-node-visited ', '');

                n.isVisited = false;
                n.distance = Infinity;
                n.prevNode = null;
            }
        }
    }

    clearWalls() {
        const newGrid = this.state.grid.slice();
        for (const r of newGrid) {
            for (const n of r) {
                const node = document.getElementById(`node-${n.row}-${n.col}`);
                node.className = node.className.replace('node-wall bg-slate-300 ', '');
                n.isWall = false;
            }
        }
    }

    /**** animate algorithms ****/
    visualize(algo) {
        // isrunning
        this.clearGrid(); // why this
        const grid = this.state.grid;

        const startNode = grid[this.state.START_NODE_ROW][this.state.START_NODE_COL];
        const endNode = grid[this.state.END_NODE_ROW][this.state.END_NODE_COL];

        let orderVisited;
        switch (algo) {
            case 'bfs':
                orderVisited = bfs(grid, startNode, endNode);
                break;
            case 'dfs':
                orderVisited = dfs(grid, startNode, endNode);
                break;
            case 'dijkstras':
                orderVisited = dijkstras(grid, startNode, endNode);
                break;
            case 'a-star':
                orderVisited = aStar(grid, startNode, endNode);
                break;
            default:
                break;
        }

        this.animate(orderVisited);
    }

    animate(orderVisited) {
        for (let i = 0; i < orderVisited.length; i++) {
            setTimeout(() => {
                const r = orderVisited[i].row, c = orderVisited[i].col;
                const node = document.getElementById(`node-${r}-${c}`);
                if (!node.className.includes('node-start')) {
                    node.className = node.className.replace('', 'animate-node-visited ');
                }
            }, i * 40);
        }
    }

    render() {
        const { grid, mousePressed } = this.state; // mousePressed?
        // why do i need this,
        return (
            <div>
                <h1 className="text-center font-semibold text-3xl">
                    pathfinding algorithm visualizer
                </h1>
                <table className="mx-auto my-5">
                    <tbody>
                        {grid.map((row, rowIdx) => {
                            return (
                                <tr key={rowIdx}>
                                    {row.map((node, nodeIdx) => {
                                        const { row, col, isStart, isEnd, isWall } = node;
                                        return (
                                            <Node
                                                key={nodeIdx} //??
                                                row={row}
                                                col={col}
                                                isStart={isStart}
                                                isEnd={isEnd}
                                                isWall={isWall}
                                                mousePressed={mousePressed} // ??
                                                onMouseDown={(row, col) => // why use these?
                                                    this.handleMouseDown(row, col)
                                                }
                                            // onMouseEnter={(row, col) =>
                                            //     this.handleMouseEnter(row, col)
                                            // }
                                            // onMouseUp={() => this.handleMouseUp(row, col)}
                                            >
                                            </Node>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="space-x-3">
                    <button
                        onClick={() => this.visualize('bfs')}
                        className=" bg-purple-300 px-2 py-1 rounded">
                        Breadth-First Search (BFS)
                    </button>
                    <button
                        onClick={() => { this.visualize('dfs'); }}
                        className=" bg-purple-300 px-2 py-1 rounded">
                        Depth-First Search (DFS)
                    </button>
                    <button
                        onClick={() => { this.visualize('dijkstras'); }}
                        className=" bg-purple-300 px-2 py-1 rounded">
                        Dijkstra's Algorithm
                    </button>
                    <button
                        onClick={() => { this.visualize('a-star'); }}
                        className=" bg-purple-300 px-2 py-1 rounded">
                        A* Algorithm
                    </button>
                    <button
                        onClick={() => this.clearGrid()}
                        className=" bg-purple-300 px-2 py-1 rounded">
                        clear grid
                    </button>
                    <button
                        onClick={() => this.clearWalls()}
                        className=" bg-purple-300 px-2 py-1 rounded">
                        clear walls
                    </button>
                </div>

            </div >
        )
    } //break liens for last angled bracket or no?
}


