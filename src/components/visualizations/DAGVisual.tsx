import React from 'react';
import { DAGData } from '../../types';
import { VisualCard } from './VisualCard';
import { GitBranch } from 'lucide-react';

interface DAGVisualProps {
  dagData?: DAGData;
}

export const DAGVisual: React.FC<DAGVisualProps> = ({ dagData }) => {
  if (!dagData || !dagData.nodes || !dagData.edges) return null;

  // Layout constants
  const nodeWidth = 170; // px (adjust to fit your actual node width)
  const nodeHeight = 60; // px
  const hSpacing = 60;   // horizontal space between nodes
  const vCenter = 130;   // vertical center for graph area
  const vStagger = 30;   // vertical stagger for alternate nodes

  // Calculate node positions with pixel spacing, staggered y for clarity
  const nodePositions: Record<string, { x: number; y: number }> = {};
  dagData.nodes.forEach((node, i) => {
    nodePositions[node.id] = {
      x: 50 + i * (nodeWidth + hSpacing), // start at 50px, then add space per node
      y: vCenter + (i % 2 === 0 ? -vStagger : vStagger) // alternate up and down for overlap avoidance
    };
  });

  // SVG area size
  const totalWidth = 100 + dagData.nodes.length * (nodeWidth + hSpacing);
  const totalHeight = 2 * (vCenter + vStagger);

  return (
    <VisualCard>
      <div className="flex items-center mb-6">
        <GitBranch className="w-6 h-6 text-yellow-400 mr-3" />
        <h3 className="text-lg font-semibold text-yellow-300">
          Causal Decision Graph
        </h3>
      </div>
      <div className="relative" style={{ width: totalWidth, height: totalHeight, minHeight: 260 }}>
        {/* SVG Edges */}
        <svg width={totalWidth} height={totalHeight} className="absolute top-0 left-0 pointer-events-none z-0">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#64748b"
                className="transition-colors duration-300"
              />
            </marker>
          </defs>
          {dagData.edges.map((edge, i) => {
            const from = nodePositions[edge.from];
            const to = nodePositions[edge.to];
            if (!from || !to) return null;
            return (
              <line
                key={i}
                x1={from.x + nodeWidth / 2}
                y1={from.y}
                x2={to.x - nodeWidth / 2}
                y2={to.y}
                stroke="#64748b"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
                className="transition-colors duration-300 hover:stroke-blue-400"
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {dagData.nodes.map((node, i) => {
          const pos = nodePositions[node.id];
          return (
            <div
              key={node.id}
              className="absolute z-10 group"
              style={{
                left: pos.x - nodeWidth / 2,
                top: pos.y - nodeHeight / 2,
                width: nodeWidth,
                height: nodeHeight
              }}
            >
              <div className="bg-slate-700 border-2 border-blue-500/50 px-4 py-3 rounded-lg text-center text-sm font-medium text-white shadow-lg group-hover:border-blue-400 group-hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center h-full">
                <GitBranch className="w-4 h-4 mr-2 text-blue-400" />
                <span className="whitespace-nowrap">{node.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </VisualCard>
  );
};
