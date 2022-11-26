import React, { Component, useRef } from 'react'; // why
import Node from './Node'; // change pahs/names
import AlgorithmMenu from './algorithmMenu';
import { bfs } from './algorithms/bfs'; // why braces
import { dfs } from './algorithms/dfs';
import { dijkstras } from './algorithms/dijkstras';
import { aStar } from './algorithms/aStar';

const people = [
    {
        name: 'Breadth-First Search (BFS)',
        id: 'bfs',
    },
    {
        name: 'Depth-First Search (DFS)',
        id: 'dfs',
    },
    {
        name: 'Dijkstra\'s Algorithm',
        id: 'dijkstras',
    },
    {
        name: 'A* Algorithm',
        id: 'a-star',
    }
]

{/* <button
                        onClick={() => this.visualize('bfs')}
                        className=" bg-violet-300 px-2 py-1 rounded">
                        Breadth-First Search (BFS)
                    </button>
                    <button
                        onClick={() => this.visualize('dfs')}
                        className=" bg-violet-300 px-2 py-1 rounded">
                        Depth-First Search (DFS)
                    </button>
                    <button
                        onClick={() => this.visualize('dijkstras')}
                        className=" bg-violet-300 px-2 py-1 rounded">
                        Dijkstra's Algorithm
                    </button>
                    <button
                        onClick={() => this.visualize('a-star')}
                        className=" bg-violet-300 px-2 py-1 rounded">
                        A* Algorithm
                    </button> */}

export default class PathfindingVisualizer extends Component {
    constructor() {
        super();

        this.timeouts = [];
        this.state = {
            grid: [],
            START_NODE_ROW: 12,
            START_NODE_COL: 18,
            END_NODE_ROW: 12,
            END_NODE_COL: 41,
            ROW_COUNT: 25,
            COL_COUNT: 60,
            mousePressed: false,
            startPressed: false,
            endPressed: false,
            wallPressed: false,
            isRunning: false,
            selected: people[0],
            animateDelay: 10,
        }

        this.handleMouseDown = this.handleMouseDown.bind(this); // https://reactjs.org/docs/handling-events.html
        // is this necessary?

        // this.handleMouseLeave = this.handleMouseLeave.bind(this);
        // this.toggleIsRunning = this.toggleIsRunning.bind(this); //??????
    }

