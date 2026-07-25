import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const MINT = '#1a7a5e';
const MINT_BG = '#e0f5ec';

function normalPdf(x: number, mu: number, sigma: number) {
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) *
    Math.exp(-0.5 * ((x - mu) / sigma) ** 2);
}

function erf(x: number): number {
  const t = 1.0 / (1.0 + 0.5 * Math.abs(x));
  const tau = t * Math.exp(
    -x * x - 1.26551223 +
    t * (1.00002368 + t * (0.37409196 +
    t * (0.09678418 + t * (-0.18628806 +
    t * (0.27886807 + t * (-1.13520398 +
    t * (1.48851587 + t * (-0.82215223 +
    t * 0.17087294))))))))
  );
  return x >= 0 ? 1 - tau : tau - 1;
}

function normalCdf(x: number, mu: number, sigma: number) {
  return 0.5 * (1 + erf((x - mu) / (sigma * Math.sqrt(2))));
}

const AMES_STAGES = [
  { round: 1,   mu: 185, sigma: 55 },
  { round: 10,  mu: 183, sigma: 40 },
  { round: 25,  mu: 181, sigma: 30 },
  { round: 50,  mu: 181, sigma: 22 },
  { round: 100, mu: 181, sigma: 16 },
  { round: 200, mu: 181, sigma: 12 },
];
const TRUE_PRICE = 178;

type Tab = 'training' | 'prediction';

export default function Chart() {
  const [tab, setTab] = useState<Tab>('training');
  const [stageIdx, setStageIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const draw = () => {
      if (tab === 'training') drawTraining(el, stageIdx);
      else drawPrediction(el);
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(el);
    return () => ro.disconnect();
  }, [tab, stageIdx]);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', padding: '24px 32px', background: '#fafafa', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['training', 'prediction'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '6px 16px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              background: tab === t ? MINT : '#f3f4f6',
              color: tab === t ? '#fff' : '#374151',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {t === 'training' ? 'Training (Ames Housing)' : 'Prediction (MLB Batter)'}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div ref={containerRef} style={{ width: '100%' }} />

      {/* Stage slider */}
      {tab === 'training' && (
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: '#6b7280', whiteSpace: 'nowrap' }}>
            Boosting round:
          </span>
          <input
            type="range"
            min={0}
            max={AMES_STAGES.length - 1}
            value={stageIdx}
            onChange={(e) => setStageIdx(+e.target.value)}
            style={{ flex: 1, accentColor: MINT }}
          />
          <span style={{ fontSize: 13, color: MINT, fontWeight: 600, minWidth: 28 }}>
            {AMES_STAGES[stageIdx].round}
          </span>
        </div>
      )}
    </div>
  );
}

