"use client";

import React from 'react';

export default function AnalyticsPage() {
  return (
    <section className="flex flex-col items-center justify-center py-20">
      <div className="max-w-xl w-full text-center bg-white border border-gray-100 shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-2">Analytics (Placeholder)</h2>
        <p className="text-sm text-gray-600 mb-4">Analytics has been disabled. This page is a placeholder.</p>
        <div className="text-xs text-gray-500">If you need this restored, contact the team or re-enable the analytics integration.</div>
      </div>
    </section>
  );
}
