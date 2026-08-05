import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
  ResponsiveContainer,
} from "recharts";
import { usePlants } from "../context/PlantsContext";
import { getPlantStatus, STATUS_COLORS } from "../utils/plantStatus";

const CATEGORY_COLORS = {
  Succulent: "#16a34a",
  Fern: "#0d9488",
  Flowering: "#db2777",
  Foliage: "#65a30d",
  Herb: "#ca8a04",
  Other: "#64748b",
};

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${accent || "text-gray-900"}`}>{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const { plants, loading } = usePlants();
  // Local, page-only UI state — this doesn't need to be global/shared,
  // since no other page cares what this dropdown is set to.
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = useMemo(
    () => ["All", ...new Set(plants.map((p) => p.category).filter(Boolean))],
    [plants]
  );

  const filteredPlants = useMemo(
    () => categoryFilter === "All" ? plants : plants.filter((p) => p.category === categoryFilter),
    [plants, categoryFilter]
  );

  // ---- Aggregations, all derived client-side from data already in context ----

  const statusCounts = useMemo(() => {
    const counts = { Overdue: 0, "Due soon": 0, Fine: 0 };
    filteredPlants.forEach((p) => {
      const status = getPlantStatus(p.lastWateredDate, p.wateringFrequencyDays);
      counts[status]++;
    });
    return counts;
  }, [filteredPlants]);

  const categoryBreakdown = useMemo(() => {
    const counts = {};
    filteredPlants.forEach((p) => {
      const cat = p.category || "Other";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredPlants]);

  const statusBarData = useMemo(
    () => Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
    [statusCounts]
  );

  const acquiredOverTime = useMemo(() => {
    const counts = {};
    filteredPlants.forEach((p) => {
      if (!p.dateAcquired) return;
      const month = p.dateAcquired.slice(0, 7); // "YYYY-MM"
      counts[month] = (counts[month] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }));
  }, [filteredPlants]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 md:px-10 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between mb-2 flex-wrap gap-3">
          <h1 className="text-3xl font-bold text-gray-900">📊 Dashboard</h1>
          <Link
            to="/"
            className="border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
          >
            ← Back to plants
          </Link>
        </div>
        <p className="text-gray-500 mb-6">
          A quick overview of your plant collection.
        </p>

        {/* Interactive filter — updates every chart and stat below */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500 sm:w-56"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {filteredPlants.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No plants match this filter yet.
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard label="Total plants" value={filteredPlants.length} />
              <StatCard label="Overdue" value={statusCounts.Overdue} accent="text-red-600" />
              <StatCard label="Due soon" value={statusCounts["Due soon"]} accent="text-yellow-600" />
              <StatCard label="Fine" value={statusCounts.Fine} accent="text-green-600" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Pie chart — category breakdown */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h2 className="font-semibold text-gray-900 mb-4">Plants by category</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={2}
                    >
                      {categoryBreakdown.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={CATEGORY_COLORS[entry.name] || "#94a3b8"}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar chart — watering status counts */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h2 className="font-semibold text-gray-900 mb-4">Watering status</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={statusBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {statusBarData.map((entry) => (
                        <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Line chart — plants acquired over time */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 lg:col-span-2">
                <h2 className="font-semibold text-gray-900 mb-4">Plants acquired over time</h2>
                {acquiredOverTime.length === 0 ? (
                  <p className="text-sm text-gray-400 py-10 text-center">
                    Not enough date data yet to chart a trend.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={acquiredOverTime}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}