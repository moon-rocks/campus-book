import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Clipboard, File, FileCode2, FileImage, FileJson, FileText, Folder, FolderOpen, Image, Search } from 'lucide-react';
import { ProjectFileNode } from '../../types';
import { flattenProjectTree } from '../../lib/projectSecurity';

const iconFor = (node: ProjectFileNode) => {
  if (node.kind === 'folder') return node.children?.length ? FolderOpen : Folder;
  if (node.kind === 'image') return FileImage;
  if (node.kind === 'json') return FileJson;
  if (node.kind === 'code') return FileCode2;
  if (node.kind === 'markdown') return FileText;
  return File;
};

interface ProjectFileTreeProps {
  files: ProjectFileNode[];
  onSelect: (file: ProjectFileNode) => void;
}

export const ProjectFileTree: React.FC<ProjectFileTreeProps> = ({ files, onSelect }) => {
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const flatFiles = useMemo(() => flattenProjectTree(files), [files]);
  const results = query.trim() ? flatFiles.filter((file) => file.path.toLowerCase().includes(query.trim().toLowerCase())) : null;

  const copyPath = async (path: string) => {
    await navigator.clipboard?.writeText(path);
  };

  const toggle = (path: string) => setCollapsed((current) => {
    const next = new Set(current);
    if (next.has(path)) next.delete(path); else next.add(path);
    return next;
  });

  const renderNode = (node: ProjectFileNode, depth = 0): React.ReactNode => {
    const Icon = iconFor(node);
    const isFolder = node.kind === 'folder';
    const isCollapsed = collapsed.has(node.path);
    return (
      <div key={node.path}>
        <div className="group flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs hover:bg-indigo-50">
          {isFolder ? (
            <button type="button" onClick={() => toggle(node.path)} className="p-0.5 text-slate-500" aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} ${node.name}`}>
              {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          ) : <span className="w-4" />}
          <button type="button" onClick={() => !isFolder && onSelect(node)} className={`flex min-w-0 flex-1 items-center gap-2 text-left ${isFolder ? 'cursor-default' : 'cursor-pointer'}`}>
            <Icon className={`h-4 w-4 shrink-0 ${isFolder ? 'text-amber-500' : 'text-indigo-500'}`} />
            <span className="truncate text-slate-700">{node.name}</span>
          </button>
          {!isFolder && <button type="button" onClick={() => copyPath(node.path)} title="Copy file path" className="invisible rounded p-1 text-slate-400 hover:bg-white hover:text-indigo-600 group-hover:visible"><Clipboard className="h-3.5 w-3.5" /></button>}
        </div>
        {isFolder && !isCollapsed && node.children?.map((child) => <div key={child.path} className="ml-4">{renderNode(child, depth + 1)}</div>)}
      </div>
    );
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-4">
        <div className="mb-3 flex items-center gap-2"><Folder className="h-4 w-4 text-indigo-600" /><h2 className="font-display text-sm font-bold text-slate-900">Project Structure</h2><span className="ml-auto text-[11px] text-slate-400">{flatFiles.length} safe files</span></div>
        <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search files..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-indigo-400" /></div>
      </div>
      <div className="max-h-[34rem] overflow-auto p-3 font-mono">
        {results ? results.map((file) => <button key={file.path} type="button" onClick={() => onSelect(file)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs hover:bg-indigo-50"><File className="h-4 w-4 text-indigo-500" />{file.path}</button>) : files.map((node) => renderNode(node))}
        {!flatFiles.length && <p className="p-4 text-xs text-slate-500">No safe files are available.</p>}
      </div>
    </section>
  );
};
