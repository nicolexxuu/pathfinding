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
        } = this.props;

        return (
            <td
                id={`node-${row}-${col}`}
                className={`${isStart ? 'node-start bg-yellow-200' : isEnd ? 'node-end bg-green-200' : isWall ? 'node-wall bg-slate-300' : ''} w-5 h-5 border border-black`}
                onMouseDown={() => onMouseDown(row, col)}
            >

            </td>
        );
    }
}