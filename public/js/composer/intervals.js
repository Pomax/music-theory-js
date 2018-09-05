// basic timing intervals in terms of how many 'ticks' they run for.
const INTERVALS = {
  '1': 128,
  '2': 64,
  '4': 32,
  '8': 16,
  '16': 8,
  '32': 4,
  '64': 2
};

// enrich with dotted intervals:
for(let i=0; i<7; i++) {
  let v = 1 << i;
  INTERVALS[v + '.'] = 1.5 * INTERVALS[v];
}

export { INTERVALS };
