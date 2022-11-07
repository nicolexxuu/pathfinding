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
            startPressed: false,
            endPressed: false,
            wallPressed: false,
            isRunning: false,
        }

        this.handleMouseDown = this.handleMouseDown.bind(this); // https://reactjs.org/docs/handling-events.html
        // this.handleMouseLeave = this.handleMouseLeave.bind(this);
        // this.toggleIsRunning = this.toggleIsRunning.bind(this); //??????
    }

    componentDidMount() { // what is this for?
        const grid = this.getInitialGrid();
        this.setState({ grid });
    }

    toggleIsRunning() {
        this.setState({ isRunning: !this.state.isRunning });
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
        if (this.state.isRunning) return;
        // if grid is clear
        //https://stackoverflow.com/questions/37755997/why-cant-i-directly-modify-a-components-state-really
        // why external method in github version?

        this.setState({
            mousePressed: true,
            currRow: row,
            currCol: col,
        });

        if (this.state.grid[row][col].isStart) { // why dont they do this
            this.setState({
                startPressed: true,
            })
        } else if (this.state.grid[row][col].isEnd) { // why dont they do this
            this.setState({
                endPressed: true,
            })
        } else {
            const newGrid = this.state.grid.slice();
            newGrid[row][col] = {
                ...newGrid[row][col],
                isWall: true,
            }

            this.setState({
                grid: newGrid,
                wallPressed: true, // dont i have to change this classname?
            })
        }
    }

    handleMouseEnter(row, col) {
        if (this.state.isRunning || !this.state.mousePressed) return;

        const newNode = this.state.grid[row][col]; // rename this, fix bug
        if (this.state.startPressed) {
            if (this.state.grid[row][col].isWall) return;
            console.log("r: " + row + " c: " + col + " from prev r: " + this.state.START_NODE_ROW + " c: " + this.state.START_NODE_ROW);
            const prevStart = this.state.grid[this.state.START_NODE_ROW][this.state.START_NODE_COL];// should this still be capitalized?

            this.setState({
                START_NODE_ROW: row,
                START_NODE_COL: col,
            });
            prevStart.isStart = false;
            const prevStartNode = document.getElementById(`node-${prevStart.row}-${prevStart.col}`);
            prevStartNode.className = prevStartNode.className.replace('node-start ', '');

            newNode.isStart = true;
            const node = document.getElementById(`node-${row}-${col}`);
            node.className = node.className.replace('', 'node-start ');


        } else if (this.state.endPressed) {
            const prevEnd = this.state.grid[this.state.END_NODE_ROW][this.state.END_NODE_COL];// should this still be capitalized?

            this.setState({
                END_NODE_ROW: row,
                END_NODE_COL: col,
            });
            prevEnd.isEnd = false;
            const prevEndNode = document.getElementById(`node-${prevEnd.row}-${prevEnd.col}`);
            prevEndNode.className = prevEndNode.className.replace('node-end ', '');

            newNode.isEnd = true;
            const node = document.getElementById(`node-${row}-${col}`);
            node.className = node.className.replace('', 'node-end ');
        } else {
            const newGrid = this.state.grid.slice();
            newGrid[row][col] = {
                ...newGrid[row][col],
                isWall: true,
            } // why dont i do this while moving start and end?

            this.setState({
                grid: newGrid,
                wallPressed: true, // dont i have to change this classname?
            })
        }
    }

    handleMouseUp(row, col) {
        this.setState({ mousePressed: false, startPressed: false, endPressed: false, wallPressed: false });


    }


    /**** reset grid ****/
    clearGrid() { // update state
        if (this.state.isRunning) return;
        const newGrid = this.state.grid.slice();
        for (const r of newGrid) {
            for (const n of r) {
                const node = document.getElementById(`node-${n.row}-${n.col}`);
                node.className = node.className.replace('animate-node-visited ', '');
                node.className = node.className.replace('animate-node-path ', '');

                n.isVisited = false;
                n.distance = Infinity;
                n.prevNode = null;
            }
        }
    }

    clearWalls() {
        if (this.state.isRunning) return;
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
        if (this.state.isRunning) return;
        this.clearGrid();
        const grid = this.state.grid;

        const startNode = grid[this.state.START_NODE_ROW][this.state.START_NODE_COL];
        const endNode = grid[this.state.END_NODE_ROW][this.state.END_NODE_COL];

        this.toggleIsRunning();

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
        console.log('finished search');
        const path = getShortestPath(endNode);
        console.log(path.length);
        this.animateSearch(orderVisited, path);
    }

    animateSearch(orderVisited, shortestPath) {
        for (let i = 0; i < orderVisited.length; i++) {
            setTimeout(() => {
                const r = orderVisited[i].row, c = orderVisited[i].col;
                const node = document.getElementById(`node-${r}-${c}`);
                if (!node.className.includes('node-start')) {
                    node.className = node.className.replace('', 'animate-node-visited ');
                }
            }, i * 10);
        }
        console.log('hi');
        setTimeout(() => { // this??
            this.animatePath(shortestPath);
        }, orderVisited.length * 10);
    }

    animatePath(shortestPath) {
        for (let i = 0; i < shortestPath.length; i++) {
            setTimeout(() => {
                const r = shortestPath[i].row, c = shortestPath[i].col;
                const node = document.getElementById(`node-${r}-${c}`);
                if (!node.className.includes('node-start')) {
                    node.className = node.className.replace('animate-node-visited', 'animate-node-path');
                }
            }, i * 50);
        }
        console.log('length of shortest path: ' + shortestPath.length);
        setTimeout(() => { // this??
            this.toggleIsRunning();
        }, shortestPath.length * 50);
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
                                                onMouseEnter={(row, col) =>
                                                    this.handleMouseEnter(row, col)
                                                }
                                                onMouseUp={() => this.handleMouseUp(row, col)}
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
                <footer className="text-center">
                    Built by Nicole Xu.
                </footer>
            </div >
        )
    } //break liens for last angled bracket or no?
}

function getShortestPath(endNode) {
    const shortestPath = [];
    console.log('in the method!' + endNode);
    let curr = endNode.prevNode;

    while (curr !== null) {
        console.log(curr);
        shortestPath.unshift(curr);
        curr = curr.prevNode;
    }

    return shortestPath;
}