"use client";

import { useState, useEffect } from "react";
import ResumeForm from "@/components/resume-maker/ResumeForm";
import ResumePreview from "@/components/resume-maker/ResumePreview";
import { saveResumeData, loadResumeData } from "@/lib/storage";

// Define the resume data structure
export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    position: string;
    company: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    field: string;
    institution: string;
    startDate: string;
    endDate: string;
    current: boolean;
    gpa: string;
  }>;
  skills: string[];
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string;
    link: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    link: string;
  }>;
}

// Initial resume data
const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
  },
  summary: "",
  experience: [{ id: "1", position: "", company: "", startDate: "", endDate: "", current: false, description: "" }],
  education: [{ id: "1", degree: "", field: "", institution: "", startDate: "", endDate: "", current: false, gpa: "" }],
  skills: [],
  projects: [{ id: "1", name: "", description: "", technologies: "", link: "" }],
  certifications: [{ id: "1", name: "", issuer: "", date: "", link: "" }],
};

export default function ResumeMaker() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [activeTemplate, setActiveTemplate] = useState<"modern" | "classic" | "minimal" | "professional">("modern");
  const [pdfFileName, setPdfFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load saved data on component mount
  useEffect(() => {
    const savedData = loadResumeData();
    if (savedData) {
      setResumeData(savedData);
    }
  }, []);

  const handleResumeDataChange = (data: ResumeData) => {
    setResumeData(data);
    saveResumeData(data);
  };

  const handleGetSuggestion = async (section: string, content: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuggestion(null);

      const response = await fetch("/api/resume-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ section, currentContent: content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get suggestions");
      }

      const data = await response.json();
      setSuggestion(data.suggestion);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error getting suggestion:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = () => {
    setPdfFileName(`${resumeData.personalInfo.fullName || 'resume'}.pdf`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Resume Maker</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <ResumeForm
            resumeData={resumeData}
            onResumeDataChange={handleResumeDataChange}
            onGetSuggestion={handleGetSuggestion}
            isLoading={isLoading}
            suggestion={suggestion}
            error={error}
          />
        </div>
        <div>
          <ResumePreview
            resumeData={resumeData}
            template={activeTemplate}
            onExportPDF={handleExportPDF}
          />
        </div>
      </div>
    </div>
  );
} 