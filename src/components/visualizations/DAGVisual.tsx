import React, { useRef, useEffect, useState } from 'react';
import { DAGData } from '../../types';
import { VisualCard } from './VisualCard';
import { GitBranch } from 'lucide-react';

interface DAGVisualProps {
  dagData?: DAGData;
}

export const DAGVisual: React.FC<DAGVisualProps> = ({ dagData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(700); // default fallback width

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!dagData || !dagData.nodes || !dagData.edges) return null;

  // Dynamically calculate node positions based on container width
  const nodeCount = dagData.nodes.length;
  const nodeWidth = 170;
  const nodeHeight = 60;
  const vCenter = 130;
  const vStagger = 30;

  // Compute horizontal gap so nodes fit in the container, minimum gap enforced
  const minGap = 32;
  const availableWidth = Math.max(containerWidth - nodeWidth, nodeWidth + minGap * (nodeCount - 1));
  const gap = nodeCount > 1 ? Math.max(minGap, (availableWidth - nodeWidth) / (nodeCount - 1)) : 0;

  const nodePositions: Record<string, { x: number; y: number }> = {};
  dagData.nodes.forEach((node, i) => {
    nodePositions[node.id] = {
      x: nodeWidth / 2 + i * gap,
      y: vCenter + (i % 2 === 0 ? -vStagger : vStagger)
    };
  });

  // Only allow scrolling if nodes overflow container
  const totalWidth = nodeCount > 1 ? nodeWidth + (nodeCount - 1) * gap : nodeWidth;
  const needsScroll = totalWidth > containerWidth;
  const scrollStyle = needsScroll
    ? { overflowX: 'auto', overflowY: 'hidden' as const }
    : {};

  return (
    <VisualCard>
      <div className="flex items-center mb-6">
        <GitBranch className="w-6 h-6 text-yellow-400 mr-3" />
        <h3 className="text-lg font-semibold text-yellow-300">
          Causal Decision Graph
        </h3>
      </div>
      <div
        ref={containerRef}
        className="relative rounded-lg bg-slate-900/30 p-4"
        style={{ minHeight: 260, ...scrollStyle }}
      >
        <div
          style={{
            position: 'relative',
            width: needsScroll ? totalWidth : '100%',
            height: 2 * (vCenter + vStagger),
            minHeight: 240
          }}
        >
          {/* SVG Edges */}
          <svg
            width={totalWidth}
            height={2 * (vCenter + vStagger)}
            className="absolute top-0 left-0 pointer-events-none z-0"
          >
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
      </div>
    </VisualCard>
  );
};
