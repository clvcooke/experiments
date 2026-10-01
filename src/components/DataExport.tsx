import React from 'react';
import { Download, FileText, Database } from 'lucide-react';
import type { WatchLog, ExperimentSettings } from '../hooks/useExperimentState';

interface DataExportProps {
  logs: WatchLog[];
  settings: ExperimentSettings;
  recallScore: number;
  totalQuestions: number;
}

export const DataExport: React.FC<DataExportProps> = ({
  logs,
  settings,
  recallScore,
  totalQuestions,
}) => {
  const exportJSON = () => {
    const data = {
      experimentSettings: settings,
      summary: {
        recallScore,
        totalQuestions,
        accuracyPercentage: Math.round((recallScore / (totalQuestions || 1)) * 100),
        totalVideosWatched: logs.length,
        timestamp: new Date().toISOString(),
      },
      watchLogs: logs,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event_boundary_trial_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const headers = [
      'Video ID',
      'Video Title',
      'Watch Duration (s)',
      'Boundary Type',
      'Pause Duration (s)',
      'Timestamp',
      'Recall Score',
      'Total Questions'
    ];

    const rows = logs.map((log) => [
      `"${log.videoId}"`,
      `"${log.videoTitle.replace(/"/g, '""')}"`,
      log.watchDurationSeconds,
      `"${log.boundaryType}"`,
      log.pauseDuration,
      `"${log.completedAt}"`,
      recallScore,
      totalQuestions
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event_boundary_trial_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="text-xs font-semibold text-zinc-400 flex items-center gap-1">
        <Database className="w-3.5 h-3.5 text-zinc-400" />
        Download Researcher Data Logs:
      </div>
      <div className="flex gap-2">
        <button
          onClick={exportJSON}
          className="flex-1 py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          Export JSON
        </button>
        <button
          onClick={exportCSV}
          className="flex-1 py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          Export CSV
        </button>
      </div>
    </div>
  );
};
