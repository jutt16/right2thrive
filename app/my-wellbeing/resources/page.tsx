import { redirect } from "next/navigation";

export default function ResourcesPage() {
  // Hide `/wellbeing-hub/*` from user navigation while reusing the
  // existing resources implementation.
  redirect("/wellbeing-hub/resources");
}

