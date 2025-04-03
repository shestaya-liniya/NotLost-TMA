export function chunkArray<T>(array: T[], size: number): T[][] {
  return array.reduce((chunks: T[][], _, i) => {
    if (i % size === 0) chunks.push(array.slice(i, i + size));
    return chunks;
  }, []);
}
