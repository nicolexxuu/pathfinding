import React, { Component } from 'react';

import './Node.css';

export default class Node extends Component { // functional class?
    render() {
        const {
            row,
            col,
            isStart,
            isEnd,
            isWall,
            onMouseDown,
            onMouseEnter,
            onMouseUp,
            weight,
        } = this.props;

        return (
            <td
                id={`node-${row}-${col}`}
                className={`${isStart ? 'node-start bg-red-200' : isEnd ? 'node-end bg-green-200' : isWall ? 'node-wall bg-slate-300' : ''} w-5 h-5 border border-black font-xs text-gray-400 p-0`}
                onMouseDown={() => onMouseDown(row, col)}
                onMouseEnter={() => onMouseEnter(row, col)}
                onMouseUp={() => onMouseUp()}
            >
                {this.props.weight}
            </td>
        );
    }
}