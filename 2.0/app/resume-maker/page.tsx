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
    website?: string;
    linkedin?: string;
    github?: string;
  };
  summary: string;
  experience: {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }[];
  education: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    current: boolean;
    gpa?: string;
  }[];
  skills: string[];
  projects: {
    id: string;
    name: string;
    description: string;
    technologies: string;
    link?: string;
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    date: string;
    link?: string;
  }[];
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
  experience: [
    {
      id: "1",
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    },
  ],
  education: [
    {
      id: "1",
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
      gpa: "",
    },
  ],
  skills: [],
  projects: [
    {
      id: "1",
      name: "",
      description: "",
      technologies: "",
      link: "",
    },
  ],
  certifications: [
    {
      id: "1",
      name: "",
      issuer: "",
      date: "",
      link: "",
    },
  ],
};

export default function ResumeMaker() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [activeTemplate, setActiveTemplate] = useState<string>("modern");
  const [pdfFileName, setPdfFileName] = useState<string>("my-resume");

  const handleResumeDataChange = (newData: ResumeData) => {
    setResumeData(newData);
  };

  const handleExportPDF = () => {
    // This will be implemented in the ResumePreview component
    // We'll pass the function to the component
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Resume Maker</h1>
      <p className="text-center mb-8 text-muted-foreground">
        Create your professional resume with our easy-to-use tool. Fill in your details and preview in real-time.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resume Information</CardTitle>
              <CardDescription>
                Fill in your details to create your resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResumeForm 
                resumeData={resumeData} 
                onResumeDataChange={handleResumeDataChange} 
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resume Preview</CardTitle>
              <CardDescription>
                See how your resume will look
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="modern" className="w-full" onValueChange={setActiveTemplate}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="modern">Modern</TabsTrigger>
                  <TabsTrigger value="classic">Classic</TabsTrigger>
                  <TabsTrigger value="minimal">Minimal</TabsTrigger>
                </TabsList>
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

          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>
                Download your resume as a PDF
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="filename">File Name</Label>
                  <Input
                    id="filename"
                    placeholder="my-resume"
                    value={pdfFileName}
                    onChange={(e) => setPdfFileName(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleExportPDF}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export as PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 