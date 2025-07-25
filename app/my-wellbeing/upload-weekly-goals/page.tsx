"use client";

import { useEffect, useState } from "react";
import {
  UploadCloud,
  User2,
  Mail,
  Globe,
  VenetianMask,
  Phone,
  Smartphone,
  MapPin,
  Landmark,
  GraduationCap,
  Briefcase,
} from "lucide-react";

interface Therapist {
  id: number;
  name?: string | null;
  first_name?: string;
  last_name?: string;
  email?: string;
  gender?: string;
  cultural_background?: string;
  telephone?: string;
  mobile?: string;
  address?: string;
  country?: string;
  qualifications?: string;
  experience?: string;
}

export default function UploadWeeklyGoals() {
  const [selectedTherapist, setSelectedTherapist] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [isLoadingTherapists, setIsLoadingTherapists] = useState(false);
  const [error, setError] = useState("");

  const selectedTherapistObj = therapists.find(
    (t) => t.id.toString() === selectedTherapist
  );

  useEffect(() => {
    const fetchTherapists = async () => {
      setIsLoadingTherapists(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/therapists`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch therapists");
        }

        if (data.success && Array.isArray(data.data?.therapists)) {
          setTherapists(data.data.therapists);
        } else {
          throw new Error("No therapists available");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load therapists"
        );
        setTherapists([]);
      } finally {
        setIsLoadingTherapists(false);
      }
    };

    fetchTherapists();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedTherapist || !file) {
      alert("Please select a therapist and upload a file.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to upload.");
        return;
      }

      const formData = new FormData();
      formData.append("therapist_id", selectedTherapist);
      formData.append("file", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/weekly-goals`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to upload weekly goal.");
      }

      alert("Weekly goal uploaded successfully!");
      setFile(null);
      setSelectedTherapist("");
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during upload."
      );
    }
  };

  const getTherapistDisplayName = (t: Therapist) => {
    if (t.name && t.name.trim() !== "") return t.name;
    return `${t.first_name || ""} ${t.last_name || ""}`.trim();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl border border-yellow-400 p-6">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-2">
          Upload My Weekly Goals
        </h2>

        <p className="text-sm text-center text-gray-500 mb-5">
          Select your therapist and upload your goal document.
        </p>

        {/* Therapist Dropdown */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">
            Select Therapist
          </label>
          <select
            className="w-full border border-blue-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={selectedTherapist}
            onChange={(e) => setSelectedTherapist(e.target.value)}
          >
            <option value="">-- Select --</option>

            {isLoadingTherapists && <option>Loading...</option>}

            {!isLoadingTherapists &&
              therapists.map((t) => (
                <option key={t.id} value={t.id}>
                  {getTherapistDisplayName(t)} - {t.cultural_background ?? "N/A"}
                </option>
              ))}

            {!isLoadingTherapists && therapists.length === 0 && (
              <option disabled>No therapists found</option>
            )}
          </select>

          {error && <p className="mt-2 text-sm text-red-600">Error: {error}</p>}
        </div>

        {/* Therapist Details */}
        {selectedTherapistObj && (
          <div className="mb-4 p-4 border border-blue-200 rounded-lg bg-blue-50 text-sm text-gray-700 space-y-1">
            <div className="flex items-center gap-2">
              <User2 className="w-4 h-4 text-blue-600" />
              <span>
                <strong>Name:</strong> {getTherapistDisplayName(selectedTherapistObj)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>
                <strong>Email:</strong> {selectedTherapistObj.email ?? "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <VenetianMask className="w-4 h-4 text-blue-600" />
              <span>
                <strong>Gender:</strong> {selectedTherapistObj.gender ?? "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>
                <strong>Culture:</strong> {selectedTherapistObj.cultural_background ?? "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>
                <strong>Telephone:</strong> {selectedTherapistObj.telephone ?? "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>
                <strong>Mobile:</strong> {selectedTherapistObj.mobile ?? "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>
                <strong>Address:</strong> {selectedTherapistObj.address ?? "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-blue-600" />
              <span>
                <strong>Country:</strong> {selectedTherapistObj.country ?? "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>
                <strong>Qualifications:</strong> {selectedTherapistObj.qualifications ?? "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>
                <strong>Experience:</strong> {selectedTherapistObj.experience ?? "N/A"}
              </span>
            </div>
          </div>
        )}

        {/* File Upload */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1">
            Upload File
          </label>
          <input
            type="file"
            accept=".doc,.docx,.pdf,.txt"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded flex justify-center items-center space-x-2 transition"
        >
          <UploadCloud className="h-5 w-5" />
          <span>Upload</span>
        </button>

        {/* File format note */}
        <p className="text-sm text-center mt-4 text-gray-600">
          Supported formats:{" "}
          <span className="text-blue-700 font-medium">
            .docx, .pdf, .doc, .txt
          </span>
        </p>
      </div>
    </div>
  );
}
