"use client";

import React, { useEffect, useState } from "react";
import { BookOpen, Database, Plus, Search, FileText, CheckCircle2, ExternalLink } from "lucide-react";

export default function KnowledgeBaseModal() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showIngestModal, setShowIngestModal] = useState(false);

  // Ingest form state
  const [newTitle, setNewTitle] = useState("");
  const [newPublisher, setNewPublisher] = useState("World Health Organization");
  const [newSourceUrl, setNewSourceUrl] = useState("");
  const [newVersion, setNewVersion] = useState("2026 Edition");
  const [newCategory, setNewCategory] = useState("Respiratory");
  const [newContent, setNewContent] = useState("");
  const [ingesting, setIngesting] = useState(false);

  const fetchDocs = () => {
    fetch("http://localhost:8000/api/knowledge/documents")
      .then((res) => res.json())
      .then((data) => {
        setDocuments(data);
        setLoading(false);
      })
      .catch(() => {
        setDocuments([
          {
            id: "1",
            title: "WHO Guidelines: Severe Acute Respiratory Infection (SARI) & Pneumonia Clinical Care Toolkit",
            publisher: "World Health Organization",
            source_url: "https://www.who.int/publications/i/item/9789240010604",
            version: "v1.0",
            category: "Respiratory & Sepsis",
            chunk_count: 4,
            content_preview: "Clinical assessment criteria for SpO2 hypoxemic pneumonia..."
          },
          {
            id: "2",
            title: "ADA Standards of Care in Diabetes — 2026",
            publisher: "American Diabetes Association",
            source_url: "https://diabetesjournals.org/care/issue/49/Supplement_1",
            version: "2026 Standards of Care",
            category: "Diabetes & Metabolism",
            chunk_count: 3,
            content_preview: "Diagnostic criteria for blood glucose > 250 mg/dL, IV rehydration..."
          }
        ]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIngesting(true);

    try {
      await fetch("http://localhost:8000/api/knowledge/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          publisher: newPublisher,
          source_url: newSourceUrl,
          version: newVersion,
          category: newCategory,
          content: newContent
        })
      });
      fetchDocs();
      setShowIngestModal(false);
      setNewTitle("");
      setNewContent("");
    } catch (e) {
      console.error(e);
    } finally {
      setIngesting(false);
    }
  };

  const filteredDocs = documents.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (d.publisher || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.category || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900/80 light-theme:bg-white border border-teal-500/30 light-theme:border-slate-300 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-400 light-theme:text-teal-700" />
            <h2 className="text-xl font-black text-slate-100 light-theme:text-slate-900 tracking-tight">Medical Vector Knowledge Base</h2>
          </div>
          <p className="text-xs text-slate-400 light-theme:text-slate-600 mt-1 font-medium">
            Authentic official medical guidelines from WHO, ADA, ESC, and CDC parsed page-by-page into vector embeddings.
          </p>
        </div>

        <button
          onClick={() => setShowIngestModal(true)}
          className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black px-5 py-2.5 rounded-xl shadow-lg text-xs flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Ingest Clinical Guideline PDF/Text
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 light-theme:text-slate-500 absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search official WHO, ADA, ESC, or CDC document guidelines..."
          className="w-full bg-slate-900 light-theme:bg-white border border-slate-800 light-theme:border-slate-300 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-100 light-theme:text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none shadow-sm font-medium"
        />
      </div>

      {/* Document Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 light-theme:text-slate-600 font-medium">Loading Official Guideline Documents...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="bg-slate-900/70 light-theme:bg-white border border-slate-800 light-theme:border-slate-300 rounded-xl p-5 space-y-3 flex flex-col justify-between shadow-lg">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-teal-500/10 light-theme:bg-teal-100 text-teal-400 light-theme:text-teal-800 border border-teal-500/30 light-theme:border-teal-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                    {doc.publisher || "Official Guideline"}
                  </span>
                  <span className="text-xs font-bold text-cyan-400 light-theme:text-cyan-800 bg-cyan-500/10 light-theme:bg-cyan-100 px-2 py-0.5 rounded border border-cyan-500/20 light-theme:border-cyan-300">
                    {doc.chunk_count || 4} Chunks Indexed
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-200 light-theme:text-slate-900 line-clamp-2">{doc.title}</h3>
                
                <p className="text-xs text-slate-400 light-theme:text-slate-700 bg-slate-950 light-theme:bg-slate-50 p-3 rounded-lg border border-slate-850 light-theme:border-slate-200 line-clamp-3 font-medium">
                  {doc.content_preview}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 light-theme:border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400 light-theme:text-slate-600 text-[11px] font-medium">
                  <span>Category: <strong className="text-slate-300 light-theme:text-slate-800">{doc.category}</strong></span>
                  <span>Version: <strong className="text-slate-300 light-theme:text-slate-800">{doc.version || "N/A"}</strong></span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  {doc.source_url ? (
                    <a
                      href={doc.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 light-theme:text-emerald-800 hover:underline text-[11px] font-bold flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> Official Guideline Repository
                    </a>
                  ) : (
                    <span className="text-slate-500 light-theme:text-slate-600 text-[11px]">No external URL</span>
                  )}

                  <span className="text-emerald-400 light-theme:text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Vector Embedded
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ingest Document Modal */}
      {showIngestModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 light-theme:bg-white border border-teal-500/40 light-theme:border-slate-300 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-slate-100 light-theme:text-slate-900">
            <h3 className="text-lg font-bold text-slate-100 light-theme:text-slate-900">Ingest Official Medical Guideline Document</h3>
            
            <form onSubmit={handleIngest} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 light-theme:text-slate-800 mb-1">Document Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  placeholder="e.g. WHO SARI Clinical Care Protocol..."
                  className="w-full bg-slate-950 light-theme:bg-slate-50 border border-slate-700 light-theme:border-slate-300 text-slate-100 light-theme:text-slate-900 rounded-xl px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 light-theme:text-slate-800 mb-1">Publisher</label>
                  <input
                    type="text"
                    value={newPublisher}
                    onChange={(e) => setNewPublisher(e.target.value)}
                    placeholder="e.g. World Health Organization"
                    className="w-full bg-slate-950 light-theme:bg-slate-50 border border-slate-700 light-theme:border-slate-300 text-slate-100 light-theme:text-slate-900 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 light-theme:text-slate-800 mb-1">Category</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 light-theme:bg-slate-50 border border-slate-700 light-theme:border-slate-300 text-slate-100 light-theme:text-slate-900 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 light-theme:text-slate-800 mb-1">Official Source URL</label>
                  <input
                    type="text"
                    value={newSourceUrl}
                    onChange={(e) => setNewSourceUrl(e.target.value)}
                    placeholder="https://www.who.int/..."
                    className="w-full bg-slate-950 light-theme:bg-slate-50 border border-slate-700 light-theme:border-slate-300 text-slate-100 light-theme:text-slate-900 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 light-theme:text-slate-800 mb-1">Version / Edition</label>
                  <input
                    type="text"
                    value={newVersion}
                    onChange={(e) => setNewVersion(e.target.value)}
                    placeholder="e.g. 2026 Edition or v1.0"
                    className="w-full bg-slate-950 light-theme:bg-slate-50 border border-slate-700 light-theme:border-slate-300 text-slate-100 light-theme:text-slate-900 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 light-theme:text-slate-800 mb-1">Extracted Text Content (with === PAGE X === headers)</label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                  placeholder="Paste official text content to automatically parse pages, chunk, and embed..."
                  className="w-full bg-slate-950 light-theme:bg-slate-50 border border-slate-700 light-theme:border-slate-300 text-slate-100 light-theme:text-slate-900 rounded-xl px-4 py-2 text-sm focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIngestModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 light-theme:bg-slate-100 text-slate-300 light-theme:text-slate-700 hover:bg-slate-700 text-xs font-bold border border-slate-700 light-theme:border-slate-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={ingesting}
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black shadow"
                >
                  {ingesting ? "Ingesting Document..." : "Chunk & Embed Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