function drawTraining(container: HTMLDivElement, stageIdx: number) {
  d3.select(container).selectAll('svg').remove();
  const { width } = container.getBoundingClientRect();
  if (!width) return;

  const m = { top: 36, right: 24, bottom: 52, left: 20 };
  const h = 280;
  const iw = width - m.left - m.right;
  const ih = h - m.top - m.bottom;

  const { mu, sigma } = AMES_STAGES[stageIdx];
  const xMin = Math.max(60, mu - 4 * sigma);
  const xMax = mu + 4 * sigma;

  const svg = d3.select(container).append('svg').attr('width', width).attr('height', h);
  const g = svg.append('g').attr('transform', `translate(${m.left},${m.top})`);

  const x = d3.scaleLinear().domain([xMin, xMax]).range([0, iw]);
  const pts = d3.range(xMin, xMax, (xMax - xMin) / 400).map(v => ({ x: v, y: normalPdf(v, mu, sigma) }));
  const yPeak = normalPdf(mu, mu, sigma);
  const y = d3.scaleLinear().domain([0, yPeak * 1.18]).range([ih, 0]);

  // Area fill
  g.append('path')
    .datum(pts)
    .attr('fill', MINT_BG)
    .attr('d', d3.area<{ x: number; y: number }>()
      .x(d => x(d.x)).y0(ih).y1(d => y(d.y)).curve(d3.curveBasis));

  // Curve
  g.append('path')
    .datum(pts)
    .attr('fill', 'none')
    .attr('stroke', MINT)
    .attr('stroke-width', 2.5)
    .attr('d', d3.line<{ x: number; y: number }>()
      .x(d => x(d.x)).y(d => y(d.y)).curve(d3.curveBasis));

  // True price line
  if (TRUE_PRICE >= xMin && TRUE_PRICE <= xMax) {
    g.append('line')
      .attr('x1', x(TRUE_PRICE)).attr('x2', x(TRUE_PRICE))
      .attr('y1', 0).attr('y2', ih)
      .attr('stroke', '#9ca3af').attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '5 3');
    g.append('text')
      .attr('x', x(TRUE_PRICE) + 6).attr('y', 14)
      .attr('fill', '#9ca3af').attr('font-size', 11)
      .text(`Actual: $${TRUE_PRICE}k`);
  }

  // Axes
  g.append('g').attr('transform', `translate(0,${ih})`)
    .call(d3.axisBottom(x).ticks(6).tickFormat(d => `$${d}k`));

  g.append('text')
    .attr('x', iw / 2).attr('y', ih + 44)
    .attr('text-anchor', 'middle').attr('fill', '#6b7280').attr('font-size', 12)
    .text('Predicted sale price (Ames Housing)');

  // Title
  g.append('text')
    .attr('x', 0).attr('y', -16)
    .attr('fill', '#374151').attr('font-size', 13).attr('font-weight', '600')
    .text('As NGBoost trains, the predicted distribution narrows');

  // Mean ± sigma annotation
  g.append('text')
    .attr('x', iw).attr('y', -16)
    .attr('text-anchor', 'end').attr('fill', MINT)
    .attr('font-size', 12).attr('font-weight', '600')
    .text(`$${mu}k ± $${sigma}k`);
}

