import React, { Component, useRef } from 'react'; // why
import Node from './Node'; // change pahs/names
import AlgorithmMenu from './algorithmMenu';
import { bfs } from './algorithms/bfs'; // why braces
import { dfs } from './algorithms/dfs';
import { dijkstras } from './algorithms/dijkstras';
import { aStar } from './algorithms/aStar';

const algorithms = [
    [
        {
            name: 'Breadth-First Search (BFS)',
            id: 'bfs',
        },
        {
            name: 'Depth-First Search (DFS)',
            id: 'dfs',
        },
    ],
    [
        {
            name: 'Dijkstra\'s Algorithm',
            id: 'dijkstras',
        },
        {
            name: 'A* Algorithm',
            id: 'a-star',
        }
    ]
]

export default class PathfindingVisualizer extends Component {
    constructor() {
        super();

        this.timeouts = [];
        this.state = {
            grid: [],
            START_NODE_ROW: 14,
            START_NODE_COL: 18,
            END_NODE_ROW: 14,
            END_NODE_COL: 41,
            ROW_COUNT: 29,
            COL_COUNT: 60,
            mousePressed: false,
            startPressed: false,
            endPressed: false,
            wallPressed: false,
            isRunning: false,
            selected: algorithms[0][0],
            animateDelay: 10,
            displayWeights: false,
            paused: false,
            orderVisited: [],
            shortestPath: []
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
        };
    }

    handleMouseDown(event, row, col) {
        if (this.state.isRunning || event.button === 1) return;
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

    handleAuxClick(event, row, col) {
        if (this.state.displayWeights && event.button === 1) {
            this.state.grid[row][col].weight = this.state.grid[row][col].weight % 9 + 1;
        }

        this.setState({ grid: this.state.grid });
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


    randomizeWeights() { // what happens if you run this during a visualization
        const newGrid = this.state.grid.slice();

        for (let r = 0; r < this.state.ROW_COUNT; r++) {
            for (let c = 0; c < this.state.COL_COUNT; c++) {
                newGrid[r][c].weight = (Math.random() * 10) | 0 + 1;
            }
        }

        this.setState({ grid: newGrid, displayWeights: true }); // why's this faster
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
        this.setState({ grid: newGrid }); // why is this faster???
    }

    clearWeights() {
        this.terminate();

        const newGrid = this.state.grid.slice();
        for (const r of newGrid) {
            for (const n of r) {
                n.weight = 1;
            }
        }
        this.setState({ grid: newGrid, displayWeights: false });
    }

    terminate() {
        if (this.state.isRunning) {
            console.log(this.timeouts);
            for (let i = 0; i < this.timeouts.length; i++) {
                clearTimeout(this.timeouts[i]);
                console.log(this.timeouts[i]);
            }
            this.timeouts = [];
            this.setState({ isRunning: false, paused: false, visitOrder: [], shortestPath: [] });
        }
    }

    pause() { // ifx
        if (this.state.isRunning) {
            for (let i = 0; i < this.timeouts.length; i++) clearTimeout(this.timeouts[i]);
            this.timeouts = [];
            this.setState({ paused: true });
            console.log('hi');
        }
    }

    resume() {
        this.setState({ paused: false });
        this.visualize(this.state.selected.id);
    }

    setSelected = (newSelected) => {// what if var name was selcted
        this.setState({ selected: newSelected });
    }

    /**** animate algorithms ****/
    visualize(algo) {
        this.setState({ isRunning: true });
        console.log('isRunning: ' + this.state.isRunning)

        if (!this.state.paused) {
            this.terminate();
            this.clearPath();
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

            this.setState({ orderVisited: orderVisited, shortestPath: getShortestPath(endNode) });
            this.animateSearch(orderVisited, getShortestPath(endNode));
        } else {
            this.animateSearch(this.state.orderVisited, this.state.shortestPath);
        }
    }

    animateSearch = (orderVisited, shortestPath) => {

        console.log(orderVisited);
        let n = orderVisited.length;
        for (let i = 0; i < n; i++) {
            this.timeouts.push(setTimeout(() => {
                const r = orderVisited[0].row, c = orderVisited[0].col;
                orderVisited.shift();
                const node = document.getElementById(`node-${r}-${c}`);
                if (!this.state.grid[r][c].isStart)
                    node.classList.add('animate-node-visited');
            }, i * this.state.animateDelay));
        }

        this.timeouts.push(setTimeout(() => { // this??
            this.animatePath(shortestPath);
        }, n * this.state.animateDelay));
    }

    animatePath = (shortestPath) => {
        let n = shortestPath.length;
        for (let i = 0; i < n; i++) {
            this.timeouts.push(setTimeout(() => {
                const r = shortestPath[0].row, c = shortestPath[0].col;
                shortestPath.pop();
                const node = document.getElementById(`node-${r}-${c}`);
                if (!node.classList.contains('node-start'))
                    node.classList.add('animate-node-visited', 'animate-node-path');
            }, i * 50));
        }

        setTimeout(() => {
            this.toggleIsRunning();
            this.setState({ paused: false });
        }, n * 50);
    }

    render() {
        const { grid } = this.state;

        return (
            <div className="mt-3"
                onMouseUp={() =>
                    this.setState({ mousePressed: false, startPressed: false, endPressed: false, wallPressed: false })
                }>

                <h1 className="text-center font-semibold text-4xl my-5">
                    pathfinding visualizer
                </h1>

                <div className="space-x-3 mt-6">
                    <AlgorithmMenu algorithms={algorithms} onChange={this.setSelected} value={this.state.selected} />
                    <button
                        onClick={() => this.visualize(this.state.selected.id)}
                        className=" bg-violet-300 px-2 py-1 rounded">
                        visualize!
                    </button>
                    <button
                        onClick={() => this.state.paused ? this.resume() : this.pause()} // change selcted id
                        className=" bg-violet-300 px-2 py-1 rounded">
                        {this.state.paused ? 'resume' : 'pause'}
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
                    <button
                        onClick={() => this.randomizeWeights()}
                        className=" bg-violet-300 px-2 py-1 rounded">
                        random weights
                    </button>
                    <button
                        onClick={() => this.clearWeights()}
                        className=" bg-violet-300 px-2 py-1 rounded">
                        clear weights
                    </button>
                    {/* <button
                        onClick={() => this.setState({ animateDelay: this.state.animateDelay === 10 ? 50 : 10 })}
                        className=" bg-violet-300 px-2 py-1 rounded">
                        toggle speed
                    </button> */}
                </div>

                <table className="mx-auto my-7 select-none text-sm"
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
                                                onMouseDown={event => this.handleMouseDown(event, row, col)}
                                                onAuxClick={event => this.handleAuxClick(event, row, col)}
                                                onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                                weight={weight}
                                                displayWeight={this.state.displayWeights} // does everything have to be in the state
                                            >
                                            </Node>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <footer className="text-center mt-2">
                    hosted on <a href="https://github.com/nicolexxuu/pathfinding" target="_blank" rel="noreferrer" className="text-violet-400 font-bold">GitHub</a>
                </footer>
            </div >
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
