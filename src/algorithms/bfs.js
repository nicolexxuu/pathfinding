const dr = [-1, 0, 1, 0];
const dc = [0, 1, 0, -1];

export function bfs(grid, startNode, endNode) { // why no imports? why export?
    const visitOrder = [];
    const toVisit = [];
    toVisit.push(startNode);

    while (toVisit.length) {
        const curr = toVisit.shift();
        if (curr.isWall || curr.isVisited) continue;

        if (curr === endNode) {
            console.log(visitOrder);
            return visitOrder;
        }
        curr.isVisited = true;
        visitOrder.push(curr);

        const { row, col } = curr;
        for (let k = 0; k < 4; k++) {
            const nr = row + dr[k], nc = col + dc[k];
            if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[nr].length) continue;
            const newNode = grid[nr][nc];
            if (newNode.isVisited) continue;
            newNode.prevNode = curr;
            toVisit.push(newNode);
        }
    }
}

