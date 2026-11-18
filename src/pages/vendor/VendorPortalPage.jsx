import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Store, UploadCloud, Database, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';

export const VendorPortalPage = () => {
  const { profile } = useAuth();
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [datasetName, setDatasetName] = useState('');
  const [recordCount, setRecordCount] = useState('');
  const [format, setFormat] = useState('CSV');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    setLoading(true);
    try {
      const res = await api.getDatasets();
      if (res && res.datasets) {
        setDatasets(res.datasets);
      }
    } catch (e) {
      console.warn('Dataset loading fallback:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!datasetName) return;
    setUploading(true);
    try {
      await api.uploadDataset({
        name: datasetName,
        recordsCount: parseInt(recordCount) || 1000,
        format
      });
      setIsModalOpen(false);
      setDatasetName('');
      setRecordCount('');
      await loadDatasets();
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const totalRecords = datasets.reduce((sum, d) => sum + (d.recordsCount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/20 p-6 md:p-8 border border-amber-500/20 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20 mb-2">
            <Store className="h-3.5 w-3.5" />
            <span>Vendor Data & Model Provider Hub</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {profile?.business_name || 'Apex Data Solutions'} Console
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl">
            Upload certified customer churn datasets, license calibrated model weights, and track ingestion into the AdaptFlow continuous retraining loop.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="lg"
          className="bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-600/30"
        >
          <UploadCloud className="h-4 w-4 mr-2" />
          <span>Upload New Dataset</span>
        </Button>
      </div>

      {/* Vendor Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card glass className="p-4 border-slate-800">
          <span className="text-xs text-slate-400">Published Datasets</span>
          <div className="mt-2 text-2xl font-bold text-white">{datasets.length} Datasets</div>
          <span className="text-[11px] text-emerald-400">{totalRecords.toLocaleString()} records total</span>
        </Card>
        <Card glass className="p-4 border-slate-800">
          <span className="text-xs text-slate-400">Admitted to Retraining</span>
          <div className="mt-2 text-2xl font-bold text-amber-400">100% Verified</div>
          <span className="text-[11px] text-slate-400">DVC Cryptographic Seal</span>
        </Card>
        <Card glass className="p-4 border-slate-800">
          <span className="text-xs text-slate-400">Partner Tier</span>
          <div className="mt-2 text-2xl font-bold text-blue-400">Gold Certified</div>
          <span className="text-[11px] text-slate-400">SLA 99.9% Delivery</span>
        </Card>
        <Card glass className="p-4 border-slate-800">
          <span className="text-xs text-slate-400">Data Contract Status</span>
          <div className="mt-2 text-2xl font-bold text-emerald-400">Active</div>
          <span className="text-[11px] text-emerald-400/80">Schema Validation Passed</span>
        </Card>
      </div>

      {/* Dataset Catalog */}
      <Card glass className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Registered Dataset Catalog</h3>
            <p className="text-xs text-slate-400">Datasets licensed to production and staging model retraining pipelines</p>
          </div>
          <Button onClick={loadDatasets} variant="secondary" size="sm" loading={loading}>
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="divide-y divide-slate-800">
          {/* Pandera Schema Verification Badge */}
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-slate-200 font-semibold">Pandera Automated Schema Gate:</span>
              <span className="text-slate-400">Strict checks on 19 Telco columns (types, ranges, nullability).</span>
            </div>
            <span className="font-mono text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Zero Tolerance Gate
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">
              <RefreshCw className="h-4 w-4 animate-spin text-amber-400 mx-auto mb-2" />
              <span>Loading dataset catalog...</span>
            </div>
          ) : datasets.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              <Database className="h-8 w-8 text-slate-600 mx-auto mb-2" />
              <span>No datasets uploaded yet. Click "Upload New Dataset" above.</span>
            </div>
          ) : (
            datasets.map((d) => (
              <div key={d.id} className="py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{d.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {(d.recordsCount || 0).toLocaleString()} samples • {d.dvcHash ? `DVC ${d.dvcHash.substring(0, 16)}...` : (d.format || 'CSV')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge variant={d.dvcHash ? 'success' : 'warning'} size="sm">
                    {d.dvcHash ? 'DVC Verified' : 'In Review'}
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">{d.version || 'v1.0.0'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Upload Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload Certified Dataset"
        subtitle="Submit a customer churn dataset partition for pipeline ingestion"
      >
        <form onSubmit={handleUpload} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Dataset Name</label>
            <Input
              value={datasetName}
              onChange={(e) => setDatasetName(e.target.value)}
              placeholder="e.g. Q4 Fiber Optic Ground Truth"
              required
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Estimated Sample Count</label>
            <Input
              type="number"
              value={recordCount}
              onChange={(e) => setRecordCount(e.target.value)}
              placeholder="e.g. 5000"
              required
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">File Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
            >
              <option value="CSV">CSV with Ground Truth Labels</option>
              <option value="Parquet">Apache Parquet</option>
              <option value="JSONL">JSON Lines</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={() => setIsModalOpen(false)} variant="ghost" size="md">Cancel</Button>
            <Button type="submit" loading={uploading} variant="primary" size="md">
              Upload & Seal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VendorPortalPage;
