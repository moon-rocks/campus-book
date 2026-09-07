import { ProjectFileKind, ProjectFileNode } from '../types';

const PROTECTED_NAMES = new Set([
  '.env', 'credentials.json', 'secrets.json', 'firebase-adminsdk.json',
]);
const PROTECTED_EXTENSIONS = /\.(key|pem|p12|pfx)$/i;
const PROTECTED_PREFIXES = ['service-account', 'firebase-adminsdk'];

export function isProtectedProjectPath(input: string): boolean {
  const normalized = input.replace(/\\/g, '/').replace(/^\.\//, '');
  if (!normalized || normalized.split('/').some((segment) => segment === '.git' || segment === '.ssh' || segment === 'node_modules')) return true;
  const fileName = normalized.split('/').pop() || '';
  return PROTECTED_NAMES.has(fileName) || /^\.env(?:\..*)?$/i.test(fileName) || PROTECTED_EXTENSIONS.test(fileName) || PROTECTED_PREFIXES.some((prefix) => fileName.toLowerCase().startsWith(prefix));
}

export function projectFileKind(path: string): ProjectFileKind {
  const extension = path.split('.').pop()?.toLowerCase() || '';
  if (['ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs', 'py', 'java', 'go', 'rs', 'sql', 'sh'].includes(extension)) return 'code';
  if (extension === 'md' || extension === 'mdx') return 'markdown';
  if (extension === 'json') return 'json';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension)) return 'image';
  if (extension === 'pdf') return 'pdf';
  return 'other';
}

export function sanitizeProjectTree(nodes: ProjectFileNode[]): ProjectFileNode[] {
  return nodes
    .filter((node) => !isProtectedProjectPath(node.path))
    .map((node) => ({
      ...node,
      children: node.children ? sanitizeProjectTree(node.children) : undefined,
      content: node.content,
    }));
}

export function flattenProjectTree(nodes: ProjectFileNode[]): ProjectFileNode[] {
  return nodes.flatMap((node) => [node, ...(node.children ? flattenProjectTree(node.children) : [])]);
}

export function findProjectFile(nodes: ProjectFileNode[], path: string): ProjectFileNode | null {
  return flattenProjectTree(nodes).find((node) => node.path === path) || null;
}

export function isPreviewableProjectFile(node: ProjectFileNode): boolean {
  return node.kind === 'code' || node.kind === 'markdown' || node.kind === 'json' || node.kind === 'other' || node.kind === 'image';
}

export const MAX_PROJECT_PREVIEW_BYTES = 200_000;