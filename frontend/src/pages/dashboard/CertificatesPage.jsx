import React, { useState, useEffect } from 'react';
import { Award, Download, Eye, ExternalLink } from 'lucide-react';
import * as certificateService from '../../services/certificateService';

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    try {
      setLoading(true);
      const res = await certificateService.getMyCertificates();
      setCertificates(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">My Certificates</h1>
        <p className="text-slate-400 text-sm">View and download your event participation and achievement certificates.</p>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : certificates.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map(cert => (
            <div key={cert._id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-amber-500/30 transition-all">
              <div className="h-40 bg-gradient-to-br from-amber-500/10 to-orange-500/5 relative flex items-center justify-center border-b border-slate-800">
                <Award className="w-16 h-16 text-amber-500/50 group-hover:text-amber-500 group-hover:scale-110 transition-all duration-300" />
                <div className="absolute top-3 right-3 bg-amber-500/20 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide border border-amber-500/20">
                  {cert.type || 'Participation'}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-slate-100 mb-1 truncate">{cert.event?.title || 'Event Name'}</h3>
                <p className="text-sm text-slate-400 mb-4 flex items-center gap-2">
                  Issued: {new Date(cert.issuedDate || cert.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer" className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                    <Eye className="w-4 h-4" /> View
                  </a>
                  <a href={cert.fileUrl} download className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                    <Download className="w-4 h-4" /> Save
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
          <Award className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-slate-300 mb-2">No certificates yet</h3>
          <p className="text-slate-500">Participate in events and competitions to earn certificates.</p>
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;
