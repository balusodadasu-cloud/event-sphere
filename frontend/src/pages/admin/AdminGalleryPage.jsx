import React, { useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';

export default function AdminGalleryPage() {
  const [images] = useState([
    { id: 1, url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500', caption: 'Crowd at Hackathon' },
    { id: 2, url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500', caption: 'Prize Distribution' }
  ]);

  return (
    <div className="p-6 text-slate-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">Manage Event Gallery</h1>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-1">
          <label className="block text-sm text-slate-400 mb-2">Select Event</label>
          <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
            <option>Hackathon 2026</option>
            <option>Cultural Fest</option>
          </select>
        </div>
        <div className="flex-1 flex items-end">
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg font-medium flex items-center justify-center gap-2">
            <ImagePlus size={20} /> Add Image via URL
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map(img => (
          <div key={img.id} className="group relative bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
            <img src={img.url} alt={img.caption} className="w-full h-48 object-cover" />
            <div className="p-4 flex justify-between items-center">
              <input type="text" defaultValue={img.caption} className="bg-transparent border-b border-slate-700 focus:border-indigo-500 text-sm outline-none w-3/4" />
              <button className="text-slate-400 hover:text-red-400"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
