"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
interface Complaint {
  id: number;
  subject: string;
  description: string;
  status: string;
  created_at: string;
}

export default function ComplaintsPage() {
  const [form, setForm] = useState({ subject: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  /** Load all complaints belonging to the authenticated user */
  const fetchComplaints = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/complaints`,
        {
          headers: {
            "Content-Type": "application/json",
            // include token if required
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to load complaints");
      const data = await res.json();
      setComplaints(data.data ?? data); // handle if paginated
    } catch (err: any) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  /** handle form field change */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  /** Submit new complaint */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/complaints`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to submit");
      setSuccess(true);
      setForm({ subject: "", description: "" });
      fetchComplaints();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
        Submit a Complaint
      </h1>

      {/* ===== Complaint Form ===== */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-xl shadow-md"
      >
        <FormField
          label="Subject"
          name="subject"
          type="text"
          value={form.subject}
          onChange={handleChange}
        />
        <FormField
          label="Description"
          name="description"
          type="textarea"
          value={form.description}
          onChange={handleChange}
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && (
          <p className="text-green-600 text-sm">
            Complaint submitted successfully.
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className={`bg-green-600 text-white hover:bg-green-700 w-full ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit Complaint"}
        </Button>
      </form>

      {/* ===== Existing Complaints ===== */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">My Complaints</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchComplaints}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
        {complaints.length === 0 ? (
          <p className="text-gray-600">No complaints yet.</p>
        ) : (
          <ul className="space-y-4">
            {complaints.map((c) => (
              <li
                key={c.id}
                className="border rounded-lg p-4 shadow-sm bg-gray-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold">{c.subject}</h3>
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      c.status === "resolved"
                        ? "bg-green-100 text-green-700"
                        : c.status === "in_progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <ComplaintDescription description={c.description} />
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(c.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ComplaintDescription({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const maxChars = 150; // adjust how many chars to show before "Show more"

  const isLong = description.length > maxChars;
  const visibleText = expanded ? description : description.slice(0, maxChars);

  return (
    <div className="text-gray-700 break-words whitespace-pre-wrap">
      {visibleText}
      {isLong && (
        <>
          {!expanded && "... "}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-green-600 font-medium hover:underline ml-1"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        </>
      )}
    </div>
  );
}

/* --------- Reusable Input Component --------- */
function FormField({
  label,
  name,
  type,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          name={name}
          rows={5}
          value={value}
          onChange={onChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      )}
    </div>
  );
}
