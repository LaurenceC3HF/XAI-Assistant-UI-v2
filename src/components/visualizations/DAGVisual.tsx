import React, { useRef, useEffect, useState } from 'react';
import { DAGData } from '../../types';
import { VisualCard } from './VisualCard';
import { GitBranch } from 'lucide-react';

interface DAGVisualProps {
  dagData?: DAGData;
}

const FONT = "500 14px Inter, sans-serif"; // match your node text styling

function measureTextWidth(text: string, font = FONT) {
  // Use a single canvas for better performance
  const canvas = measureTextWidth.canvas || (measureTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  if (!context) return 100;
  context.font = font;
  return context.measureText(text).width;
}
measureTextWidth.canvas = undefined as undefined | HTMLCanvasElement;

export const DAGVisual: React.FC<DAGVisualProps> = ({ dagData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(700); // fallback width

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

  // Calculate dynamic node widths
  const horizontalPadding = 32; // px left+right
  const minNodeWidth = 100;
  const maxNodeWidth = 220;
  const nodeHeight = 60;
  const vCenter = 130;
  const vStagger = 24;

  // For each node, measure label width and add padding
  const nodeDims = dagData.nodes.map(node => {
    const labelWidth = measureTextWidth(node.label);
    const width = Math.min(maxNodeWidth, Math.max(minNodeWidth, labelWidth + horizontalPadding));
    return { id: node.id, width, label: node.label };
  });

  // Positions: lay out horizontally, spacing by sum of previous widths plus gap
  const minGap = 36;
  let positions: Record<string, { x: number; y: number; width: number }> = {};
  let x = 36; // start with a left margin
  nodeDims.forEach((node, i) => {
    positions[node.id] = {
      x: x + node.width / 2,
      y: vCenter + (i % 2 === 0 ? -vStagger : vStagger),
      width: node.width
    };
    x += node.width + minGap;
  });

  const totalWidth = x; // last x includes the right margin
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
              const from = positions[edge.from];
              const to = positions[edge.to];
              if (!from || !to) return null;
              return (
                <line
                  key={i}
                  x1={from.x + from.width / 2}
                  y1={from.y}
                  x2={to.x - to.width / 2}
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
            const pos = positions[node.id];
            return (
              <div
                key={node.id}
                className="absolute z-10 group"
                style={{
                  left: pos.x - pos.width / 2,
                  top: pos.y - nodeHeight / 2,
                  width: pos.width,
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
