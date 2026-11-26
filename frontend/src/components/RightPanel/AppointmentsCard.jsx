import React from 'react';
import { Calendar, Video, Clock, CheckCircle, RefreshCw, UserCheck } from 'lucide-react';

export default function AppointmentsCard({ appointments = [], onRefreshCrm }) {
  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl shadow-slate-950/40">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-200">
              Booked Appointments (CRM Sync)
            </h3>
            <p className="text-[10px] text-slate-400">
              Auto-negotiated Demo Slots from /api/crm
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            {appointments.length} Scheduled
          </span>
          {onRefreshCrm && (
            <button
              onClick={onRefreshCrm}
              title="Refresh bookings from /api/crm"
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Appointment Item Cards */}
      <div className="space-y-2 max-h-[170px] overflow-y-auto pr-0.5">
        {appointments.length === 0 ? (
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-500">
            No meetings booked yet. Say "Book a demo for tomorrow" during the call!
          </div>
        ) : (
          appointments.map((apt, idx) => (
            <div
              key={apt.bookingId || apt.id || idx}
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-white">
                    {apt.title || apt.meetingType || 'Technical Architecture Demo'}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1 text-[11px] text-indigo-300 font-mono">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    <span>{apt.dateTime}</span>
                  </div>
                </div>

                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1 shrink-0">
                  <CheckCircle className="w-3 h-3" />
                  <span>{apt.status || 'Confirmed'}</span>
                </span>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate max-w-[190px]">
                  Lead: {apt.customerName || apt.attendee || 'Alex Chen'}
                </span>
                <div className="flex items-center space-x-1 text-slate-300">
                  <Video className="w-3 h-3 text-cyan-400" />
                  <span>{apt.location || 'Google Meet'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
