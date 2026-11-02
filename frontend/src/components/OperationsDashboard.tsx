import React, { useState } from 'react';
import {
  Train,
  Clock,
  CheckCircle,
  Play,
  Activity,
  Plus
} from 'lucide-react';
import type { Platform, PlatformRequest, Language } from '../types/railway';
import { railwayService } from '../services/railwayService';

interface OperationsDashboardProps {
  language: Language;
}

export const OperationsDashboard: React.FC<OperationsDashboardProps> = ({ language }) => {
  const [platforms, setPlatforms] = useState<Platform[]>(railwayService.getPlatforms());
  const [requests, setRequests] = useState<PlatformRequest[]>(railwayService.getPlatformRequests());
  const [history, setHistory] = useState<string[]>(railwayService.getPlatformHistory());
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New Request Form modal/state
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [newTrainId, setNewTrainId] = useState<string>('P707');
  const [newTrainName, setNewTrainName] = useState<string>('Southern Superfast');
  const [newType, setNewType] = useState<'EMERGENCY' | 'CONNECTION' | 'NORMAL'>('NORMAL');
  const [newArrival, setNewArrival] = useState<string>('09:15');
  const [newDeparture, setNewDeparture] = useState<string>('09:45');
  const [newLength, setNewLength] = useState<number>(280);

  const refreshData = () => {
    setPlatforms(railwayService.getPlatforms());
    setRequests(railwayService.getPlatformRequests());
    setHistory(railwayService.getPlatformHistory());
  };

  const handleProcessNext = () => {
    const res = railwayService.processPlatformRequest();
    setStatusMessage(res.message);
    refreshData();
    setTimeout(() => setStatusMessage(null), 6000);
  };

  const handleRelease = (platformId: number) => {
    railwayService.releasePlatform(platformId);
    setStatusMessage(`Platform ${platformId} released.`);
    refreshData();
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleDelay = (trainId: string) => {
    const ok = railwayService.delayTrainPlatform(trainId, 15);
    if (ok) {
      setStatusMessage(`Train ${trainId} delayed by 15 mins. Buffer clearance updated.`);
    } else {
      setStatusMessage(`Could not delay train ${trainId}.`);
    }
    refreshData();
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    railwayService.addPlatformRequest({
      trainId: newTrainId,
      trainName: newTrainName,
      type: newType,
      arrivalTime: newArrival,
      departureTime: newDeparture,
      lengthMeters: newLength
    });
    setIsAddOpen(false);
    refreshData();
    setStatusMessage(`Added request for ${newTrainId} [${newType}].`);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 gap-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase bg-railway-100 text-railway-800 border border-railway-200">
              STATION CONTROLLER CONSOLE
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 font-display mt-1">
            {language === 'ta' ? 'ஸ்மார்ட் நடைமேடை ஒதுக்கீடு & இயக்கங்கள்' : 'Smart Platform Allocation & Operations'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'ta'
              ? 'ரயில் அட்டவணை, நடைமேடை கொள்ளளவு, நேர-மோதல் தவிர்ப்பு மற்றும் முன்னுரிமை ஒதுக்கீடு.'
              : 'Real-time platform dispatch with length matching, 5-minute clearance buffer, and emergency priority override.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white border border-slate-300 hover:bg-slate-50 text-navy-900 shadow-sm flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4 text-railway-600" />
            <span>Add Arrival Request</span>
          </button>

          <button
            type="button"
            onClick={handleProcessNext}
            className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-railway-600 hover:bg-railway-700 text-white shadow-md shadow-railway-600/30 flex items-center space-x-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Process Next In Queue</span>
          </button>
        </div>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div className="mt-4 p-4 rounded-xl bg-railway-50 border border-railway-200 text-railway-900 text-xs sm:text-sm font-semibold flex items-center space-x-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-railway-600 flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Grid: 3 Platform Visual Tracks */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
            <Train className="w-4 h-4 text-railway-600" />
            <span>Platform Track Status (Payanam Central Bay)</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Clearance Rule: Departure + 5-min Release Buffer
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {platforms.map((plat) => {
            const isOccupied = plat.occupied;

            return (
              <div
                key={plat.platformId}
                className={`rounded-3xl border-2 p-6 transition-all relative overflow-hidden ${
                  isOccupied
                    ? 'border-amber-400 bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 shadow-md'
                    : 'border-slate-200 bg-white shadow-sm'
                }`}
              >
                {/* Platform Number Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-2xl bg-navy-900 text-white flex items-center justify-center font-black text-base shadow-sm">
                      P{plat.platformId}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-navy-900">
                        Platform {plat.platformId}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Max Train Length: <strong className="text-navy-900">{plat.lengthMeters}m</strong>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      isOccupied
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {isOccupied ? 'OCCUPIED' : 'VACANT'}
                  </span>
                </div>

                {/* Track visual */}
                <div className="my-4 p-3 rounded-2xl bg-slate-100 border border-slate-200 relative">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                    <span>TRACK LINE {plat.platformId}</span>
                    <span>{plat.lengthMeters} METERS</span>
                  </div>

                  <div className="h-6 w-full rounded-lg bg-slate-200 flex items-center px-2 relative overflow-hidden">
                    {/* Railroad ties visual */}
                    <div className="absolute inset-0 flex justify-between px-2 items-center opacity-30 pointer-events-none">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="w-1 h-4 bg-slate-500"></div>
                      ))}
                    </div>

                    {isOccupied ? (
                      <div className="h-4 w-3/4 bg-amber-500 rounded text-[9px] font-bold text-white flex items-center justify-center z-10 shadow">
                        <Train className="w-3 h-3 mr-1" />
                        {plat.currentTrainId}
                      </div>
                    ) : (
                      <div className="text-[10px] font-bold text-emerald-700 z-10 mx-auto">
                        Clear & Ready
                      </div>
                    )}
                  </div>
                </div>

                {/* Train Details if Occupied */}
                {isOccupied ? (
                  <div className="space-y-3 pt-2">
                    <div className="p-3 rounded-xl bg-white border border-amber-200 space-y-1">
                      <p className="text-xs font-bold text-navy-900">
                        {plat.currentTrainName} ({plat.currentTrainId})
                      </p>
                      <div className="flex justify-between text-[11px] text-slate-600">
                        <span>Arrival: <strong>{plat.arrivalTime}</strong></span>
                        <span>Release: <strong className="text-rose-700">{plat.releaseTime}</strong></span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => plat.currentTrainId && handleDelay(plat.currentTrainId)}
                        className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300"
                      >
                        Delay (+15m)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRelease(plat.platformId)}
                        className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300"
                      >
                        Release Early
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 text-center py-4">
                    Platform vacant. Ready to receive next priority train in queue.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Platform Queue Table */}
      <div className="mt-12 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-lg font-bold text-navy-900 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-railway-600" />
              <span>Incoming Platform Queue (Priority Ordered)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Emergency (Rank 1) takes highest precedence over Connection (Rank 2) & Normal (Rank 3).
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
            {requests.filter((r) => r.status === 'PENDING').length} Pending Requests
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Priority Rank</th>
                <th className="py-3 px-4">Train ID & Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Arrival / Departure</th>
                <th className="py-3 px-4">Length</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        req.priorityRank === 1
                          ? 'bg-rose-100 text-rose-800'
                          : req.priorityRank === 2
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      RANK {req.priorityRank}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-navy-900">
                    {req.trainId} - {req.trainName}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">
                    {req.type}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono">
                    {req.arrivalTime} ➔ {req.departureTime}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {req.lengthMeters}m
                  </td>
                  <td className="py-3 px-4 font-bold">
                    {req.status === 'ALLOCATED' ? (
                      <span className="text-emerald-700">
                        Allocated (P{req.allocatedPlatformId})
                      </span>
                    ) : (
                      <span className="text-amber-700">Pending in Queue</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Allocation Activity Log */}
      <div className="mt-8 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Real-time Operations Activity Log</span>
        </h3>
        <div className="font-mono text-xs text-slate-300 space-y-1.5 max-h-48 overflow-y-auto">
          {history.map((line, i) => (
            <p key={i} className="hover:text-white transition-colors">
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Add Request Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-scale-in">
            <h3 className="text-lg font-bold text-navy-900">
              Queue New Train Platform Request
            </h3>
            
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Train ID</label>
                <input
                  type="text"
                  required
                  value={newTrainId}
                  onChange={(e) => setNewTrainId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Train Name</label>
                <input
                  type="text"
                  required
                  value={newTrainName}
                  onChange={(e) => setNewTrainName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Request Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                >
                  <option value="EMERGENCY">Emergency Arrival (Priority Rank 1)</option>
                  <option value="CONNECTION">Connection Arrival (Priority Rank 2)</option>
                  <option value="NORMAL">Normal Scheduled Arrival (Priority Rank 3)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Arrival Time</label>
                  <input
                    type="time"
                    required
                    value={newArrival}
                    onChange={(e) => setNewArrival(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Departure Time</label>
                  <input
                    type="time"
                    required
                    value={newDeparture}
                    onChange={(e) => setNewDeparture(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Train Length (Meters)</label>
                <input
                  type="number"
                  min="150"
                  max="400"
                  required
                  value={newLength}
                  onChange={(e) => setNewLength(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-railway-600 hover:bg-railway-700 text-white shadow-md"
                >
                  Queue Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
