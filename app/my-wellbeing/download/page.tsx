"use client";

import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import { getApiUrl } from "@/lib/api-client";

interface Plan {
  therapistName: string | null;
  assignedDate: string;
  fileUrl: string;
}

export default function Download() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const userId = user?.id;

    if (!token || !userId) {
      console.error("Missing token or user ID");
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Accept", "application/json");

    fetch(
      getApiUrl(`/api/patients/${userId}/wellbeing-plan`),
      {
        method: "GET",
        headers: myHeaders,
      }
    )
      .then((res) => res.json())
      .then((data: Plan[]) => {
        setPlans(data || []);
      })
      .catch((err) => {
        console.error("Error fetching wellbeing plans:", err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        My Wellbeing Plans
      </h2>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : plans.length === 0 ? (
        <p className="text-center text-gray-500">
          No wellbeing plans uploaded yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-5 flex flex-col justify-between transition hover:shadow-xl"
            >
              <div>
                <p className="text-sm text-gray-500 mb-1">Assigned Date</p>
                <p className="text-md font-semibold text-gray-800">
                  {plan.assignedDate}
                </p>

                {plan.therapistName && (
                  <>
                    <p className="text-sm text-gray-500 mt-3">Therapist</p>
                    <p className="text-md text-gray-700">
                      {plan.therapistName}
                    </p>
                  </>
                )}
              </div>

              <a
                href={plan.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-2 text-blue-600 font-medium hover:underline"
              >
                <FileDown className="w-5 h-5" />
                Download File
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
