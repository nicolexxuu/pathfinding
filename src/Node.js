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
        } = this.props;

        return (
            <td
                id={`node-${row}-${col}`}
                className={`node ${isStart ? 'node-start' : isEnd ? 'node-end' : isWall ? 'node-wall' : ''}`} >
            </td>
        );
    }
}