    componentDidMount() {
        this.setState({ grid: this.getInitialGrid() });
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
            weight: 1,

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
        });

        if (this.state.grid[row][col].isStart) { // why dont they do this
            this.setState({
                startPressed: true,
            })
        } else if (this.state.grid[row][col].isEnd) {
            this.setState({
                endPressed: true,
            })
        } else {
            this.setState({
                wallPressed: true,
            })
            const newNode = this.state.grid[row][col];
            newNode.isWall = !newNode.isWall;
        }
    }

    handleMouseEnter(row, col) {
        if (this.state.isRunning || !this.state.mousePressed) return;

        const newNode = this.state.grid[row][col]; // rename this, fix bug
        if (this.state.startPressed) {
            if (this.state.grid[row][col].isWall || this.state.grid[row][col].isEnd) return;
            const prevStart = this.state.grid[this.state.START_NODE_ROW][this.state.START_NODE_COL];// should this still be capitalized?

            this.setState({
                START_NODE_ROW: row,
                START_NODE_COL: col,
            });
            prevStart.isStart = false;
            newNode.isStart = true;
        } else if (this.state.endPressed) {
            if (this.state.grid[row][col].isWall || this.state.grid[row][col].isStart) return;

            const prevEnd = this.state.grid[this.state.END_NODE_ROW][this.state.END_NODE_COL];// should this still be capitalized?

            this.setState({
                END_NODE_ROW: row,
                END_NODE_COL: col,
            });
            prevEnd.isEnd = false;
            newNode.isEnd = true;
        } else if (this.state.wallPressed) {
            this.setState({}) //?????
            newNode.isWall = !newNode.isWall;
        }
    }

    randomizeWalls() {
        this.clearPath();
        this.clearWalls();
        const newGrid = this.state.grid.slice();

        const emptyCells = [];
        for (let r = 0; r < this.state.ROW_COUNT; r++) {
            for (let c = 0; c < this.state.COL_COUNT; c++) {
                if (!newGrid[r][c].isStart && !newGrid[r][c].isEnd) emptyCells.push(r * this.state.COL_COUNT + c);
            }
        }
        for (let i = 0; i < this.state.ROW_COUNT * this.state.COL_COUNT / 4; i++) {
            const k = emptyCells.splice((Math.random() * emptyCells.length) | 0, 1);
            const r = k / this.state.COL_COUNT | 0, c = k % this.state.COL_COUNT | 0;
            newGrid[r][c].isWall = true;
        }
        this.setState({ grid: newGrid }); // why's this faster
    }

    randomizeWeights() {
        const newGrid = this.state.grid.slice();

        for (let r = 0; r < this.state.ROW_COUNT; r++) {
            for (let c = 0; c < this.state.COL_COUNT; c++) {
                newGrid[r][c].weight = (Math.random() * 10) | 0 + 1;
            }
        }

        this.setState({ grid: newGrid }); // why's this faster
    }

    /**** reset grid ****/
    clearPath = () => { // update state
        this.terminate();
        const newGrid = this.state.grid.slice();
        for (const r of newGrid) {
            for (const n of r) {
                const node = document.getElementById(`node-${n.row}-${n.col}`);
                node.classList.remove('animate-node-visited');
                node.classList.remove('animate-node-path');

                n.isVisited = false;
                n.distance = Infinity;
                n.prevNode = null;
            }
        }

        // this.setState({ grid: newGrid }); ///???
    }

    clearWalls() {
        this.terminate();

        const newGrid = this.state.grid.slice();
        for (const r of newGrid) {
            for (const n of r) {
                n.isVisited = false;
                n.isWall = false;
                n.distance = Infinity;
                n.prevNode = null;
            }
        }
        this.setState({ grid: newGrid }); // why is this fa ster???
    }

    terminate() {
        if (this.state.isRunning) {
            for (let i = 0; i < this.timeouts.length; i++) clearTimeout(this.timeouts[i]);
            this.timeouts = [];
            this.setState({ isRunning: false });
        }
    }

    setSelected = (newSelected) => {// what if var name was selcted
        this.setState({ selected: newSelected });
    }

    /**** animate algorithms ****/
    visualize(algo) {
        this.terminate();
        this.clearPath();
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

        const path = getShortestPath(endNode);
        this.animateSearch(orderVisited, path);
    }

    animateSearch = (orderVisited, shortestPath) => {
        for (let i = 0; i < orderVisited.length; i++) {
            this.timeouts.push(setTimeout(() => {
                const r = orderVisited[i].row, c = orderVisited[i].col;
                const node = document.getElementById(`node-${r}-${c}`);
                if (!this.state.grid[r][c].isStart)
                    node.classList.add('animate-node-visited');
            }, i * this.state.animateDelay));
        }

        this.timeouts.push(setTimeout(() => { // this??
            this.animatePath(shortestPath);
        }, orderVisited.length * this.state.animateDelay));
    }

    animatePath = (shortestPath) => {
        for (let i = 0; i < shortestPath.length; i++) {
            this.timeouts.push(setTimeout(() => {
                const r = shortestPath[i].row, c = shortestPath[i].col;
                const node = document.getElementById(`node-${r}-${c}`);
                if (!node.classList.contains('node-start'))
                    node.classList.add('animate-node-visited', 'animate-node-path');
            }, i * 50));
        }

        setTimeout(() => {
            this.toggleIsRunning();
        }, shortestPath.length * 50);
    }

    render() {
        const { grid } = this.state;

        return (
            <div className="mt-3"
                onMouseUp={() =>
                    this.setState({ mousePressed: false, startPressed: false, endPressed: false, wallPressed: false })
                }>

                <h1 className="text-center font-semibold text-3xl">
                    pathfinding algorithm visualizer
                </h1>
                <table className="mx-auto my-7 select-none"
                // onMouseLeave={() => this.setState({ mousePressed: false, startPressed: false, endPressed: false, wallPressed: false })}
                >
                    <tbody>
                        {grid.map((row, rowIdx) => {
                            return (
                                <tr key={rowIdx}>
                                    {row.map((node, nodeIdx) => {
                                        const { row, col, isStart, isEnd, isWall, weight } = node;
                                        return (
                                            <Node
                                                key={nodeIdx}
                                                row={row}
                                                col={col}
                                                isStart={isStart}
                                                isEnd={isEnd}
                                                isWall={isWall}
                                                onMouseDown={(row, col) => // why use these?
                                                    this.handleMouseDown(row, col)
                                                }
                                                onMouseEnter={(row, col) =>
                                                    this.handleMouseEnter(row, col)
                                                }
                                                weight={weight}
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
                    <AlgorithmMenu people={people} onChange={this.setSelected} value={this.state.selected} />
                    <button
                        onClick={() => this.visualize(this.state.selected.id)}
                        className=" bg-violet-300 px-2 py-1 rounded">
                        visualize!
                    </button>

                    <button
                        onClick={() => this.clearPath()}
                        className=" bg-violet-300 px-2 py-1 rounded">
                        clear path
                    </button>
                    <button
                        onClick={() => this.randomizeWalls()}
                        className=" bg-violet-300 px-2 py-1 rounded">
                        random walls
                    </button>
                    <button
                        onClick={() => this.randomizeWeights()}
                        className=" bg-violet-300 px-2 py-1 rounded">
                        random weights
                    </button>
                    <button
                        onClick={() => this.clearWalls()}
                        className=" bg-violet-300 px-2 py-1 rounded">
                        clear walls
                    </button>
                    <button
                        onClick={() => this.setState({ animateDelay: this.state.animateDelay === 10 ? 50 : 10 })}
                        className=" bg-violet-300 px-2 py-1 rounded">
                        toggle speed
                    </button>
                </div>
                <footer className="text-center mt-2">
                    hosted on <a href="https://github.com/nicolexxuu/pathfinding" target="_blank" rel="noreferrer" className="text-violet-400 font-bold">GitHub</a>
                </footer>
            </div>
        )
    } //break liens for last angled bracket or no?
}

function getShortestPath(endNode) {
    const shortestPath = [];
    let curr = endNode.prevNode;

    while (curr !== null) {
        shortestPath.unshift(curr);
        curr = curr.prevNode;
    }

    return shortestPath;
}

// make responsive
// pause
// change speeds

// num run deploy
