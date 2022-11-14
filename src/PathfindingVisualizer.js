import React, { Component, useRef } from 'react'; // why
import Node from './Node';
import { bfs } from './algorithms/bfs'; // why braces
import { dfs } from './algorithms/dfs';
import { dijkstras } from './algorithms/dijkstras';
import { aStar } from './algorithms/aStar';


export default class PathfindingVisualizer extends Component {

    // const [timeoutId, setTimeoueId] = useState(null);
    constructor() {
        super();

        this.timeouts = [];
        this.state = {
            grid: [],
            START_NODE_ROW: 5,
            START_NODE_COL: 5,
            END_NODE_ROW: 10,
            END_NODE_COL: 4,
            ROW_COUNT: 20,
            COL_COUNT: 30,
            mousePressed: false, //??
            startPressed: false,
            endPressed: false,
            wallPressed: false,
            isRunning: false,
        }

        this.handleMouseDown = this.handleMouseDown.bind(this); // https://reactjs.org/docs/handling-events.html
        // this.clearPaths = this.clearPaths.bind(this);
        // this.animatePath = this.animatePath.bind(this);
        // this.animateSearch = this.animateSearch.bind(this);

        // this.handleMouseLeave = this.handleMouseLeave.bind(this);
        // this.toggleIsRunning = this.toggleIsRunning.bind(this); //??????
    }

    componentDidMount() { // what is this for?
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
        } else if (this.state.grid[row][col].isEnd) { // why dont they do this
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
        this.terminate();

        this.clearPath();
        this.clearWalls();
        const newGrid = this.state.grid.slice();
        const numCells = this.state.ROW_COUNT * this.state.COL_COUNT;
        for (let i = 0; i < numCells * 2 / 3; i++) {
            const k = (Math.random() * numCells) | 0;
            const r = k / this.state.COL_COUNT | 0, c = k % this.state.COL_COUNT | 0;
            if (newGrid[r][c].isStart || newGrid[r][c].isEnd) continue;
            newGrid[r][c].isWall = true;
        }
        this.setState({ grid: newGrid });
    }

    /**** reset grid ****/
    clearPath = () => { // update state
        //whys there more walls the first time
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

        this.setState({ grid: newGrid }); ///???
    }

    clearWalls() {
        this.terminate();

        const newGrid = this.state.grid.slice();
        for (const r of newGrid) {
            for (const n of r) {
                const node = document.getElementById(`node-${n.row}-${n.col}`);
                node.classList.remove('node-wall', 'bg-slate-300');
                n.isVisited = false;
                n.isWall = false;
                n.distance = Infinity;
                n.prevNode = null;
            }
        }
        this.setState({ grid: newGrid });
    }

    terminate() {
        if (this.state.isRunning) {
            for (let i = 0; i < this.timeouts.length; i++) clearTimeout(this.timeouts[i]);
            this.timeouts = [];
            this.setState({ isRunning: false });
        }
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
            }, i * 10));
        }

        this.timeouts.push(setTimeout(() => { // this??
            this.animatePath(shortestPath);
        }, orderVisited.length * 10));
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
        // console.log('length of shortest path: ' + shortestPath.length);

        setTimeout(() => {
            this.toggleIsRunning();
        }, shortestPath.length * 50);
    }

    render() {
        const { grid } = this.state;
        // why do i need this,
        return (
            <div className="mt-3">
                <h1 className="text-center font-semibold text-3xl">
                    pathfinding algorithm visualizer
                </h1>
                <table className="mx-auto my-7"
                    onMouseLeave={() => this.setState({ mousePressed: false, startPressed: false, endPressed: false, wallPressed: false })}
                >
                    <tbody>
                        {grid.map((row, rowIdx) => {
                            return (
                                <tr key={rowIdx}>
                                    {row.map((node, nodeIdx) => {
                                        const { row, col, isStart, isEnd, isWall } = node;
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
                                                onMouseUp={() =>
                                                    this.setState({ mousePressed: false, startPressed: false, endPressed: false, wallPressed: false })
                                                }
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
                        onClick={() => this.clearWalls()}
                        className=" bg-violet-300 px-2 py-1 rounded">
                        clear walls
                    </button>
                </div>
                <footer className="text-center mt-2">
                    hosted on <a href="https://github.com/nicolexxuu/pathfinding" target="_blank" className="text-violet-400 font-bold">GitHub</a>
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