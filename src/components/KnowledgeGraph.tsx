'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useRouter } from 'next/navigation';

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  title: string;
  type: 'paper' | 'concept';
  val: number;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}

interface KnowledgeGraphProps {
  data: {
    nodes: GraphNode[];
    links: GraphLink[];
  };
  lang: string;
}

export function KnowledgeGraph({ data, lang }: KnowledgeGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const router = useRouter();
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    if (!containerRef.current || !svgRef.current || !data.nodes.length) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 600;

    // Clear previous
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create container group for zoom
    const g = svg.append('g');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Simulation
    const simulation = d3.forceSimulation<GraphNode>(data.nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(data.links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(d => (d as GraphNode).val * 5 + 10));

    // Links
    const link = g.append('g')
      .attr('stroke', '#6B7280') // frc-steel
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke-width', 1);

    // Nodes
    const node = g.append('g')
      .attr('stroke', '#0B1020') // frc-void
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(data.nodes)
      .join('circle')
      .attr('r', d => d.val * 3 + 2) // Base size + centrality
      .attr('fill', d => d.type === 'paper' ? '#C9A227' : '#1F3A5F') // Gold vs Blue
      .attr('cursor', 'pointer')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      );

    // Labels (only for larger nodes or on hover? Let's do simple labels for now)
    const label = g.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(data.nodes)
      .join('text')
      .attr('dx', 12)
      .attr('dy', 4)
      .text(d => d.id)
      .attr('font-size', '10px')
      .attr('fill', '#9CA3AF') // frc-text-dim
      .attr('pointer-events', 'none')
      .style('opacity', d => d.val > 2 ? 1 : 0); // Hide labels for small nodes initially

    // Interactions
    node
      .on('mouseover', (event, d) => {
        setHoveredNode(d);
        d3.select(event.currentTarget).attr('stroke', '#E6E8EC').attr('stroke-width', 2);
        // Highlight connections could go here
      })
      .on('mouseout', (event) => {
        setHoveredNode(null);
        d3.select(event.currentTarget).attr('stroke', '#0B1020').attr('stroke-width', 1.5);
      })
      .on('click', (event, d) => {
        const path = d.type === 'paper' ? 'papers' : 'concepts';
        router.push(`/${lang}/${path}/${d.id}`);
      });

    // Tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as GraphNode).x!)
        .attr('y1', d => (d.source as GraphNode).y!)
        .attr('x2', d => (d.target as GraphNode).x!)
        .attr('y2', d => (d.target as GraphNode).y!);

      node
        .attr('cx', d => d.x!)
        .attr('cy', d => d.y!);
      
      label
        .attr('x', d => d.x!)
        .attr('y', d => d.y!);
    });

    // Drag functions
    function dragstarted(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: GraphNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [data, lang, router]);

  return (
    <div ref={containerRef} className="w-full h-[600px] relative bg-frc-void border border-frc-blue/30 rounded-lg overflow-hidden">
      <svg ref={svgRef} className="w-full h-full block" />
      
      {/* HUD / Legend */}
      <div className="absolute bottom-4 left-4 bg-frc-void/80 backdrop-blur border border-frc-blue p-3 rounded text-xs space-y-2 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-frc-gold"></span>
          <span className="text-frc-text-dim">Papers</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-frc-blue"></span>
          <span className="text-frc-text-dim">Concepts</span>
        </div>
        <div className="text-[10px] text-frc-steel mt-1">
          Scroll to zoom • Drag to move
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredNode && (
        <div className="absolute top-4 left-4 max-w-xs pointer-events-none animate-in fade-in slide-in-from-top-2">
          <div className="bg-frc-void border border-frc-gold p-3 rounded shadow-xl">
             <div className="text-[10px] uppercase tracking-widest text-frc-gold mb-1">
               {hoveredNode.type}
             </div>
             <div className="text-sm font-medium text-frc-text">
               {hoveredNode.title}
             </div>
             <div className="text-[10px] text-frc-steel font-mono mt-1">
               {hoveredNode.id}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
