export function generateGaussianData(n: number): {x: number, y: number}[] {
  const data = [];
  for (let i = 0; i < n; i++) {
    // Box-Muller transform
    const u = 1 - Math.random(); // Avoid 0
    const v = Math.random();
    const z1 = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    const z2 = Math.sqrt(-2.0 * Math.log(u)) * Math.sin(2.0 * Math.PI * v);
    data.push({ x: z1, y: z2 });
  }
  return data;
}
