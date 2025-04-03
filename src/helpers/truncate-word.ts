export function truncateWord(word: string, maxLength: number): string {
  return word.length > maxLength ? word.slice(0, maxLength) + "..." : word;
}
