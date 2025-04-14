"use client";

import { useRef } from "react";
import { ResumeData } from "@/app/resume-maker/page";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ResumePreviewProps {
  resumeData: ResumeData;
  template: "modern" | "classic" | "minimal" | "professional";
  onExportPDF: () => void;
}

export default function ResumePreview({ resumeData, template, onExportPDF }: ResumePreviewProps) {
  const resumeRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (resumeRef.current) {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${resumeData.personalInfo.fullName || "resume"}.pdf`);
    }
  };

  // Format date from YYYY-MM to Month Year
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month] = dateString.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  // Render the appropriate template based on the selected template
  const renderTemplate = () => {
    switch (template) {
      case "professional":
        return <ProfessionalTemplate resumeData={resumeData} formatDate={formatDate} />;
      case "modern":
        return <ModernTemplate resumeData={resumeData} formatDate={formatDate} />;
      case "classic":
        return <ClassicTemplate resumeData={resumeData} formatDate={formatDate} />;
      case "minimal":
        return <MinimalTemplate resumeData={resumeData} formatDate={formatDate} />;
      default:
        return <ProfessionalTemplate resumeData={resumeData} formatDate={formatDate} />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleExportPDF} size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>
      <div 
        ref={resumeRef} 
        className="w-full bg-white shadow-md overflow-hidden text-black"
        style={{ 
          maxWidth: "210mm", 
          minHeight: "297mm", 
          padding: "20mm",
          boxSizing: "border-box",
          fontSize: "12px",
          lineHeight: "1.5",
        }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
}

// Professional Template - Clean, organized layout with clear sections
function ProfessionalTemplate({ resumeData, formatDate }: { resumeData: ResumeData; formatDate: (date: string) => string }) {
  return (
    <div className="font-sans text-black">
      {/* Header */}
      <div className="mb-6 border-b-2 border-gray-300 pb-4">
        <h1 className="text-3xl font-bold mb-2">{resumeData.personalInfo.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap gap-4 text-sm">
          {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
          {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
          {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
        </div>
        <div className="flex flex-wrap gap-4 mt-2 text-sm">
          {resumeData.personalInfo.website && (
            <a href={resumeData.personalInfo.website} className="text-blue-600 hover:underline">
              Website
            </a>
          )}
          {resumeData.personalInfo.linkedin && (
            <a href={resumeData.personalInfo.linkedin} className="text-blue-600 hover:underline">
              LinkedIn
            </a>
          )}
          {resumeData.personalInfo.github && (
            <a href={resumeData.personalInfo.github} className="text-blue-600 hover:underline">
              GitHub
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {resumeData.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 uppercase tracking-wide">Professional Summary</h2>
          <p className="text-gray-700">{resumeData.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resumeData.experience.length > 0 && resumeData.experience[0].company && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wide">Professional Experience</h2>
          {resumeData.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{exp.position}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                </p>
              </div>
              <p className="mt-2 text-gray-700 whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && resumeData.education[0].institution && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wide">Education</h2>
          {resumeData.education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{edu.degree} in {edu.field}</h3>
                  <p className="text-gray-600">{edu.institution}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate)}
                </p>
              </div>
              {edu.gpa && <p className="mt-1 text-gray-700">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wide">Skills</h2>
          <div className="grid grid-cols-2 gap-2">
            {resumeData.skills.map((skill, index) => (
              <div key={index} className="flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                <span className="text-gray-700">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {resumeData.projects.length > 0 && resumeData.projects[0].name && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wide">Projects</h2>
          {resumeData.projects.map((proj) => (
            <div key={proj.id} className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold">{proj.name}</h3>
                {proj.link && (
                  <a href={proj.link} className="text-blue-600 hover:underline text-sm">
                    View Project
                  </a>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-1">{proj.technologies}</p>
              <p className="text-gray-700">{proj.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {resumeData.certifications.length > 0 && resumeData.certifications[0].name && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wide">Certifications</h2>
          {resumeData.certifications.map((cert) => (
            <div key={cert.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{cert.name}</h3>
                  <p className="text-gray-600">{cert.issuer}</p>
                </div>
                <p className="text-sm text-gray-500">{formatDate(cert.date)}</p>
              </div>
              {cert.link && (
                <a href={cert.link} className="text-blue-600 hover:underline text-sm">
                  View Certificate
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Modern Template
function ModernTemplate({ resumeData, formatDate }: { resumeData: ResumeData; formatDate: (date: string) => string }) {
  return (
    <div className="font-sans text-black">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{resumeData.personalInfo.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
          {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
          {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm">
          {resumeData.personalInfo.website && (
            <a href={resumeData.personalInfo.website} className="text-blue-600 hover:underline">
              Website
            </a>
          )}
          {resumeData.personalInfo.linkedin && (
            <a href={resumeData.personalInfo.linkedin} className="text-blue-600 hover:underline">
              LinkedIn
            </a>
          )}
          {resumeData.personalInfo.github && (
            <a href={resumeData.personalInfo.github} className="text-blue-600 hover:underline">
              GitHub
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {resumeData.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 border-b-2 border-gray-300">Professional Summary</h2>
          <p className="text-gray-700">{resumeData.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resumeData.experience.length > 0 && resumeData.experience[0].company && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 border-b-2 border-gray-300">Work Experience</h2>
          {resumeData.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{exp.position}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                </p>
              </div>
              <p className="mt-2 text-gray-700 whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && resumeData.education[0].institution && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 border-b-2 border-gray-300">Education</h2>
          {resumeData.education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                  <p className="text-gray-600">{edu.institution}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate)}
                </p>
              </div>
              {edu.gpa && <p className="mt-1 text-gray-700">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 border-b-2 border-gray-300">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {resumeData.projects.length > 0 && resumeData.projects[0].name && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 border-b-2 border-gray-300">Projects</h2>
          {resumeData.projects.map((proj) => (
            <div key={proj.id} className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold">{proj.name}</h3>
                {proj.link && (
                  <a href={proj.link} className="text-blue-600 hover:underline text-sm">
                    View Project
                  </a>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-1">{proj.technologies}</p>
              <p className="text-gray-700">{proj.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {resumeData.certifications.length > 0 && resumeData.certifications[0].name && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 border-b-2 border-gray-300">Certifications</h2>
          {resumeData.certifications.map((cert) => (
            <div key={cert.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{cert.name}</h3>
                  <p className="text-gray-600">{cert.issuer}</p>
                </div>
                <p className="text-sm text-gray-500">{formatDate(cert.date)}</p>
              </div>
              {cert.link && (
                <a href={cert.link} className="text-blue-600 hover:underline text-sm">
                  View Certificate
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Classic Template
function ClassicTemplate({ resumeData, formatDate }: { resumeData: ResumeData; formatDate: (date: string) => string }) {
  return (
    <div className="font-serif text-black">
      {/* Header */}
      <div className="mb-8 text-center border-b-2 border-black pb-4">
        <h1 className="text-3xl font-bold mb-2">{resumeData.personalInfo.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
          {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
          {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm">
          {resumeData.personalInfo.website && (
            <a href={resumeData.personalInfo.website} className="text-black hover:underline">
              Website
            </a>
          )}
          {resumeData.personalInfo.linkedin && (
            <a href={resumeData.personalInfo.linkedin} className="text-black hover:underline">
              LinkedIn
            </a>
          )}
          {resumeData.personalInfo.github && (
            <a href={resumeData.personalInfo.github} className="text-black hover:underline">
              GitHub
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {resumeData.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">PROFESSIONAL SUMMARY</h2>
          <p>{resumeData.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resumeData.experience.length > 0 && resumeData.experience[0].company && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">PROFESSIONAL EXPERIENCE</h2>
          {resumeData.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{exp.position}</h3>
                  <p className="italic">{exp.company}</p>
                </div>
                <p className="text-sm">
                  {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                </p>
              </div>
              <p className="mt-2 whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && resumeData.education[0].institution && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">EDUCATION</h2>
          {resumeData.education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{edu.degree} in {edu.field}</h3>
                  <p className="italic">{edu.institution}</p>
                </div>
                <p className="text-sm">
                  {formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate)}
                </p>
              </div>
              {edu.gpa && <p className="mt-1">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">SKILLS</h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <span key={index} className="border border-black px-3 py-1">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {resumeData.projects.length > 0 && resumeData.projects[0].name && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">PROJECTS</h2>
          {resumeData.projects.map((proj) => (
            <div key={proj.id} className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold">{proj.name}</h3>
                {proj.link && (
                  <a href={proj.link} className="text-black hover:underline text-sm">
                    View Project
                  </a>
                )}
              </div>
              <p className="italic mb-1">{proj.technologies}</p>
              <p>{proj.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {resumeData.certifications.length > 0 && resumeData.certifications[0].name && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">CERTIFICATIONS</h2>
          {resumeData.certifications.map((cert) => (
            <div key={cert.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{cert.name}</h3>
                  <p className="italic">{cert.issuer}</p>
                </div>
                <p className="text-sm">{formatDate(cert.date)}</p>
              </div>
              {cert.link && (
                <a href={cert.link} className="text-black hover:underline text-sm">
                  View Certificate
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Minimal Template
function MinimalTemplate({ resumeData, formatDate }: { resumeData: ResumeData; formatDate: (date: string) => string }) {
  return (
    <div className="font-sans text-black">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light mb-2">{resumeData.personalInfo.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
          {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
          {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
        </div>
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
          {resumeData.personalInfo.website && (
            <a href={resumeData.personalInfo.website} className="hover:underline">
              Website
            </a>
          )}
          {resumeData.personalInfo.linkedin && (
            <a href={resumeData.personalInfo.linkedin} className="hover:underline">
              LinkedIn
            </a>
          )}
          {resumeData.personalInfo.github && (
            <a href={resumeData.personalInfo.github} className="hover:underline">
              GitHub
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {resumeData.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-light mb-2 uppercase tracking-wider">About</h2>
          <p className="text-gray-600">{resumeData.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resumeData.experience.length > 0 && resumeData.experience[0].company && (
        <div className="mb-6">
          <h2 className="text-lg font-light mb-3 uppercase tracking-wider">Experience</h2>
          {resumeData.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-normal">{exp.position}</h3>
                  <p className="text-gray-500">{exp.company}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                </p>
              </div>
              <p className="mt-2 text-gray-600 whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && resumeData.education[0].institution && (
        <div className="mb-6">
          <h2 className="text-lg font-light mb-3 uppercase tracking-wider">Education</h2>
          {resumeData.education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-normal">{edu.degree} in {edu.field}</h3>
                  <p className="text-gray-500">{edu.institution}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate)}
                </p>
              </div>
              {edu.gpa && <p className="mt-1 text-gray-600">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-light mb-3 uppercase tracking-wider">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <span key={index} className="text-gray-600">
                {skill}{index < resumeData.skills.length - 1 ? " •" : ""}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {resumeData.projects.length > 0 && resumeData.projects[0].name && (
        <div className="mb-6">
          <h2 className="text-lg font-light mb-3 uppercase tracking-wider">Projects</h2>
          {resumeData.projects.map((proj) => (
            <div key={proj.id} className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="font-normal">{proj.name}</h3>
                {proj.link && (
                  <a href={proj.link} className="text-gray-500 hover:underline text-sm">
                    View Project
                  </a>
                )}
              </div>
              <p className="text-gray-500 mb-1">{proj.technologies}</p>
              <p className="text-gray-600">{proj.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {resumeData.certifications.length > 0 && resumeData.certifications[0].name && (
        <div className="mb-6">
          <h2 className="text-lg font-light mb-3 uppercase tracking-wider">Certifications</h2>
          {resumeData.certifications.map((cert) => (
            <div key={cert.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-normal">{cert.name}</h3>
                  <p className="text-gray-500">{cert.issuer}</p>
                </div>
                <p className="text-sm text-gray-500">{formatDate(cert.date)}</p>
              </div>
              {cert.link && (
                <a href={cert.link} className="text-gray-500 hover:underline text-sm">
                  View Certificate
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 