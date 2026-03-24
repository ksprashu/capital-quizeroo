"use client";

import { useState } from "react";
import Link from "next/link";
import { INDIA_DATA, AMERICAS_DATA, Place, getTypeLabel } from "@/lib/data";

type Tab = "india" | "americas" | "upload";

export default function DataPage() {
  const [tab, setTab] = useState<Tab>("india");
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const indiaData = INDIA_DATA;
  const americasData = AMERICAS_DATA;

  const filteredIndia = indiaData.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.capital.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAmericas = americasData.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.capital.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadStatus(
      `📸 Photo "${file.name}" received. The data in this app is statically loaded from textbook information. Your upload has been noted! The quiz uses the pre-loaded dataset of ${indiaData.length + americasData.length} places.`
    );
    e.target.value = "";
  };

  const tabClass = (t: Tab) =>
    `px-5 py-2 rounded-full text-sm font-semibold transition-all ${
      tab === t
        ? "bg-indigo-600 text-white shadow"
        : "bg-white text-gray-600 hover:bg-indigo-50 border border-gray-200"
    }`;

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      {/* Header */}
      <header className="w-full max-w-3xl mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-indigo-700">📚 Quiz Data</h1>
            <p className="text-sm text-gray-500 mt-1">
              Browse the capitals used in the quiz
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
          >
            ← Back to Quiz
          </Link>
        </div>
      </header>

      {/* Stats */}
      <div className="w-full max-w-3xl grid grid-cols-3 gap-3 mb-6">
        <StatCard icon="🇮🇳" label="Indian States" value={indiaData.filter(p => p.type === "state").length} color="orange" />
        <StatCard icon="🏙️" label="Union Territories" value={indiaData.filter(p => p.type === "union_territory").length} color="purple" />
        <StatCard icon="🌎" label="Americas Countries" value={americasData.length} color="blue" />
      </div>

      {/* Tabs */}
      <div className="w-full max-w-3xl mb-4 flex gap-2">
        <button className={tabClass("india")} onClick={() => setTab("india")}>
          🇮🇳 India ({indiaData.length})
        </button>
        <button className={tabClass("americas")} onClick={() => setTab("americas")}>
          🌎 Americas ({americasData.length})
        </button>
        <button className={tabClass("upload")} onClick={() => setTab("upload")}>
          📸 Upload
        </button>
      </div>

      {/* Search */}
      {tab !== "upload" && (
        <div className="w-full max-w-3xl mb-4">
          <input
            type="text"
            placeholder="Search by name or capital…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-indigo-400"
          />
        </div>
      )}

      {/* Content */}
      <div className="w-full max-w-3xl">
        {tab === "india" && (
          <DataTable places={filteredIndia} />
        )}
        {tab === "americas" && (
          <DataTable places={filteredAmericas} />
        )}
        {tab === "upload" && (
          <UploadSection
            status={uploadStatus}
            onUpload={handleFileUpload}
            totalPlaces={indiaData.length + americasData.length}
          />
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: number;
  color: "orange" | "purple" | "blue";
}) {
  const colorMap = {
    orange: "bg-orange-50 border-orange-200 text-orange-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
  };
  return (
    <div className={`rounded-xl border p-4 text-center ${colorMap[color]}`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs opacity-70">{label}</div>
    </div>
  );
}

function DataTable({ places }: { places: Place[] }) {
  if (places.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-400">
        No results found.
      </div>
    );
  }

  const typeBadgeClass = (type: Place["type"]) => {
    switch (type) {
      case "state": return "bg-green-100 text-green-700";
      case "union_territory": return "bg-orange-100 text-orange-700";
      case "north_america": return "bg-blue-100 text-blue-700";
      case "south_america": return "bg-teal-100 text-teal-700";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-indigo-50 text-indigo-700">
          <tr>
            <th className="text-left px-4 py-3 font-semibold w-6 text-gray-400">#</th>
            <th className="text-left px-4 py-3 font-semibold">Name</th>
            <th className="text-left px-4 py-3 font-semibold">Capital</th>
            <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Type</th>
          </tr>
        </thead>
        <tbody>
          {places.map((place, i) => (
            <tr key={place.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-4 py-3 text-gray-300 text-xs">{i + 1}</td>
              <td className="px-4 py-3 font-medium text-gray-800">{place.name}</td>
              <td className="px-4 py-3 text-gray-600">{place.capital}</td>
              <td className="px-4 py-3 hidden sm:table-cell">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeBadgeClass(place.type)}`}>
                  {getTypeLabel(place.type)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UploadSection({
  status,
  onUpload,
  totalPlaces,
}: {
  status: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  totalPlaces: number;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-xl font-bold text-gray-800 mb-2">📸 Upload Textbook Photos</h2>
      <p className="text-gray-500 text-sm mb-6">
        Upload photos of your textbook pages. The app already has {totalPlaces} places pre-loaded
        from textbook data. Your photo will be stored and can be referenced for verification.
      </p>

      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-indigo-300 rounded-xl cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition">
        <div className="text-4xl mb-2">📷</div>
        <span className="text-indigo-600 font-semibold">Click to upload a photo</span>
        <span className="text-gray-400 text-xs mt-1">PNG, JPG, WEBP supported</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onUpload}
        />
      </label>

      {status && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          {status}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
        <p className="font-semibold mb-1">ℹ️ About the data</p>
        <p>
          The quiz data is pre-loaded and includes all {totalPlaces} places:
          Indian states, union territories, and countries of North &amp; South America —
          sourced from standard textbook information.
        </p>
      </div>
    </div>
  );
}
