import { ResumeData } from "@/app/craftfolio/page";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  visible: boolean;
}

export default function ProfessionalTemplate({ resumeData, sections }: { resumeData: ResumeData; sections: Section[] }) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month] = dateString.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  return (
    <div className="font-sans text-black">
      {/* Header */}
      <div className="mb-6 border-b-2 border-gray-300 pb-4 text-center">
        <h1 className="text-[18pt] font-bold mb-2">{resumeData.personalInfo.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap justify-center gap-4 text-[11pt] text-gray-600">
          {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
          {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
          {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-2 text-[11pt]">
          {resumeData.personalInfo.website && (
            <a href={resumeData.personalInfo.website} className="text-blue-600 hover:underline">Website</a>
          )}
          {resumeData.personalInfo.linkedin && (
            <a href={resumeData.personalInfo.linkedin} className="text-blue-600 hover:underline">LinkedIn</a>
          )}
          {resumeData.personalInfo.github && (
            <a href={resumeData.personalInfo.github} className="text-blue-600 hover:underline">GitHub</a>
          )}
        </div>
      </div>
      {/* Sections */}
      {sections.map((section) => section.visible && (
        <div key={section.id}>
          {section.id === "summary" && resumeData.summary && (
            <div className="mb-6">
              <h2 className="text-[14pt] font-bold mb-2 uppercase tracking-wide">Professional Summary</h2>
              <p className="text-[11pt] text-gray-700">{resumeData.summary}</p>
            </div>
          )}
          {section.id === "experience" && resumeData.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[14pt] font-bold mb-3 uppercase tracking-wide">Professional Experience</h2>
              {resumeData.experience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[12pt] font-bold">{exp.position}</h3>
                      <p className="text-[11pt] text-gray-600">{exp.company}</p>
                    </div>
                    <p className="text-[11pt] text-gray-500">{formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}</p>
                  </div>
                  <p className="mt-2 text-[11pt] text-gray-700 whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
          )}
          {section.id === "education" && resumeData.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[14pt] font-bold mb-3 uppercase tracking-wide">Education</h2>
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[12pt] font-bold">{edu.degree} in {edu.field}</h3>
                      <p className="text-[11pt] text-gray-600">{edu.institution}</p>
                    </div>
                    <p className="text-[11pt] text-gray-500">{formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate)}</p>
                  </div>
                  {edu.gpa && <p className="mt-1 text-[11pt] text-gray-700">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          )}
          {section.id === "skills" && resumeData.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[14pt] font-bold mb-3 uppercase tracking-wide">Skills</h2>
              <div className="grid grid-cols-2 gap-2">
                {resumeData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    <span className="text-[11pt] text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {section.id === "projects" && resumeData.projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[14pt] font-bold mb-3 uppercase tracking-wide">Projects</h2>
              {resumeData.projects.map((proj) => (
                <div key={proj.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-[12pt] font-bold">{proj.name}</h3>
                    {proj.link && (
                      <a href={proj.link} className="text-[11pt] text-blue-600 hover:underline">View Project</a>
                    )}
                  </div>
                  <p className="text-[11pt] text-gray-600 mb-1">{proj.technologies}</p>
                  <p className="text-[11pt] text-gray-700">{proj.description}</p>
                </div>
              ))}
            </div>
          )}
          {section.id === "certifications" && resumeData.certifications.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[14pt] font-bold mb-3 uppercase tracking-wide">Certifications</h2>
              {resumeData.certifications.map((cert) => (
                <div key={cert.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[12pt] font-bold">{cert.name}</h3>
                      <p className="text-[11pt] text-gray-600">{cert.issuer}</p>
                    </div>
                    <p className="text-[11pt] text-gray-500">{formatDate(cert.date)}</p>
                  </div>
                  {cert.link && (
                    <a href={cert.link} className="text-[11pt] text-blue-600 hover:underline">View Certificate</a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 