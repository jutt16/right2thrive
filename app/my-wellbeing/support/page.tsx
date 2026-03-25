import { redirect } from "next/navigation";

export default function SupportPage() {
  // Hide `/wellbeing-hub/*` from user navigation while reusing the
  // existing support implementation.
  redirect("/wellbeing-hub/support");
}

