"use client";

import { useState } from "react";
import ResumeForm from "@/components/resume-maker/ResumeForm";
import ResumePreview from "@/components/resume-maker/ResumePreview";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ViewCounter from "@/components/ViewCounter";

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface Experience {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
}

export interface Section {
  id: string;
  name: string;
  visible: boolean;
}

const defaultSections: Section[] = [
  { id: "summary", name: "Professional Summary", visible: true },
  { id: "experience", name: "Experience", visible: true },
  { id: "education", name: "Education", visible: true },
  { id: "skills", name: "Skills", visible: true },
  { id: "projects", name: "Projects", visible: true },
  { id: "certifications", name: "Certifications", visible: true },
];

const defaultResumeData: ResumeData = {
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
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
};

export default function Craftfolio() {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [template, setTemplate] = useState<"modern" | "classic" | "minimal" | "professional">("professional");
  const [sections, setSections] = useState<Section[]>(defaultSections);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCustomizePanel, setShowCustomizePanel] = useState(false);

  const handleResumeDataChange = (data: ResumeData) => {
    setResumeData(data);
  };

  const handleGetSuggestion = async (section: string, content: string) => {
    setIsLoading(true);
    setError(null);
    setSuggestion(null);

    try {
      const response = await fetch('/api/resume-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section, currentContent: content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get suggestions');
      }

      setSuggestion(data.suggestion);
    } catch (err) {
      setError((err as Error).message || 'Failed to get suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = () => {
    // This is called after PDF export
    console.log("PDF exported successfully");
  };

  const moveSection = (dragIndex: number, dropIndex: number) => {
    const newSections = [...sections];
    const [removed] = newSections.splice(dragIndex, 1);
    newSections.splice(dropIndex, 0, removed);
    setSections(newSections);
  };

  const toggleSectionVisibility = (sectionId: string) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? { ...section, visible: !section.visible }
        : section
    ));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="w-full flex items-center justify-between mb-6 pb-4">
        <div className="flex items-center space-x-4">
          <Link href="/projects" className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <ViewCounter slug="craftfolio" readOnly={false} />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-center text-primary mb-4">CraftFolio</h1>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white text-center mb-4">Create your ideal resume with no coding required and full customization</h3>
      <div className="flex flex-col gap-8">
        {/* Template Selection */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Choose Template</h2>
            <div className="flex gap-2">
              {["professional", "modern", "classic", "minimal"].map((t) => (
                <Button
                  key={t}
                  onClick={() => setTemplate(t as typeof template)}
                  variant={template === t ? "default" : "outline"}
                  className="capitalize"
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCustomizePanel(!showCustomizePanel)}
              variant="outline"
              className="whitespace-nowrap"
            >
              {showCustomizePanel ? "Hide Sections" : "Customize Sections"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel */}
          <div className="space-y-8">
            <ResumeForm
              resumeData={resumeData}
              onResumeDataChange={handleResumeDataChange}
              onGetSuggestion={handleGetSuggestion}
              isLoading={isLoading}
              suggestion={suggestion}
              error={error}
            />

            {/* Customize Sections Panel */}
            {showCustomizePanel && (
              <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
                <h2 className="text-xl font-semibold text-black">Customize Sections</h2>
                <div className="space-y-2">
                  {sections.map((section, index) => (
                    <div
                      key={section.id}
                      className={cn(
                        "flex items-center gap-4 p-3 text-black bg-white border rounded-lg cursor-move",
                        !section.visible && "opacity-50"
                      )}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", index.toString());
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
                        moveSection(dragIndex, index);
                      }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSectionVisibility(section.id)}
                      >
                        {section.visible ? "Hide" : "Show"}
                      </Button>
                      <span className="flex-1">{section.name}</span>
                      <div className="text-gray-400 text-sm">Drag to reorder</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="space-y-8">
            <ResumePreview
              resumeData={resumeData}
              template={template}
              onExportPDF={handleExportPDF}
              sections={sections}
            />
          </div>
        </div>
      </div>
    </div>
  );
}