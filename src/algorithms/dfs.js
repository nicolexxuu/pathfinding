const dr = [-1, 0, 1, 0];
const dc = [0, 1, 0, -1];

export function dfs(grid, startNode, endNode) { // why no imports? why export?
    const visitOrder = [];
    const toVisit = [];
    toVisit.push(startNode);

    while (toVisit.length) {
        const curr = toVisit.pop();
        if (curr.isWall || curr.isVisited) continue;

        if (curr === endNode) return visitOrder;
        curr.isVisited = true;
        visitOrder.push(curr);

        const { row, col } = curr;
        for (let k = 0; k < 4; k++) {
            const nr = row + dr[k], nc = col + dc[k];
            if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[nr].length) continue;
            const newNode = grid[nr][nc];
            if (newNode.isVisited) continue; // naming boolean attributes
            newNode.prevNode = curr;
            toVisit.push(newNode);
        }
    }
}