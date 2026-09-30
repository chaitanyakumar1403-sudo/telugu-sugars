import React, { useState } from 'react';
import { Claim, Paper, Relationship } from '../../types/content';
import { useLanguage } from '../../context/LanguageContext';
import { ZoomIn, ZoomOut, RotateCcw, Info } from 'lucide-react';

interface GraphCanvasProps {
  claim: Claim;
  papers: Paper[];
  relationships: Relationship[];
  onSelectPaper: (paper: Paper) => void;
  selectedPaper: Paper | null;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  claim,
  papers,
  relationships,
  onSelectPaper,
  selectedPaper,
}) => {
  const { language } = useLanguage();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showHowToRead, setShowHowToRead] = useState(false);

  const claimText = language === 'te' ? claim.teluguClaimText : claim.claimText;

  // Center node coordinate
  const centerX = 360;
  const centerY = 240;
  const radius = 170;

  // Compute radial positions for satellite paper nodes
  const nodePositions = papers.map((paper, idx) => {
    const angle = (idx / papers.length) * (2 * Math.PI) - Math.PI / 2;
    return {
      paper,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  const getRelationshipColor = (relType?: string) => {
    switch (relType) {
      case 'supports':
        return '#10b981'; // verified teal
      case 'challenges':
        return '#f43f5e'; // red/coral
      case 'context':
        return '#f59e0b'; // amber
      default:
        return '#94a3b8'; // slate
    }
  };

  return (
    <div className="relative w-full h-[520px] rounded-2xl bg-[#090b0e] border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center">
      {/* Controls Bar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md">
        <button
          onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Zoom in"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Zoom out"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel(1)}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Reset zoom"
          title="Reset Zoom"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-white/10 mx-1" />
        <button
          onClick={() => setShowHowToRead((prev) => !prev)}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-amber-300 hover:bg-amber-500/10 transition-colors"
          title="How to read this map"
        >
          <Info className="w-3.5 h-3.5" />
          <span>How to read</span>
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-3 p-2 rounded-xl bg-black/60 border border-white/10 text-[11px] text-slate-300 backdrop-blur-md">
        <span className="flex items-center gap-1.5 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Supports
        </span>
        <span className="flex items-center gap-1.5 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Challenges
        </span>
        <span className="flex items-center gap-1.5 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Context
        </span>
      </div>

      {/* "How to read this map" Explanatory Modal (PDF Section 6 Requirement) */}
      {showHowToRead && (
        <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md p-6 flex flex-col justify-center items-center text-center">
          <div className="max-w-md bg-[#12151b] border border-amber-500/40 rounded-2xl p-6 shadow-2xl">
            <h4 className="text-lg font-bold text-amber-300 mb-2 flex items-center justify-center gap-2">
              <Info className="w-5 h-5" />
              <span>How to Read This Evidence Map</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              <strong>Visual proximity is a navigational metaphor</strong>, not a statistical calculation of clinical proof. The center node represents the public health claim. Outer nodes represent peer-reviewed clinical studies connected by evidence relationships.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed mb-5">
              Click any study node to slide open the complete scientific dossier, including sample demographics, primary findings, and methodological limitations.
            </p>
            <button
              onClick={() => setShowHowToRead(false)}
              className="px-5 py-2 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* SVG Canvas for Network Graph */}
      <svg
        viewBox="0 0 720 480"
        className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-200"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d4a359" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#d4a359" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Glow */}
        <circle cx={centerX} cy={centerY} r={radius + 30} fill="none" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />

        {/* Edge Lines */}
        {nodePositions.map(({ paper, x, y }) => {
          const rel = relationships.find((r) => r.paperId === paper.id);
          const color = getRelationshipColor(rel?.relationshipType);
          const isSelected = selectedPaper?.id === paper.id;

          return (
            <g key={`edge-${paper.id}`}>
              <line
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke={color}
                strokeWidth={isSelected ? 3 : 1.5}
                strokeDasharray={rel?.relationshipType === 'method' ? '4 4' : undefined}
                opacity={isSelected ? 1 : 0.65}
              />
            </g>
          );
        })}

        {/* Center Node: Claim */}
        <g className="cursor-default select-none">
          <circle cx={centerX} cy={centerY} r={64} fill="#14181f" stroke="#d4a359" strokeWidth="2.5" />
          <circle cx={centerX} cy={centerY} r={80} fill="url(#centerGlow)" pointerEvents="none" />
          <text
            x={centerX}
            y={centerY - 12}
            textAnchor="middle"
            fill="#d4a359"
            fontSize="10"
            fontWeight="bold"
            letterSpacing="0.08em"
          >
            CLAIM AT CENTER
          </text>
          <text
            x={centerX}
            y={centerY + 6}
            textAnchor="middle"
            fill="#ffffff"
            fontSize="11"
            fontWeight="600"
            width="100"
          >
            {claimText.length > 36 ? `${claimText.slice(0, 36)}...` : claimText}
          </text>
          <text
            x={centerX}
            y={centerY + 22}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="9"
          >
            Grade: {claim.evidenceGrade}
          </text>
        </g>

        {/* Satellite Paper Nodes */}
        {nodePositions.map(({ paper, x, y }) => {
          const rel = relationships.find((r) => r.paperId === paper.id);
          const color = getRelationshipColor(rel?.relationshipType);
          const isSelected = selectedPaper?.id === paper.id;

          return (
            <g
              key={paper.id}
              data-testid={`node-${paper.id}`}
              onClick={() => onSelectPaper(paper)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectPaper(paper);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Paper: ${paper.title}. Relationship: ${rel?.relationshipType || 'context'}`}
              className="cursor-pointer group focus:outline-none"
            >
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 30 : 25}
                fill="#10141a"
                stroke={color}
                strokeWidth={isSelected ? 3.5 : 2}
                className="transition-all duration-200 group-hover:scale-110"
              />
              <text
                x={x}
                y={y - 2}
                textAnchor="middle"
                fill="#f8fafc"
                fontSize="10"
                fontWeight="bold"
              >
                {paper.year}
              </text>
              <text
                x={x}
                y={y + 11}
                textAnchor="middle"
                fill={color}
                fontSize="8"
                fontWeight="600"
                className="uppercase"
              >
                {rel?.relationshipType || 'Paper'}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default GraphCanvas;