function drawPrediction(container: HTMLDivElement) {
  d3.select(container).selectAll('svg').remove();
  const { width } = container.getBoundingClientRect();
  if (!width) return;

  const isMobile = width < 520;
  const m = { top: 44, right: 16, bottom: 52, left: 16 };
  const gap = isMobile ? 0 : 24;
  const h = isMobile ? 560 : 320;
  const panelW = isMobile ? width - m.left - m.right : (width - m.left - m.right - gap) / 2;
  const ih = isMobile ? (h - m.top - m.bottom) / 2 - 16 : h - m.top - m.bottom;

  const mu = 1.8;
  const sigma = 0.65;
  const xDomain: [number, number] = [-0.2, 4.2];

  const svg = d3.select(container).append('svg').attr('width', width).attr('height', h);

  function leftOffset() { return m.left; }
  function rightOffset() {
    return isMobile ? m.left : m.left + panelW + gap;
  }
  function leftTop() { return m.top; }
  function rightTop() {
    return isMobile ? m.top + ih + 60 : m.top;
  }

  // --- LEFT: Standard GB ---
  const gL = svg.append('g').attr('transform', `translate(${leftOffset()},${leftTop()})`);

  gL.append('text')
    .attr('x', panelW / 2).attr('y', -26)
    .attr('text-anchor', 'middle').attr('fill', '#374151')
    .attr('font-size', 13).attr('font-weight', '600')
    .text('Standard Gradient Boosting');

  gL.append('text')
    .attr('x', panelW / 2).attr('y', -12)
    .attr('text-anchor', 'middle').attr('fill', '#9ca3af').attr('font-size', 11)
    .text('one number');

  const xL = d3.scaleLinear().domain(xDomain).range([0, panelW]);

  gL.append('line')
    .attr('x1', 0).attr('x2', panelW)
    .attr('y1', ih).attr('y2', ih)
    .attr('stroke', '#e5e7eb').attr('stroke-width', 1);

  gL.append('g').attr('transform', `translate(0,${ih})`)
    .call(d3.axisBottom(xL).ticks(5));

  gL.append('text')
    .attr('x', panelW / 2).attr('y', ih + 44)
    .attr('text-anchor', 'middle').attr('fill', '#6b7280').attr('font-size', 11)
    .text('Predicted hits');

  // Spike
  gL.append('line')
    .attr('x1', xL(mu)).attr('x2', xL(mu))
    .attr('y1', ih).attr('y2', 30)
    .attr('stroke', '#374151').attr('stroke-width', 3);

  gL.append('circle')
    .attr('cx', xL(mu)).attr('cy', 28)
    .attr('r', 6).attr('fill', '#374151');

  gL.append('text')
    .attr('x', xL(mu)).attr('y', 15)
    .attr('text-anchor', 'middle').attr('fill', '#374151')
    .attr('font-size', 13).attr('font-weight', '600')
    .text(`${mu} hits`);

  // --- RIGHT: NGBoost ---
  const gR = svg.append('g').attr('transform', `translate(${rightOffset()},${rightTop()})`);

  gR.append('text')
    .attr('x', panelW / 2).attr('y', -26)
    .attr('text-anchor', 'middle').attr('fill', '#374151')
    .attr('font-size', 13).attr('font-weight', '600')
    .text('NGBoost');

  gR.append('text')
    .attr('x', panelW / 2).attr('y', -12)
    .attr('text-anchor', 'middle').attr('fill', '#9ca3af').attr('font-size', 11)
    .text('a full distribution');

  const xR = d3.scaleLinear().domain(xDomain).range([0, panelW]);
  const pts = d3.range(xDomain[0], xDomain[1], (xDomain[1] - xDomain[0]) / 400)
    .map(v => ({ x: v, y: normalPdf(v, mu, sigma) }));
  const yPeak = normalPdf(mu, mu, sigma);
  const yS = d3.scaleLinear().domain([0, yPeak * 1.18]).range([ih, 0]);

  // Shaded P(hits >= 2)
  gR.append('path')
    .datum(pts.filter(p => p.x >= 2))
    .attr('fill', MINT_BG)
    .attr('d', d3.area<{ x: number; y: number }>()
      .x(d => xR(d.x)).y0(ih).y1(d => yS(d.y)).curve(d3.curveBasis));

  // Full curve
  gR.append('path')
    .datum(pts)
    .attr('fill', 'none')
    .attr('stroke', MINT).attr('stroke-width', 2.5)
    .attr('d', d3.line<{ x: number; y: number }>()
      .x(d => xR(d.x)).y(d => yS(d.y)).curve(d3.curveBasis));

  // Mean dashed
  gR.append('line')
    .attr('x1', xR(mu)).attr('x2', xR(mu))
    .attr('y1', yS(yPeak)).attr('y2', ih)
    .attr('stroke', MINT).attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '4 3');

  // Threshold at 2
  gR.append('line')
    .attr('x1', xR(2)).attr('x2', xR(2))
    .attr('y1', 0).attr('y2', ih)
    .attr('stroke', '#d1d5db').attr('stroke-width', 1)
    .attr('stroke-dasharray', '3 3');

  // P(>=2) label
  const pAbove = (1 - normalCdf(2, mu, sigma)) * 100;
  gR.append('text')
    .attr('x', xR(3.1)).attr('y', yS(normalPdf(2.9, mu, sigma)) - 10)
    .attr('text-anchor', 'middle').attr('fill', MINT)
    .attr('font-size', 12).attr('font-weight', '600')
    .text(`P(≥2 hits) = ${pAbove.toFixed(0)}%`);

  // mu/sigma label
  gR.append('text')
    .attr('x', 4).attr('y', 14)
    .attr('fill', '#6b7280').attr('font-size', 11)
    .text(`μ = ${mu},  σ = ${sigma}`);

  gR.append('line')
    .attr('x1', 0).attr('x2', panelW)
    .attr('y1', ih).attr('y2', ih)
    .attr('stroke', '#e5e7eb').attr('stroke-width', 1);

  gR.append('g').attr('transform', `translate(0,${ih})`)
    .call(d3.axisBottom(xR).ticks(5));

  gR.append('text')
    .attr('x', panelW / 2).attr('y', ih + 44)
    .attr('text-anchor', 'middle').attr('fill', '#6b7280').attr('font-size', 11)
    .text('Predicted hits');
}
