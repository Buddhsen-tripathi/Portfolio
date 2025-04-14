"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ResumeForm from "@/components/resume-maker/ResumeForm";
import ResumePreview from "@/components/resume-maker/ResumePreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";

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
  const [activeTemplate, setActiveTemplate] = useState<"modern" | "classic" | "minimal" | "professional">("professional");
  const [pdfFileName, setPdfFileName] = useState("");

  const handleResumeDataChange = (newData: ResumeData) => {
    setResumeData(newData);
  };

  const handleExportPDF = () => {
    // This will be handled by the ResumePreview component
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Resume Maker</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardContent className="p-6">
              <ResumeForm resumeData={resumeData} onResumeDataChange={handleResumeDataChange} />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="professional" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="professional">Professional</TabsTrigger>
                  <TabsTrigger value="modern">Modern</TabsTrigger>
                  <TabsTrigger value="classic">Classic</TabsTrigger>
                  <TabsTrigger value="minimal">Minimal</TabsTrigger>
                </TabsList>
                <TabsContent value="professional">
                  <ResumePreview
                    resumeData={resumeData}
                    template="professional"
                    onExportPDF={handleExportPDF}
                  />
                </TabsContent>
                <TabsContent value="modern">
                  <ResumePreview
                    resumeData={resumeData}
                    template="modern"
                    onExportPDF={handleExportPDF}
                  />
                </TabsContent>
                <TabsContent value="classic">
                  <ResumePreview
                    resumeData={resumeData}
                    template="classic"
                    onExportPDF={handleExportPDF}
                  />
                </TabsContent>
                <TabsContent value="minimal">
                  <ResumePreview
                    resumeData={resumeData}
                    template="minimal"
                    onExportPDF={handleExportPDF}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 