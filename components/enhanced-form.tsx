"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface FormFieldProps {
  id: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea";
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  description?: string;
  rows?: number;
}

interface FormSubmissionState {
  status: "idle" | "loading" | "success" | "error";
  message?: string;
}

interface EnhancedFormProps {
  fields: Omit<FormFieldProps, "value" | "onChange" | "error">[];
  onSubmit: (data: Record<string, string>) => Promise<void>;
  submitButtonText?: string;
  successMessage?: string;
  className?: string;
}

export function FormField({
  id,
  label,
  type = "text",
  required = false,
  placeholder,
  value,
  onChange,
  error,
  description,
  rows = 5,
}: FormFieldProps) {
  const fieldId = `field-${id}`;
  const errorId = `${fieldId}-error`;
  const descriptionId = `${fieldId}-description`;

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId} className="text-sm font-medium">
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </Label>
      
      {type === "textarea" ? (
        <Textarea
          id={fieldId}
          name={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          rows={rows}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={`${descriptionId} ${errorId}`}
          className={`w-full transition-colors ${
            error ? "border-red-500 focus:ring-red-500" : "focus:ring-[#00990d]"
          }`}
        />
      ) : (
        <Input
          id={fieldId}
          name={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={`${descriptionId} ${errorId}`}
          className={`w-full transition-colors ${
            error ? "border-red-500 focus:ring-red-500" : "focus:ring-[#00990d]"
          }`}
        />
      )}
      
      {description && (
        <p id={descriptionId} className="text-sm text-gray-600">
          {description}
        </p>
      )}
      
      {error && (
        <p id={errorId} className="text-sm text-red-600 flex items-center gap-1" role="alert">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
}

export function EnhancedForm({
  fields,
  onSubmit,
  submitButtonText = "Submit",
  successMessage = "Thank you! Your message has been sent successfully.",
  className = "",
}: EnhancedFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissionState, setSubmissionState] = useState<FormSubmissionState>({
    status: "idle",
  });
  const honeypotRef = useRef<HTMLInputElement>(null);

  const validateField = (id: string, value: string): string => {
    const field = fields.find(f => f.id === id);
    if (!field) return "";

    // Required field validation
    if (field.required && !value.trim()) {
      return `${field.label} is required`;
    }

    // Email validation
    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
    }

    // Phone validation
    if (field.type === "tel" && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ""))) {
        return "Please enter a valid phone number";
      }
    }

    // Length validation
    if (value.length > 1000) {
      return `${field.label} is too long (maximum 1000 characters)`;
    }

    return "";
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach(field => {
      const value = formData[field.id] || "";
      const error = validateField(field.id, value);
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check honeypot field
    if (honeypotRef.current?.value) {
      console.log("Spam detected - honeypot field filled");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setSubmissionState({ status: "loading" });
    setErrors({});

    try {
      await onSubmit(formData);
      setSubmissionState({ 
        status: "success", 
        message: successMessage 
      });
      setFormData({});
    } catch (error) {
      setSubmissionState({ 
        status: "error", 
        message: error instanceof Error ? error.message : "Something went wrong. Please try again." 
      });
    }
  };

  const handleFieldChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`} noValidate>
      {/* Honeypot field for spam protection */}
      <input
        ref={honeypotRef}
        type="text"
        name="website"
        style={{ 
          position: "absolute", 
          left: "-9999px", 
          opacity: 0,
          pointerEvents: "none"
        }}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {/* CSRF Token (would be generated server-side) */}
      <input type="hidden" name="_token" value="csrf-token-placeholder" />

      {fields.map((field) => (
        <FormField
          key={field.id}
          {...field}
          value={formData[field.id] || ""}
          onChange={(value) => handleFieldChange(field.id, value)}
          error={errors[field.id]}
        />
      ))}

      {/* Submission Status */}
      {submissionState.status === "success" && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {submissionState.message}
          </AlertDescription>
        </Alert>
      )}

      {submissionState.status === "error" && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {submissionState.message}
          </AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={submissionState.status === "loading"}
        className="w-full bg-[#00990d] text-white hover:bg-[#007a0a] focus:ring-4 focus:ring-[#00990d] focus:ring-opacity-50 min-h-[48px]"
        aria-describedby={submissionState.status === "success" ? "success-message" : submissionState.status === "error" ? "error-message" : undefined}
      >
        {submissionState.status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          submitButtonText
        )}
      </Button>
    </form>
  );
}

export default EnhancedForm;
