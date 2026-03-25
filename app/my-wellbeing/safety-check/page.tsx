import { redirect } from "next/navigation";

export default function SafetyCheckPage() {
  redirect("/wellbeing-hub/risk-assessment");
}

