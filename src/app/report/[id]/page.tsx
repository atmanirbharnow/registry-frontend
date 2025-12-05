// src/app/report/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/lib/admin';

export default function FootprintReport() {
  const { id } = useParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      
      try {
        const firestore = getFirestore(app);
        const reportDoc = await getDoc(doc(firestore, 'footprintReports', id as string));
        
        if (reportDoc.exists()) {
          setReport(reportDoc.data());
        } else {
          setReport(null);
        }
      } catch (error) {
        console.error('Failed to load report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading report...</div>;
  }

  if (!report) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Report not found</div>;
  }

  const { kyc, footprint_tco2e, year, initiatives } = report;

  return (
    <div className="min-h-screen bg-white p-6 max-w-3xl mx-auto font-sans">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Earth Carbon Foundation</h1>
        <p className="text-sm text-gray-500">Verified Carbon Footprint Registry</p>
      </div>

      {/* Digital Lavender Badge */}
      <div 
        className="bg-purple-100 border-2 border-purple-300 rounded-xl p-6 mb-8 text-center"
        style={{ backgroundColor: '#f3e8ff' }}
      >
        <div className="text-3xl font-bold text-purple-800">
          {footprint_tco2e} tCO₂e
        </div>
        <div className="text-lg text-purple-700 mt-2">
          Verified Carbon Footprint ({year})
        </div>
        <div className="text-xs text-purple-600 mt-2">
          Registry ID: {report.registryId}
        </div>
      </div>

      {/* Organisation Details */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Organisation Details</h2>
        <p><strong>Name:</strong> {kyc.name}</p>
        <p><strong>Sector:</strong> {kyc.sector}</p>
        <p><strong>Location:</strong> {kyc.location?.lat?.toFixed(4)}, {kyc.location?.lng?.toFixed(4)}</p>
      </div>

      {/* Green Initiatives */}
      {initiatives?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Green Initiatives</h2>
          <ul className="list-disc list-inside text-gray-700">
            {initiatives.map((init: string) => (
              <li key={init}>
                {init === 'solar' && '☀️ Solar / Renewable Energy'}
                {init === 'rainwater' && '💧 Rainwater Harvesting'}
                {init === 'composting' && '♻️ Waste Composting & Recycling'}
                {init === 'ev' && '🚗 Electric Vehicle Adoption'}
                {init === 'tree_plantation' && '🌳 Tree Plantation'}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>Verified by Earth Carbon Foundation • NGO Darpan Registered • Section 8 Company</p>
        <p className="mt-2">
          Share your footprint: 
          <a 
            href={`https://registryearthcarbon.org/report/${report.registryId}`}
            className="text-purple-700 font-medium underline"
          >
            {footprint_tco2e} tCO₂e {year}
          </a>
        </p>
      </div>

      {/* Social Share Buttons (Optional) */}
      <div className="mt-8 flex justify-center gap-4">
        <a 
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://registryearthcarbon.org/report/${report.registryId}`)}`}
          target="_blank"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Share on LinkedIn
        </a>
        <a 
          href={`https://wa.me/?text=Our%20verified%20footprint%3A%20${footprint_tco2e}%20tCO2e%20${year}%20-%20https://registryearthcarbon.org/report/${report.registryId}`}
          target="_blank"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Share on WhatsApp
        </a>
      </div>
    </div>
  );
}
