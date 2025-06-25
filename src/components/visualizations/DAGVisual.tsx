import React from 'react';
import { DAGData } from '../../types';
import { VisualCard } from './VisualCard';
import { GitBranch, ArrowRight } from 'lucide-react';

interface DAGVisualProps {
  dagData?: DAGData;
}

export const DAGVisual: React.FC<DAGVisualProps> = ({ dagData }) => {
  if (!dagData || !dagData.nodes || !dagData.edges) return null;

  const nodePositions = dagData.nodes.reduce((acc, node, i) => ({
    ...acc,
    [node.id]: {
      x: `${(i + 1) * (100 / (dagData.nodes.length + 1))}%`,
      y: '50%'
    }
  }), {} as Record<string, { x: string; y: string }>);

  return (
    <VisualCard>
      <div className="flex items-center mb-6">
        <GitBranch className="w-6 h-6 text-yellow-400 mr-3" />
        <h3 className="text-lg font-semibold text-yellow-300">
          Causal Decision Graph
        </h3>
      </div>
      
      <div className="relative h-64 bg-slate-900/30 rounded-lg p-4 overflow-hidden">
        {/* Nodes */}
        {dagData.nodes.map((node, index) => (
          <div
            key={node.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
            style={{
              left: nodePositions[node.id].x,
              top: nodePositions[node.id].y
            }}
          >
            <div className="bg-slate-700 border-2 border-blue-500/50 px-4 py-3 rounded-lg text-center text-sm font-medium text-white shadow-lg group-hover:border-blue-400 group-hover:shadow-blue-500/25 transition-all duration-300">
              <div className="flex items-center justify-center">
                <GitBranch className="w-4 h-4 mr-2 text-blue-400" />
                {node.label}
              </div>
            </div>
          </div>
        ))}

        {/* Edges */}
        <svg width="100%" height="100%" className="absolute top-0 left-0 pointer-events-none">
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
          
          {dagData.edges
            .filter(edge => nodePositions[edge.from] && nodePositions[edge.to])
            .map((edge, i) => {
              const fromPos = nodePositions[edge.from];
              const toPos = nodePositions[edge.to];
              return (
                <line
                  key={i}
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke="#64748b"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                  className="transition-colors duration-300 hover:stroke-blue-400"
                />
              );
            })}
        </svg>
      </div>
    </VisualCard>
  );
};