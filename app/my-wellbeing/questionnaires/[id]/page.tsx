import QuestionForm from "./QuestionForm";
async function getQuestionnaire(id: string, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/questionnaires/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store", // always fresh
    }
  );

  if (!res.ok) throw new Error("Failed to fetch questionnaire");
  return res.json();
}

export default async function QuestionnairePage({ params }: { params: any }) {
  // We can’t access localStorage here, so we'll fetch client-side
  // Instead pass id down to client form
  return (
    <div className="max-w-3xl mx-auto p-6">
      <QuestionForm questionnaireId={params.id} />
    </div>
  );
}
