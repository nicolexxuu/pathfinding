const dr = [-1, 0, 1, 0];
const dc = [0, 1, 0, -1];

export function dijkstras(grid, startNode, endNode) {
    const visitOrder = [];
    startNode.distance = 0;

    for (let i = 0; i < grid.length * grid[0].length; i++) {
        const curr = findMinNode(grid);
        if (!curr || curr === endNode) break;
        curr.isVisited = true;
        visitOrder.push(curr);
        const { row, col } = curr;

        for (let k = 0; k < 4; k++) {
            const nr = row + dr[k], nc = col + dc[k];
            if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[nr].length) continue;
            const newNode = grid[nr][nc];
            if (curr.distance + newNode.weight < newNode.distance && !newNode.isVisited) {
                newNode.distance = curr.distance + newNode.weight;
                newNode.prevNode = curr;
            }

        }
    }

    return visitOrder;
}

function findMinNode(grid) {
    let min = Infinity, minNode;
    for (const r of grid) {
        for (const node of r) {
            if (!node.isVisited && !node.isWall && node.distance < min) {
                min = node.distance;
                minNode = node;
            }
        }
    }

    return minNode;
}