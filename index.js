const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

// Union-Find: helps detect cycles in the graph.
class DisjointSet {
  constructor(vertices) {
    this.parent = new Map();
    this.rank = new Map();

    for (const vertex of vertices) {
      this.parent.set(vertex, vertex);
      this.rank.set(vertex, 0);
    }
  }

  find(vertex) {
    if (this.parent.get(vertex) !== vertex) {
      this.parent.set(vertex, this.find(this.parent.get(vertex)));
    }

    return this.parent.get(vertex);
  }

  union(vertex1, vertex2) {
    const root1 = this.find(vertex1);
    const root2 = this.find(vertex2);

    if (root1 === root2) {
      return false;
    }

    if (this.rank.get(root1) < this.rank.get(root2)) {
      this.parent.set(root1, root2);
    } else if (this.rank.get(root1) > this.rank.get(root2)) {
      this.parent.set(root2, root1);
    } else {
      this.parent.set(root2, root1);
      this.rank.set(root1, this.rank.get(root1) + 1);
    }

    return true;
  }
}

// Kruskal's algorithm: finds the minimum spanning tree.
function kruskalMST(vertices, edges) {
  edges.sort((a, b) => a.weight - b.weight);

  const disjointSet = new DisjointSet(vertices);
  const mst = [];
  let totalCost = 0;

  for (const edge of edges) {
    if (disjointSet.union(edge.from, edge.to)) {
      mst.push(edge);
      totalCost += edge.weight;
    }

    if (mst.length === vertices.length - 1) {
      break;
    }
  }

  return {
    mst,
    totalCost,
    connected: vertices.length > 0 && mst.length === vertices.length - 1,
  };
}

// Displays the selected connections and their total cost.
function displayMST(result) {
  console.log("\nMinimum Spanning Tree:");

  for (const edge of result.mst) {
    console.log(`${edge.from} -- ${edge.to} (cost: ${edge.weight})`);
  }

  if (result.mst.length === 0) {
    console.log("No connections selected.");
  }

  console.log(`\nTotal network cost: ${result.totalCost}`);

  if (result.connected) {
    console.log("All computers connected: Yes");
  } else {
    console.log("All computers connected: No");
  }
}

// BONUS: Let the user enter computers and connections through the terminal.
async function main() {
  const computerInput = await askQuestion(
    "Enter computer names separated by commas: ",
  );

  const computers = computerInput
    .split(",")
    .map((computer) => computer.trim())
    .filter((computer) => computer !== "");

  const numberOfConnections = Number(
    await askQuestion("Enter the number of possible connections: "),
  );

  const connections = [];

  for (let i = 0; i < numberOfConnections; i++) {
    const input = await askQuestion(
      `Enter connection ${i + 1} (computer1,computer2,cost): `,
    );

    const [from, to, weight] = input.split(",").map((value) => value.trim());

    connections.push({
      from,
      to,
      weight: Number(weight),
    });
  }

  const result = kruskalMST(computers, connections);

  displayMST(result);

  rl.close();
}

main();
