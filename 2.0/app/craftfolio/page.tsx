"use client";

import { useState, useEffect } from "react";
import ResumeForm from "@/components/craftfolio/ResumeForm";
import ResumePreview from "@/components/craftfolio/ResumePreview";
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
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
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
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (123) 456-7890",
    location: "New York, NY",
    website: "https://johndoe.dev",
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
  },
  summary: "Results-driven software engineer with 3+ years of experience in full-stack web development. Passionate about creating efficient, scalable solutions and delivering exceptional user experiences.",
  experience: [
    {
      id: "default-exp-1",
      position: "Software Engineer",
      company: "Tech Solutions Inc.",
      startDate: "2022-01",
      endDate: "2023-12",
      current: true,
      description: "Led development of multiple web applications using React and Node.js. Improved application performance by 40% through code optimization and implementing best practices.",
    }
  ],
  education: [
    {
      id: "default-edu-1",
      degree: "Bachelor of Science",
      field: "Computer Science",
      institution: "University of Technology",
      startDate: "2018-09",
      endDate: "2022-05",
      current: false,
      gpa: "3.8",
    }
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "React.js",
    "Node.js",
    "Python",
    "SQL",
    "Git",
    "AWS",
    "RESTful APIs",
    "Agile Development"
  ],
  projects: [
    {
      id: "default-proj-1",
      name: "E-commerce Platform",
      description: "Developed a full-stack e-commerce platform with React, Node.js, and MongoDB. Implemented secure payment processing and real-time inventory management.",
      technologies: "React, Node.js, Express, MongoDB, Stripe API"
    }
  ],
  certifications: [
    {
      id: "default-cert-1",
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023-06"
    }
  ],
};

export default function Craftfolio() {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [template, setTemplate] = useState<"professional">("professional");
  const [sections, setSections] = useState<Section[]>(defaultSections);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCustomizePanel, setShowCustomizePanel] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeSuggestionId, setActiveSuggestionId] = useState<string | null>(null);

  useEffect(() => {
    const loadSavedData = () => {
      try {
        if (typeof window !== 'undefined') {
          const savedResumeData = localStorage.getItem('resumeData');
          const savedTemplate = localStorage.getItem('template');
          const savedSections = localStorage.getItem('sections');

          if (savedResumeData) {
            const parsedData = JSON.parse(savedResumeData);
            if (
              parsedData?.personalInfo &&
              Array.isArray(parsedData?.experience) &&
              Array.isArray(parsedData?.education) &&
              Array.isArray(parsedData?.skills) &&
              Array.isArray(parsedData?.projects) &&
              Array.isArray(parsedData?.certifications)
            ) {
              setResumeData(parsedData);
            }
          }

          if (savedTemplate && ['professional'].includes(savedTemplate)) {
            setTemplate(savedTemplate as typeof template);
          }

          if (savedSections) {
            const parsedSections = JSON.parse(savedSections);
            if (Array.isArray(parsedSections) && parsedSections.every(section => 
              section.id && typeof section.visible === 'boolean' && section.name
            )) {
              setSections(parsedSections);
            }
          }
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
        setResumeData(defaultResumeData);
        setTemplate('professional');
        setSections(defaultSections);
      } finally {
        setIsInitialized(true);
      }
    };

    loadSavedData();

    return () => {};
  }, []);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data to default values? This cannot be undone.')) {
      localStorage.removeItem('resumeData');
      localStorage.removeItem('template');
      localStorage.removeItem('sections');
      setResumeData(defaultResumeData);
      setTemplate('professional');
      setSections(defaultSections);
    }
  };

  const handleResumeDataChange = (data: ResumeData) => {
    setResumeData(data);
    localStorage.setItem('resumeData', JSON.stringify(data));
  };

  const handleGetSuggestion = async (section: string, content: string, itemId: string) => {
    setActiveSuggestionId(itemId);
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
    console.log("PDF exported successfully");
  };

  const handleTemplateChange = (newTemplate: typeof template) => {
    setTemplate(newTemplate);
    localStorage.setItem('template', newTemplate);
  };

  const moveSection = (dragIndex: number, dropIndex: number) => {
    const newSections = [...sections];
    const [removed] = newSections.splice(dragIndex, 1);
    newSections.splice(dropIndex, 0, removed);
    setSections(newSections);
    localStorage.setItem('sections', JSON.stringify(newSections));
  };

  const toggleSectionVisibility = (sectionId: string) => {
    const newSections = sections.map(section => 
      section.id === sectionId 
        ? { ...section, visible: !section.visible }
        : section
    );
    setSections(newSections);
    localStorage.setItem('sections', JSON.stringify(newSections));
  };

  if (!isInitialized) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading your resume data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
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
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white text-center mb-4">Create your ideal resume with zero code and total control.</h3>
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Choose Template</h2>
            <div className="flex gap-2">
              {["professional"].map((t) => (
                <Button
                  key={t}
                  onClick={() => handleTemplateChange(t as typeof template)}
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
            <Button
              onClick={handleReset}
              variant="destructive"
              className="whitespace-nowrap"
            >
              Reset to Default
            </Button>
          </div>
        </div>

        <h2 className="text-xl font-semibold">Resume Form</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <ResumeForm
              resumeData={resumeData}
              onResumeDataChange={handleResumeDataChange}
              onGetSuggestion={handleGetSuggestion}
              isLoading={isLoading}
              suggestion={suggestion}
              error={error}
              activeSuggestionId={activeSuggestionId}
              setActiveSuggestionId={setActiveSuggestionId}
            />

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
