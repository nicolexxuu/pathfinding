import React, { Component } from 'react'; // why
import Node from './Node';
import { bfs } from './algorithms/bfs'; // why braces
import { dfs } from './algorithms/dfs';


export default class PathfindingVisualizer extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            START_NODE_ROW: 5,
            START_NODE_COL: 5,
            END_NODE_ROW: 5,
            END_NODE_COL: 20,
            ROW_COUNT: 20,
            COL_COUNT: 30,
            currRow: 0,
            currCol: 0,
        }

        // this.handleMouseDown = this.handleMouseDown.bind(this);
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
                currRow.push(this.createNode(r, c));
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
            //distanceToFinishNode
            isVisited: false,
            isWall: false,
            prevNode: null,
            //isNode: true
        };
    }

    /**** reset grid ****/
    clearGrid() { // isRunning
        const newGrid = this.state.grid.slice(); // why state?
        for (const r of newGrid) {
            for (const node of r) {
                // const nodeClass = document.getElementById(`node-${node.row}-${node.col}`).className;
                node.isVisited = false;
                node.distance = Infinity;
                //node.distanceToFinishNode
                //node.isWall
                node.prevNode = null;
            }
        }
    }


    /**** animate algorithms ****/
    visualize(algo) {
        // isrunning
        console.log('000');
        this.clearGrid(); // why this
        const grid = this.state.grid;

        const startNode = grid[this.state.START_NODE_ROW][this.state.START_NODE_COL];
        const endNode = grid[this.state.END_NODE_ROW][this.state.END_NODE_COL];

        let orderVisited;
        console.log(algo);
        switch (algo) {
            case 'bfs':
                orderVisited = bfs(grid, startNode, endNode);
                console.log(orderVisited);
                break;
            case 'dfs':
                orderVisited = dfs(grid, startNode, endNode);
                console.log('hii')
                break;
            default:
                break;
        }

        this.animate(orderVisited);
    }

    animate(orderVisited) {
        for (let i = 0; i < orderVisited.length; i++) {
            setTimeout(() => {
                const node = orderVisited[i];
                const nodeClass = document.getElementById(`node-${node.row}-${node.col}`).className;
                if (nodeClass !== 'node node-start' && nodeClass !== 'node node-visited') {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
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
                                            >
                                                {this.state.ROW_COUNT}
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
                        onClick={() => { this.visualize('dfs'); console.log('hi'); }}
                        className=" bg-purple-300 px-2 py-1 rounded">
                        Depth-First Search (DFS)
                    </button>
                    <button
                        onClick={() => this.clearGrid()}
                        className=" bg-purple-300 px-2 py-1 rounded">
                        clear grid
                    </button>
                </div>

            </div>
        )
    } //break liens for last angled bracket or no?
}


