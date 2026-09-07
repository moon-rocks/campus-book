import React, { useMemo, useState } from 'react';
import { Check, Clipboard, Code2, ExternalLink, X } from 'lucide-react';
import { ProjectFileNode } from '../../types';
import { MAX_PROJECT_PREVIEW_BYTES, isPreviewableProjectFile } from '../../lib/projectSecurity';

interface ProjectFileViewerProps {
  file: ProjectFileNode | null;
  onClose: () => void;
}

export const ProjectFileViewer: React.FC<ProjectFileViewerProps> = ({ file, onClose }) => {
  const [copied, setCopied] = useState(false);
  const code = file?.content || '';
  const lines = useMemo(() => code.split('\n'), [code]);
  if (!file) return <section className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-xs text-slate-500">Select a safe source file to preview it here.</section>;

  const copy = async () => {
    await navigator.clipboard?.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
    <header className="flex flex-wrap items-center gap-3 border-b border-slate-800 px-4 py-3 text-slate-200">
      <Code2 className="h-4 w-4 text-indigo-400" /><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold">{file.name}</p><p className="truncate font-mono text-[10px] text-slate-500">{file.path}</p></div>
      <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-2 text-[11px] font-bold hover:bg-slate-700">{copied ? <Check className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />} {copied ? 'Copied' : 'Copy code'}</button>
      <button type="button" onClick={onClose} title="Close viewer" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><X className="h-4 w-4" /></button>
    </header>
    {!isPreviewableProjectFile(file) ? <p className="p-8 text-sm text-slate-400">Preview not available for this file type.</p> : file.size > MAX_PROJECT_PREVIEW_BYTES ? <p className="p-8 text-sm text-slate-400">This file is too large to preview.</p> : file.kind === 'image' ? <div className="p-6"><img src={file.content} alt={file.name} className="max-h-[32rem] max-w-full rounded-lg object-contain" /></div> : <pre className="max-h-[38rem] overflow-auto p-4 text-left font-mono text-xs leading-6 text-slate-200"><code>{lines.map((line, index) => <span key={index} className="block"><span className="mr-5 inline-block w-8 select-none text-right text-slate-600">{index + 1}</span>{line || ' '}</span>)}</code></pre>}
  </section>;
};
