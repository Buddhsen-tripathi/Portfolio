"use client";

import { useRef } from "react";
import { ResumeData } from "@/app/resume-maker/page";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  visible: boolean;
}

interface ResumePreviewProps {
  resumeData: ResumeData;
  template: "modern" | "classic" | "minimal" | "professional";
  onExportPDF: () => void;
  sections: Section[];
}

export default function ResumePreview({ resumeData, template, onExportPDF, sections }: ResumePreviewProps) {
  const resumeRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (resumeRef.current) {
      const canvas = await html2canvas(resumeRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${resumeData.personalInfo.fullName || 'resume'}.pdf`);
    }
    onExportPDF();
  };

  // Format date from YYYY-MM to Month Year
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month] = dateString.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  // Style classes based on template
  const getHeadingClass = () => {
    switch (template) {
      case "modern":
        return "text-xl font-bold mb-2 text-black";
      case "classic":
        return "text-xl font-serif font-bold mb-2 border-b pb-1 text-black";
      case "minimal":
        return "text-lg font-medium mb-2 text-black";
      case "professional":
      default:
        return "text-xl font-semibold mb-2 text-black";
    }
  };

  const getTextClass = () => {
    switch (template) {
      case "modern":
        return "text-black leading-relaxed";
      case "classic":
        return "text-black font-serif leading-relaxed";
      case "minimal":
        return "text-black leading-relaxed";
      case "professional":
      default:
        return "text-black leading-relaxed";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleExportPDF} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export PDF
        </Button>
      </div>
      
      <div 
        ref={resumeRef}
        className={cn(
          "w-[210mm] min-h-[297mm] mx-auto bg-white shadow-lg p-8",
          "border border-gray-200 rounded-lg text-black",
          template === "modern" && "font-sans",
          template === "classic" && "font-serif",
          template === "minimal" && "font-sans",
          template === "professional" && "font-sans"
        )}
      >
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className={cn(
            "text-3xl font-bold mb-2 text-black",
            template === "classic" && "font-serif",
            template === "minimal" && "text-2xl"
          )}>
            {resumeData.personalInfo.fullName}
          </h1>
          <div className="flex flex-wrap justify-center gap-4 text-black">
            {resumeData.personalInfo.email && (
              <span>{resumeData.personalInfo.email}</span>
            )}
            {resumeData.personalInfo.phone && (
              <span>{resumeData.personalInfo.phone}</span>
            )}
            {resumeData.personalInfo.location && (
              <span>{resumeData.personalInfo.location}</span>
            )}
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {resumeData.personalInfo.linkedin && (
              <a href={resumeData.personalInfo.linkedin} className="text-black hover:underline">LinkedIn</a>
            )}
            {resumeData.personalInfo.github && (
              <a href={resumeData.personalInfo.github} className="text-black hover:underline">GitHub</a>
            )}
            {resumeData.personalInfo.website && (
              <a href={resumeData.personalInfo.website} className="text-black hover:underline">Portfolio</a>
            )}
          </div>
        </div>

        {/* Render sections based on visibility and order */}
        {sections.map((section) => (
          section.visible && (
            <div key={section.id}>
              {section.id === "summary" && resumeData.summary && (
                <div className="mb-6">
                  <h2 className={getHeadingClass()}>Professional Summary</h2>
                  <p className={getTextClass()}>{resumeData.summary}</p>
                </div>
              )}

              {section.id === "experience" && resumeData.experience.length > 0 && (
                <div className="mb-6">
                  <h2 className={getHeadingClass()}>Experience</h2>
                  {resumeData.experience.map((exp) => (
                    <div key={exp.id} className="mb-4">
                      <h3 className="font-semibold">{exp.position}</h3>
                      <div className="flex justify-between text-black">
                        <span>{exp.company}</span>
                        <span>
                          {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                        </span>
                      </div>
                      <p className={getTextClass()}>{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {section.id === "education" && resumeData.education.length > 0 && (
                <div className="mb-6">
                  <h2 className={getHeadingClass()}>Education</h2>
                  {resumeData.education.map((edu) => (
                    <div key={edu.id} className="mb-4">
                      <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                      <div className="flex justify-between text-black">
                        <span>{edu.institution}</span>
                        <span>
                          {formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate)}
                        </span>
                      </div>
                      {edu.gpa && <p className={getTextClass()}>GPA: {edu.gpa}</p>}
                    </div>
                  ))}
                </div>
              )}

              {section.id === "skills" && resumeData.skills.length > 0 && (
                <div className="mb-6">
                  <h2 className={getHeadingClass()}>Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className={cn(
                          "px-2 py-1 rounded",
                          template === "modern" && "bg-blue-100 text-black",
                          template === "classic" && "border text-black",
                          template === "minimal" && "bg-gray-100 text-black",
                          template === "professional" && "bg-gray-100 text-black"
                        )}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {section.id === "projects" && resumeData.projects.length > 0 && (
                <div className="mb-6">
                  <h2 className={getHeadingClass()}>Projects</h2>
                  {resumeData.projects.map((project) => (
                    <div key={project.id} className="mb-4">
                      <h3 className="font-semibold">
                        {project.name}
                        {project.link && (
                          <a href={project.link} className="text-black hover:underline ml-2 text-sm">
                            View Project
                          </a>
                        )}
                      </h3>
                      <p className={getTextClass()}>{project.description}</p>
                      <p className="text-black mt-1">{project.technologies}</p>
                    </div>
                  ))}
                </div>
              )}

              {section.id === "certifications" && resumeData.certifications.length > 0 && (
                <div className="mb-6">
                  <h2 className={getHeadingClass()}>Certifications</h2>
                  {resumeData.certifications.map((cert) => (
                    <div key={cert.id} className="mb-4">
                      <h3 className="font-semibold">
                        {cert.name}
                        {cert.link && (
                          <a href={cert.link} className="text-black hover:underline ml-2 text-sm">
                            View Certificate
                          </a>
                        )}
                      </h3>
                      <div className="flex justify-between text-black">
                        <span>{cert.issuer}</span>
                        <span>{formatDate(cert.date)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        ))}
      </div>
    </div>
  );
}