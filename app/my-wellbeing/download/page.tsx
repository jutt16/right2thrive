'use client';

import { useEffect, useState } from 'react';
import { FileDown } from 'lucide-react';

export default function Download() {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/weekly-goals`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setGoals(data.data);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">My Weekly Goals</h2>

      {goals.length === 0 ? (
        <p className="text-center text-gray-500">No weekly goals uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="bg-white rounded-2xl shadow-lg p-5 flex flex-col justify-between transition hover:shadow-xl"
            >
              <div>
                <p className="text-sm text-gray-500 mb-1">Uploaded on</p>
                <p className="text-md font-semibold text-gray-800">{goal.created_at}</p>
              </div>

              <a
                href={goal.url}
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
