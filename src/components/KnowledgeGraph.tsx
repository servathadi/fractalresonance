'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { getBasePath, getPerspectiveFromPathname } from '@/lib/site';

// Theme-aware colors
const COLORS = {
  dark: {
    void: '#0B1020',
    text: '#E6E8EC',
    blue: '#1F3A5F',
    gold: '#C9A227',
    goldLight: '#D4A84B',
    teal: '#1AAE9F',
    steel: '#6B7280',
    textDim: '#9CA3AF',
  },
  light: {
    void: '#FAFBFC',
    text: '#1A1D23',
    blue: '#CBD5E1',
    gold: '#96780A',
    goldLight: '#B0871B',
    teal: '#0F766E',
    steel: '#9CA3AF',
    textDim: '#6B7280',
  },
};

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  title: string;
  type: 'paper' | 'concept' | 'article' | 'blog' | 'book' | 'topic' | 'person';
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
  const pathname = usePathname();
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [enabledTypes, setEnabledTypes] = useState<Record<GraphNode['type'], boolean>>({
    paper: true,
    concept: true,
    topic: true,
    article: false,
    blog: false,
    book: false,
    person: false,
  });
  const [query, setQuery] = useState('');
  const [focusId, setFocusId] = useState<string>('');
  const focusIdRef = useRef<string>('');
  const selectionsRef = useRef<{
    node?: d3.Selection<SVGCircleElement, GraphNode, SVGGElement, unknown>;
    link?: d3.Selection<SVGLineElement, GraphLink, SVGGElement, unknown>;
    label?: d3.Selection<SVGTextElement, GraphNode, SVGGElement, unknown>;
    adjacency?: Record<string, Set<string>>;
  }>({});
  const { resolvedTheme } = useTheme();
  const colors = COLORS[resolvedTheme === 'dark' ? 'dark' : 'light'];

  const typeMeta: Record<GraphNode['type'], { label: string; color: string }> = useMemo(
    () => ({
      paper: { label: 'Papers', color: colors.gold },
      concept: { label: 'Concepts', color: colors.blue },
      topic: { label: 'Topics', color: colors.teal },
      article: { label: 'Articles', color: colors.textDim },
      blog: { label: 'Blog', color: colors.steel },
      book: { label: 'Books', color: colors.goldLight },
      person: { label: 'People', color: colors.text },
    }),
    [colors]
  );

  const filtered = useMemo(() => {
    const nodes = data.nodes.filter((n) => enabledTypes[n.type]);
    const allowed = new Set(nodes.map((n) => n.id));
    const links = data.links.filter((l) => {
      const s = typeof l.source === 'string' ? l.source : l.source.id;
      const t = typeof l.target === 'string' ? l.target : l.target.id;
      return allowed.has(s) && allowed.has(t);
    });
    return { nodes, links };
  }, [data.nodes, data.links, enabledTypes]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return filtered.nodes
      .filter((n) => n.id.toLowerCase().includes(q) || (n.title || '').toLowerCase().includes(q))
      .slice(0, 8);
  }, [filtered.nodes, query]);

  useEffect(() => {
    focusIdRef.current = focusId;
  }, [focusId]);

  useEffect(() => {
    if (!containerRef.current || !svgRef.current || !filtered.nodes.length) return;

    let width = containerRef.current.clientWidth;
    let height = containerRef.current.clientHeight || 600;

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
        updateLabelVisibility(event.transform.k);
      });

    svg.call(zoom);

    const nodes = filtered.nodes.map((n) => ({ ...n }));
    const links = filtered.links.map((l) => ({
      source: typeof l.source === 'string' ? l.source : l.source.id,
      target: typeof l.target === 'string' ? l.target : l.target.id,
    }));

    // Fast neighbor lookup for highlighting.
    const adjacency: Record<string, Set<string>> = {};
    for (const l of links) {
      const s = String(l.source);
      const t = String(l.target);
      if (!adjacency[s]) adjacency[s] = new Set();
      if (!adjacency[t]) adjacency[t] = new Set();
      adjacency[s].add(t);
      adjacency[t].add(s);
    }

    // Simulation
    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force('link', d3.forceLink<GraphNode, any>(links).id(d => d.id).distance(110))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(d => (d as GraphNode).val * 5 + 10));

    // Links
    const link = g.append('g')
      .attr('stroke', colors.steel)
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links as any[])
      .join('line')
      .attr('stroke-width', 1);

    // Nodes
    const node = g.append('g')
      .attr('stroke', colors.void)
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', d => d.val * 3 + 2) // Base size + centrality
      .attr('fill', d => typeMeta[d.type].color)
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
      .data(nodes)
      .join('text')
      .attr('dx', 12)
      .attr('dy', 4)
      .text(d => d.id) // IDs appear only when zoomed in (see updateLabelVisibility)
      .attr('font-size', '10px')
      .attr('fill', colors.textDim)
      .attr('pointer-events', 'none')
      .style('opacity', 0); // start hidden; reveal based on zoom/focus

    // Interactions
    node
      .on('mouseover', (event, d) => {
        setHoveredNode(d);
        d3.select(event.currentTarget).attr('stroke', colors.text).attr('stroke-width', 2);
      })
      .on('mouseout', (event) => {
        setHoveredNode(null);
        d3.select(event.currentTarget).attr('stroke', colors.void).attr('stroke-width', 1.5);
      })
      .on('click', (event, d) => {
        const path =
          d.type === 'paper'
            ? 'papers'
            : d.type === 'concept'
              ? 'concepts'
              : d.type === 'topic'
                ? 'topics'
                : d.type === 'article'
                  ? 'articles'
                  : d.type === 'blog'
                    ? 'blog'
                    : d.type === 'book'
                      ? 'books'
                      : 'people';
        const basePath = getBasePath(lang, getPerspectiveFromPathname(pathname));
        router.push(`${basePath}/${path}/${d.id}`);
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

    selectionsRef.current = { node: node as any, link: link as any, label: label as any, adjacency };

    // Apply initial label visibility (zoom starts at 1).
    updateLabelVisibility(1);

    // Resize handling
    const ro = new ResizeObserver(() => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight || 600;
      simulation.force('center', d3.forceCenter(width / 2, height / 2));
      simulation.alpha(0.2).restart();
    });
    ro.observe(containerRef.current);

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

    function updateLabelVisibility(k: number) {
      // If the user has focused a node, labels are controlled by the focus highlighter effect.
      // Otherwise, labels are hidden until you zoom in.
      const focused = focusIdRef.current.trim();
      if (focused) return;
      const minVal = k >= 2.2 ? 1.6 : k >= 1.6 ? 3.2 : Number.POSITIVE_INFINITY;
      label.style('opacity', (d) => (d.val >= minVal ? 1 : 0));
    }

    return () => {
      ro.disconnect();
      simulation.stop();
    };
  }, [filtered.nodes, filtered.links, lang, router, colors, pathname, typeMeta]);

  useEffect(() => {
    const sel = selectionsRef.current;
    if (!sel.node || !sel.link || !sel.label || !sel.adjacency) return;

    const focus = focusId.trim();
    if (!focus) {
      sel.node.attr('opacity', 1);
      sel.link.attr('opacity', 0.6);
      // When focus is cleared, hide labels again until zoomed in.
      sel.label.style('opacity', 0);
      return;
    }

    const focusLower = focus.toLowerCase();
    const focusNode = filtered.nodes.find((n) => n.id.toLowerCase() === focusLower) || null;
    if (!focusNode) return;
    const neighbors = sel.adjacency[focusNode.id] || new Set<string>();

    sel.node.attr('opacity', (d: GraphNode) => (d.id === focusNode.id || neighbors.has(d.id) ? 1 : 0.12));
    sel.link.attr('opacity', (l: any) => {
      const s = typeof l.source === 'string' ? l.source : l.source.id;
      const t = typeof l.target === 'string' ? l.target : l.target.id;
      return s === focusNode.id || t === focusNode.id ? 0.9 : 0.08;
    });
    sel.label.style('opacity', (d: GraphNode) => (d.id === focusNode.id || neighbors.has(d.id) ? 1 : 0));
  }, [focusId, filtered.nodes]);

  return (
    <div ref={containerRef} className="w-full h-[600px] relative bg-frc-void border border-frc-blue/30 rounded-lg overflow-hidden">
      <svg ref={svgRef} className="w-full h-full block" />
      
      {/* Controls */}
      <div className="absolute top-4 right-4 w-[18rem] max-w-[calc(100%-2rem)] bg-frc-void/85 backdrop-blur border border-frc-blue/60 p-3 rounded text-xs pointer-events-auto">
        <div className="text-[10px] uppercase tracking-widest text-frc-steel mb-2">Filter</div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {(Object.keys(enabledTypes) as Array<GraphNode['type']>).map((t) => (
            <label key={t} className="flex items-center gap-2 text-frc-text-dim">
              <input
                type="checkbox"
                checked={enabledTypes[t]}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setEnabledTypes((prev) => ({ ...prev, [t]: checked }));
                }}
              />
              <span className="inline-flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: typeMeta[t].color }} />
                <span>{typeMeta[t].label}</span>
              </span>
            </label>
          ))}
        </div>

        <div className="text-[10px] uppercase tracking-widest text-frc-steel mb-2">Find</div>
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;
              const q = query.trim().toLowerCase();
              if (!q) return;
              const match =
                filtered.nodes.find((n) => n.id.toLowerCase() === q) ||
                filtered.nodes.find((n) => n.id.toLowerCase().includes(q) || (n.title || '').toLowerCase().includes(q)) ||
                null;
              if (match) setFocusId(match.id);
            }}
            className="w-full bg-frc-void border border-frc-blue/60 rounded px-2 py-1 text-frc-text-dim focus:outline-none focus:border-frc-gold"
            placeholder="Search id or title…"
          />
          {suggestions.length > 0 && (
            <div className="absolute z-20 mt-1 w-full bg-frc-void border border-frc-blue/60 rounded overflow-hidden shadow-xl">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setFocusId(s.id);
                    setQuery(s.id);
                  }}
                  className="w-full text-left px-2 py-1 hover:bg-frc-blue/20 text-frc-text-dim"
                >
                  <span className="font-mono text-[10px] text-frc-steel">{s.id}</span>
                  <span className="ml-2">{s.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <button
            type="button"
            onClick={() => setFocusId('')}
            className="text-[10px] uppercase tracking-widest text-frc-steel hover:text-frc-gold"
          >
            Clear focus
          </button>
          <span className="text-[10px] text-frc-steel">{filtered.nodes.length} nodes</span>
        </div>
      </div>

      {/* HUD */}
      <div className="absolute bottom-4 left-4 bg-frc-void/80 backdrop-blur border border-frc-blue p-3 rounded text-xs space-y-2 pointer-events-none">
        <div className="text-[10px] text-frc-steel">
          Scroll to zoom • Drag to move • Click node to open • Zoom in to see IDs
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
