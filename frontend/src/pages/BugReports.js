import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { Bug, CheckCircle, Clock, Warning, ArrowsClockwise, Star, X } from '@phosphor-icons/react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const PRIORITY_COLORS = {
  critical: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', dot: 'bg-red-500' },
  high: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', dot: 'bg-orange-500' },
  medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-500' },
  low: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', dot: 'bg-blue-500' },
};

const STATUS_ICONS = {
  open: { icon: Warning, color: 'text-amber-400' },
  in_progress: { icon: ArrowsClockwise, color: 'text-cyan-400' },
  resolved: { icon: CheckCircle, color: 'text-emerald-400' },
};

const BugReports = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [analysisModal, setAnalysisModal] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isApplyingFix, setIsApplyingFix] = useState(false);
  const [submitModal, setSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    priority: 'medium',
    page: '',
    browser: ''
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/bug-reports`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(res.data);
    } catch (error) {
      console.error('Bug reports fetch error:', error.response?.data || error.message);
      toast.error(error.response?.data?.detail || 'Failed to load bug reports');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/bug-reports/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Status updated');
      fetchReports();
    } catch {
      toast.error('Failed to update');
    }
  };

  const analyzeWithAI = async (reportId) => {
    setIsAnalyzing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_URL}/api/bug-reports/${reportId}/analyze`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnalysisModal({
        reportId,
        analysisId: res.data.analysis_id,
        explanation: res.data.explanation,
      });
      toast.success('Bug analyzed by Gemini AI');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applyFix = async () => {
    if (!analysisModal) return;

    setIsApplyingFix(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_URL}/api/bug-reports/${analysisModal.reportId}/fix`,
        { analysis_id: analysisModal.analysisId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Fix applied! Bug status moved to "In Progress"');
      setAnalysisModal(null);
      fetchReports();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to apply fix');
    } finally {
      setIsApplyingFix(false);
    }
  };

  const cancelAnalysis = () => {
    setAnalysisModal(null);
  };

  const submitBugReport = async (e) => {
    e.preventDefault();
    if (!formData.description.trim()) {
      toast.error('Please describe the bug');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/bug-reports`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Bug report submitted successfully!');
      setSubmitModal(false);
      setFormData({ description: '', priority: 'medium', page: '', browser: '' });
      fetchReports();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit bug report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = reports.filter(r => {
    if (filterPriority !== 'all' && r.priority !== filterPriority) return false;
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    return true;
  });

  const counts = {
    total: reports.length,
    open: reports.filter(r => r.status === 'open').length,
    in_progress: reports.filter(r => r.status === 'in_progress').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    critical: reports.filter(r => r.priority === 'critical' && r.status !== 'resolved').length,
  };

  return (
    <Layout user={user}>
      <div className="p-4 sm:p-6 lg:p-8" data-testid="bug-reports-page">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-50" data-testid="bug-reports-title">
              Bug Reports
            </h1>
            <p className="mt-2 text-base text-zinc-400">All submitted bug reports from your team</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setSubmitModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="submit-bug-btn"
            >
              <Bug size={18} className="mr-2" />
              Report Bug
            </Button>
            <Button onClick={fetchReports} className="bg-zinc-800 text-zinc-50 hover:bg-zinc-700" data-testid="refresh-reports">
              <ArrowsClockwise size={18} />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          <Card className="stat-card p-4">
            <p className="text-xs uppercase font-bold text-zinc-500">Total</p>
            <p className="text-2xl font-black text-zinc-100">{counts.total}</p>
          </Card>
          <Card className="stat-card p-4">
            <p className="text-xs uppercase font-bold text-amber-500">Open</p>
            <p className="text-2xl font-black text-amber-400">{counts.open}</p>
          </Card>
          <Card className="stat-card p-4">
            <p className="text-xs uppercase font-bold text-cyan-500">In Progress</p>
            <p className="text-2xl font-black text-cyan-400">{counts.in_progress}</p>
          </Card>
          <Card className="stat-card p-4">
            <p className="text-xs uppercase font-bold text-emerald-500">Resolved</p>
            <p className="text-2xl font-black text-emerald-400">{counts.resolved}</p>
          </Card>
          <Card className="stat-card p-4">
            <p className="text-xs uppercase font-bold text-red-500">Critical</p>
            <p className="text-2xl font-black text-red-400">{counts.critical}</p>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-4">
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-40 bg-zinc-900 border-zinc-800 text-zinc-50" data-testid="filter-priority">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 bg-zinc-900 border-zinc-800 text-zinc-50" data-testid="filter-status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reports List */}
        {loading ? (
          <div className="text-center py-12 text-zinc-400">Loading reports...</div>
        ) : filtered.length === 0 ? (
          <Card className="stat-card p-12 text-center">
            <Bug size={48} className="mx-auto text-zinc-600 mb-3" />
            <p className="text-zinc-400">No bug reports found</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map(report => {
              const pc = PRIORITY_COLORS[report.priority] || PRIORITY_COLORS.medium;
              const StatusIcon = STATUS_ICONS[report.status]?.icon || Clock;
              const statusColor = STATUS_ICONS[report.status]?.color || 'text-zinc-400';

              return (
                <Card
                  key={report.id}
                  className={`stat-card p-5 border-l-4 ${pc.border}`}
                  data-testid={`bug-report-${report.id}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${pc.bg} ${pc.text}`}>
                          {report.priority.toUpperCase()}
                        </span>
                        <StatusIcon size={16} className={statusColor} />
                        <span className={`text-xs font-semibold ${statusColor}`}>
                          {report.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-xs text-zinc-600">
                          {new Date(report.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-200 mb-2 whitespace-pre-wrap">{report.description}</p>
                      <div className="flex items-center gap-4 text-xs text-zinc-500 mb-3">
                        <span>By: <strong className="text-zinc-300">{report.reported_by_name}</strong> ({report.reported_by_email})</span>
                        <span>Page: {report.page || 'N/A'}</span>
                        {report.wa_sent && (
                          <span className="text-emerald-500">WA Sent</span>
                        )}
                      </div>
                      {report.status === 'open' && user?.role === 'admin' && (
                        <Button
                          onClick={() => analyzeWithAI(report.id)}
                          disabled={isAnalyzing}
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-8"
                        >
                          <Star size={14} className="mr-1" />
                          {isAnalyzing ? 'Analyzing...' : 'Fix with AI'}
                        </Button>
                      )}
                    </div>
                    {user?.role === 'admin' && (
                      <Select value={report.status} onValueChange={(v) => updateStatus(report.id, v)}>
                        <SelectTrigger className="w-36 bg-zinc-950 border-zinc-800 text-zinc-50 text-xs" data-testid={`status-select-${report.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Analysis Modal */}
        {analysisModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800 max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Star size={24} className="text-purple-400" />
                    <h2 className="text-2xl font-bold text-zinc-50">AI Analysis</h2>
                  </div>
                  <button onClick={cancelAnalysis} className="text-zinc-400 hover:text-zinc-50">
                    <X size={24} />
                  </button>
                </div>

                <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4 mb-6">
                  <p className="text-zinc-100 whitespace-pre-wrap text-sm leading-relaxed">
                    {analysisModal.explanation}
                  </p>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    onClick={cancelAnalysis}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={applyFix}
                    disabled={isApplyingFix}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isApplyingFix ? 'Applying Fix...' : 'Confirm & Apply Fix'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Submit Bug Report Modal */}
        {submitModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Bug size={24} className="text-blue-400" />
                    <h2 className="text-2xl font-bold text-zinc-50">Report a Bug</h2>
                  </div>
                  <button onClick={() => setSubmitModal(false)} className="text-zinc-400 hover:text-zinc-50">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={submitBugReport} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Bug Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe what's wrong..."
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded text-zinc-50 placeholder-zinc-600 focus:outline-none focus:border-blue-500 min-h-[100px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded text-zinc-50 focus:outline-none focus:border-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Page/Area
                      </label>
                      <input
                        type="text"
                        value={formData.page}
                        onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                        placeholder="e.g., Dashboard, Leads"
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded text-zinc-50 placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Browser (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.browser}
                      onChange={(e) => setFormData({ ...formData, browser: e.target.value })}
                      placeholder="e.g., Chrome, Firefox"
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded text-zinc-50 placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-4">
                    <Button
                      type="button"
                      onClick={() => setSubmitModal(false)}
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Bug Report'}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BugReports;
