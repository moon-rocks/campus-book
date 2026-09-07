import React, { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, Github, Link2, Package, Download } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Project } from '../types';
import { projectApi } from '../services/projectApi';
import { ProjectFileTree } from '../components/projects/ProjectFileTree';
import { ProjectFileViewer } from '../components/projects/ProjectFileViewer';
import { findProjectFile } from '../lib/projectSecurity';

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  useEffect(() => { projectApi.get(id || '').then(setProject); }, [id]);
  const selected = project && selectedPath ? findProjectFile(project.fileTree, selectedPath) : null;
  if (!project) return <div className="flex min-h-[70vh] items-center justify-center text-sm text-slate-500">Project not found or not publicly approved.</div>;
  return <div className="min-h-screen bg-slate-50/60 py-8 sm:py-12"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <button type="button" onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600"><ArrowLeft className="h-4 w-4" />Back to projects</button>
    <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-5"><div><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">Project Overview</p><h1 className="font-display text-3xl font-extrabold text-slate-900">{project.name}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{project.description}</p><p className="mt-3 text-xs text-slate-500">By {project.author} · {project.technology} · {project.category}</p></div><div className="flex flex-wrap gap-2">{project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white"><Github className="h-4 w-4" />GitHub</a>}{project.liveDemoUrl && <a href={project.liveDemoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700"><ExternalLink className="h-4 w-4" />Live demo</a>}<button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700"><Download className="h-4 w-4" />Download</button></div></div></section>
    <div className="grid gap-6 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.4fr)]"><ProjectFileTree files={project.fileTree} onSelect={(file) => setSelectedPath(file.path)} /><div><ProjectFileViewer file={selected} onClose={() => setSelectedPath(null)} /><div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500"><Package className="h-3.5 w-3.5" />Safe files only. Uploaded code is displayed as text and never executed.</div></div></div>
  </div></div>;
};
