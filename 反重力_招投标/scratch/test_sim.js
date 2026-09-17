const fs = require('fs');

const html = fs.readFileSync('bidding_knowledge_graph.html', 'utf8');

// Extract RAW_NODES and RAW_LINKS from html
const rawNodesMatch = html.match(/const RAW_NODES = (\[[\s\S]*?\]);/);
const rawLinksMatch = html.match(/const RAW_LINKS = (\[[\s\S]*?\]);/);

if (!rawNodesMatch || !rawLinksMatch) {
  console.error("Could not find RAW_NODES or RAW_LINKS");
  process.exit(1);
}

const RAW_NODES = eval(rawNodesMatch[1]);
const RAW_LINKS = eval(rawLinksMatch[1]);

console.log("Found nodes:", RAW_NODES.length, "links:", RAW_LINKS.length);

let width = 1200, height = 800;
let nodes = RAW_NODES.map((n, i) => {
  const angle = (i / RAW_NODES.length) * Math.PI * 2;
  const radius = 260 + (i % 4) * 60;
  return {
    ...n,
    x: width / 2 + Math.cos(angle) * radius,
    y: height / 2 + Math.sin(angle) * radius,
    vx: 0,
    vy: 0,
    radius: 18 + (n.importance || 1) * 7
  };
});

const nodeMap = new Map(nodes.map(n => [n.id, n]));
let links = RAW_LINKS.map(l => ({
  ...l,
  sourceNode: nodeMap.get(l.source),
  targetNode: nodeMap.get(l.target)
})).filter(l => l.sourceNode && l.targetNode);

console.log("Mapped links:", links.length);

// Check if any links had missing nodes
RAW_LINKS.forEach(l => {
  if (!nodeMap.get(l.source)) console.log("Missing source:", l.source);
  if (!nodeMap.get(l.target)) console.log("Missing target:", l.target);
});

for (let step = 0; step < 300; step++) {
  // Repulsion
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      let distSq = dx * dx + dy * dy;
      if (distSq < 1) distSq = 1;
      const dist = Math.sqrt(distSq);

      const force = (6200 * (a.importance || 1) * (b.importance || 1)) / distSq;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;

      a.vx -= fx;
      a.vy -= fy;
      b.vx += fx;
      b.vy += fy;
    }
  }

  // Attraction
  const defaultLength = 125;
  for (const l of links) {
    const a = l.sourceNode;
    const b = l.targetNode;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const diff = dist - defaultLength;
    const force = diff * 0.038;

    const fx = (dx / dist) * force;
    const fy = (dy / dist) * force;

    a.vx += fx;
    a.vy += fy;
    b.vx -= fx;
    b.vy -= fy;
  }

  // Center gravity
  const cx = width / 2;
  const cy = height / 2;
  for (const n of nodes) {
    n.vx += (cx - n.x) * 0.0075;
    n.vy += (cy - n.y) * 0.0075;

    n.vx *= 0.86;
    n.vy *= 0.86;

    n.x += n.vx;
    n.y += n.vy;
  }
}

const nanCount = nodes.filter(n => isNaN(n.x) || isNaN(n.y)).length;
console.log("NaN count after 300 steps:", nanCount);
console.log("Sample nodes:", nodes.slice(0, 5).map(n => ({ id: n.id, x: n.x, y: n.y })));
