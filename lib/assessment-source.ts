/**
 * Assessment source (point 9 – AI-assisted flow).
 * GAD-7, PHQ-9, PCL-5 store source: self | ai | clinician.
 * Patient app always sends "self" when submitting; API returns source in responses.
 */

export type AssessmentSource = "self" | "ai" | "clinician";

/** Value to send when the patient completes an assessment in the app. */
export const PATIENT_ASSESSMENT_SOURCE: AssessmentSource = "self";
