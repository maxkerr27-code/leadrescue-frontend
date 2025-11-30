"use client";

import { useEffect, useState } from "react";

type Job = {
  id: number | string;
  customer_name?: string;
  phone?: string;
  address?: string;
  description?: string;
  created_at?: string;
};

async function fetchJobs(): Promise<Job[]> {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  if (!apiBase || !apiKey) {
    console.error("Missing API base URL or API key in environment variables.");
    return [];
  }

  // 🔥 Debug lines — add these
  console.log("API BASE URL =", apiBase);
  console.log("API KEY =", apiKey);

  try {
    const res = await fetch(`${apiBase}/jobs`, {
      headers: {
        "x-api-key": apiKey,
      },
    });


    if (!res.ok) {
      console.error("Failed to fetch jobs:", res.status, res.statusText);
      return [];
    }

    const data = await res.json();

    // handles either { jobs: [] } or []
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.jobs)) return data.jobs;

    return [];
  } catch (err) {
    console.error("Error fetching jobs:", err);
    return [];
  }
}

export default function LeadsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs().then((result) => {
      setJobs(result);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600 text-lg">Loading leads…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <header className="mb-8 flex items-baseline justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">LeadRescue</h1>
            <p className="text-slate-600 mt-1">
              Missed-call leads from your voicemail — call them back and save the job.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
              Money Waiting to Be Called Back
            </p>
            <p className="text-3xl font-extrabold text-orange-500">
              {jobs.length}
            </p>
          </div>
        </header>

        {/* Leads Table */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Missed Call Leads</h2>
            <span className="text-sm text-slate-500">
              These came from your voicemail while you were busy or after hours.
            </span>
          </div>

          {jobs.length === 0 ? (
            <div className="px-6 py-10 text-center text-slate-500">
              <p className="mb-2 font-medium">No leads waiting right now. 🎉</p>
              <p className="text-sm">
                When a customer leaves a voicemail, it will show up here with all the info
                you need to call them back.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Name
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Address
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Problem
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Received
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => {
                    const created = job.created_at || "";
                    const createdDate = created ? new Date(created) : null;

                    return (
                      <tr
                        key={job.id}
                        className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="px-6 py-4 text-slate-900">
                          {job.customer_name || "Unknown"}
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          {job.phone || "—"}
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          {job.address || "—"}
                        </td>
                        <td className="px-6 py-4 text-slate-700 max-w-xs">
                          <span className="line-clamp-2">
                            {job.description || "No description"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {createdDate ? createdDate.toLocaleString() : "—"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {job.phone ? (
                            <a
                              href={`tel:${job.phone}`}
                              className="inline-flex items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 transition-colors"
                            >
                              Call Back
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400">No phone</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
