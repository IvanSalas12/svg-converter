'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, XCircle, Code2, Download, Image as ImageIcon } from 'lucide-react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [svgResult, setSvgResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files[0]);
    }
  };

  const handeDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async (fileToUpload: File) => {
    if (!fileToUpload.type.includes('image/')) {
      setError('Por favor sube una imagen válida (PNG, JPG).');
      return;
    }
    setError(null);
    setFile(fileToUpload);
    setSvgResult(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', fileToUpload);

      const res = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al convertir la imagen');

      setSvgResult(data.svg);
    } catch (err: any) {
      setError(err.message || 'Se produjo un error durante la conversión');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!svgResult) return;
    const blob = new Blob([svgResult], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `converted-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-4xl grid md:grid-cols-2 gap-8 items-start">
        {/* Left Card: Upload */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl flex flex-col justify-center min-h-[500px]">
          <div className="flex items-center gap-3 mb-4 text-pink-400">
            <Code2 className="w-8 h-8" />
            <h1 className="text-3xl font-bold tracking-tight text-white">Magic SVG</h1>
          </div>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Sube tu logotipo o imagen en PNG o JPG y con la magia de VTracer la convertiremos a formato vectorial instantáneamente.
          </p>

          <div
            className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${isDragOver ? 'border-pink-500 bg-pink-500/10' : 'border-gray-600 hover:border-purple-400/50 hover:bg-white/5'
              }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handeDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
            />
            <div className="bg-purple-500/20 p-4 rounded-full mb-4">
              <UploadCloud className="w-10 h-10 text-purple-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-200 mb-2">Haz clic o arrastra tu imagen</h3>
            <p className="text-sm text-gray-500">Soporta PNG, JPG y WebP hasta 10MB</p>
          </div>

          {error && (
            <div className="mt-6 flex items-start gap-2 text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-500/20">
              <XCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {file && !error && !loading && (
            <div className="mt-6 flex items-center justify-between text-gray-300 bg-white/5 px-4 py-3 rounded-xl border border-white/10">
              <span className="flex items-center gap-2 max-w-[80%] overflow-hidden text-ellipsis whitespace-nowrap">
                <ImageIcon className="w-5 h-5 text-purple-400 shrink-0" />
                {file.name}
              </span>
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
            </div>
          )}
        </div>

        {/* Right Card: Result */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl flex flex-col min-h-[500px]">
          <h2 className="text-2xl font-semibold mb-6 text-white border-b border-white/10 pb-4">
            Resultado Vectorizado
          </h2>

          {!svgResult && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <div className="bg-gray-800 p-6 rounded-full mb-4 opacity-50">
                <Code2 className="w-12 h-12" />
              </div>
              <p className="text-center px-4">El SVG resultante aparecerá mágicamente aquí.</p>
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <svg className="animate-spin h-10 w-10 text-pink-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-pink-400 font-medium animate-pulse">Vectorizando tu logo...</p>
            </div>
          )}

          {svgResult && !loading && (
            <div className="flex-1 flex flex-col h-full w-full">
              <div
                className="flex-1 bg-white/10 rounded-2xl rounded-b-none border border-white/10 p-4 overflow-hidden flex items-center justify-center shadow-inner"
                dangerouslySetInnerHTML={{ __html: svgResult }}
              />
              <button
                onClick={handleDownload}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 rounded-b-2xl shadow-lg hover:shadow-pink-500/25 transition-all text-lg flex items-center justify-center gap-2 group"
              >
                <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                Descargar SVG
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
