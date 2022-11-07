// file naming conventions

const dr = [-1, 0, 1, 0];
const dc = [0, 1, 0, -1];

export function aStar(grid, startNode, endNode) {
    const visitOrder = [];
    startNode.distance = 0;

    for (let i = 0; i < grid.length * grid[0].length; i++) {
        const curr = findMinNode(grid);

        if (!curr || curr === endNode) return visitOrder;
        curr.isVisited = true;
        visitOrder.push(curr);
        const { row, col } = curr;

        for (let k = 0; k < 4; k++) {
            const nr = row + dr[k], nc = col + dc[k];
            if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[nr].length) continue;
            const newNode = grid[nr][nc];
            const newDist = curr.distance + 1 + Math.abs(row - endNode.row) + Math.abs(col - endNode.col);
            if (!newNode.isVisited && newDist < newNode.distance) {
                newNode.distance = newDist;
                newNode.prevNode = curr;
            }

        }
    }
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