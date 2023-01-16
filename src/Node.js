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
            onAuxClick,
            onMouseEnter,
            displayWeight,
        } = this.props;

        return (
            <td
                id={`node-${row}-${col}`}
                className={`${isStart ? 'node-start bg-green-400' : isEnd ? 'node-end bg-red-400' : isWall ? 'node-wall bg-violet-400' : ''} w-6 h-6 border border-gray-300 font-xs text-violet-400 p-0`}
                onMouseDown={event => onMouseDown(event, row, col)}
                onAuxClick={event => onAuxClick(event, row, col)}
                onMouseEnter={() => onMouseEnter(row, col)}
            >
                {displayWeight && !isStart && !isEnd && !isWall ? this.props.weight : ''}
            </td>
        );
    }

    // how does weight work?
}