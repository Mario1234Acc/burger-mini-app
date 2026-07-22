/* Lightweight `cn` utility (small clsx-like implementation)
   Supports strings, arrays, and objects: cn('a', ['b','c'], { 'd': true, 'e': false }) => 'a b c d'
*/
type ClassValue = string | number | null | undefined | ClassDictionary | ClassArray;
interface ClassDictionary { [key: string]: any }
interface ClassArray extends Array<ClassValue> {}

function toClassString(value: ClassValue): string {
  if (!value) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(toClassString).filter(Boolean).join(' ');
  if (typeof value === 'object') return Object.keys(value).filter((k) => (value as ClassDictionary)[k]).join(' ');
  return '';
}

export function cn(...inputs: ClassValue[]): string {
  return inputs.map(toClassString).filter(Boolean).join(' ');
}

export default cn;
