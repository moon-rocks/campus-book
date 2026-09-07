import { Project, ProjectFileNode, ProjectStatus } from '../types';
import { sanitizeProjectTree } from '../lib/projectSecurity';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const STORAGE_KEY = 'campus_book_projects_v1';

const DEMO_PROJECT: Project = {
  id: 'demo-digital-library',
  name: 'Digital Library Project',
  description: 'A safe example project explorer for campus submissions.',
  author: 'Campus Book Team',
  technology: 'React, TypeScript, Supabase',
  category: 'Web Application',
  status: 'approved',
  fileTree: [{
    path: 'src', name: 'src', kind: 'folder', size: 0, children: [
      { path: 'src/App.tsx', name: 'App.tsx', kind: 'code', size: 138, content: 'export default function App() {\n  return <main>Digital Library</main>;\n}\n' },
      { path: 'src/main.tsx', name: 'main.tsx', kind: 'code', size: 96, content: "import { createRoot } from 'react-dom/client';\nimport App from './App';\n\ncreateRoot(document.getElementById('root')!).render(<App />);\n" },
    ],
  }, { path: 'README.md', name: 'README.md', kind: 'markdown', size: 142, content: '# Digital Library\n\nThis README is rendered as safe text by the project viewer.\n' }, { path: 'package.json', name: 'package.json', kind: 'json', size: 92, content: '{\n  "name": "digital-library",\n  "version": "1.0.0",\n  "scripts": { "dev": "vite" },\n  "dependencies": { "react": "latest" }\n}\n' }],
  fileCount: 4,
  safeFileCount: 4,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function mapProject(row: any): Project {
  const tree = sanitizeProjectTree(Array.isArray(row.file_tree) ? row.file_tree : []);
  return { id: row.id, name: row.name, description: row.description || '', author: row.author || '', technology: row.technology || '', category: row.category || '', githubUrl: row.github_url || undefined, liveDemoUrl: row.live_demo_url || undefined, status: row.status as ProjectStatus, fileTree: tree, fileCount: Number(row.file_count || tree.length), safeFileCount: Number(row.safe_file_count || tree.length), createdAt: row.created_at, updatedAt: row.updated_at };
}

function localProjects(): Project[] {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    return Array.isArray(stored) ? stored : [DEMO_PROJECT];
  } catch { return [DEMO_PROJECT]; }
}

export const projectApi = {
  async list(approvedOnly = true): Promise<Project[]> {
    if (isSupabaseConfigured && supabase) {
      const query = supabase.from('projects').select('*').order('created_at', { ascending: false });
      const { data, error } = approvedOnly ? await query.eq('status', 'approved') : await query;
      if (!error && Array.isArray(data)) return data.map(mapProject);
    }
    return localProjects().filter((project) => !approvedOnly || project.status === 'approved');
  },

  async get(id: string): Promise<Project | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('projects').select('*').eq('id', id).maybeSingle();
      if (!error && data) return mapProject(data);
    }
    return localProjects().find((project) => project.id === id) || null;
  },

  async updateStatus(id: string, status: ProjectStatus): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('projects').update({ status }).eq('id', id);
      if (!error) return true;
    }
    const projects = localProjects();
    const project = projects.find((item) => item.id === id);
    if (!project) return false;
    project.status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return true;
  },

  async delete(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (!error) return true;
    }
    const projects = localProjects().filter((project) => project.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return projects.length !== localProjects().length;
  },
};
