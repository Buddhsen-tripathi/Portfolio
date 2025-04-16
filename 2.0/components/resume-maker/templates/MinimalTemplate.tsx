import { ResumeData } from "@/app/craftfolio/page";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  visible: boolean;
}

export default function MinimalTemplate({ resumeData, sections }: { resumeData: ResumeData; sections: Section[] }) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month] = dateString.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  return (
    <div className="font-sans text-black">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[18pt] font-light mb-2">{resumeData.personalInfo.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap gap-4 text-[11pt] text-gray-500">
          {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
          {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
          {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
        </div>
        <div className="flex flex-wrap gap-4 mt-2 text-[11pt] text-gray-500">
          {resumeData.personalInfo.website && (
            <a href={resumeData.personalInfo.website} className="hover:underline">Website</a>
          )}
          {resumeData.personalInfo.linkedin && (
            <a href={resumeData.personalInfo.linkedin} className="hover:underline">LinkedIn</a>
          )}
          {resumeData.personalInfo.github && (
            <a href={resumeData.personalInfo.github} className="hover:underline">GitHub</a>
          )}
        </div>
      </div>
      {/* Sections */}
      {sections.map((section) => section.visible && (
        <div key={section.id}>
          {section.id === "summary" && resumeData.summary && (
            <div className="mb-6">
              <h2 className="text-[14pt] font-light mb-2 uppercase tracking-wider text-gray-700">About</h2>
              <p className="text-[11pt] text-gray-600">{resumeData.summary}</p>
            </div>
          )}
          {section.id === "experience" && resumeData.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[14pt] font-light mb-3 uppercase tracking-wider text-gray-700">Experience</h2>
              {resumeData.experience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[12pt] font-normal">{exp.position}</h3>
                      <p className="text-[11pt] text-gray-500">{exp.company}</p>
                    </div>
                    <p className="text-[11pt] text-gray-500">{formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}</p>
                  </div>
                  <p className="mt-2 text-[11pt] text-gray-600 whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
          )}
          {section.id === "education" && resumeData.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[14pt] font-light mb-3 uppercase tracking-wider text-gray-700">Education</h2>
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[12pt] font-normal">{edu.degree} in {edu.field}</h3>
                      <p className="text-[11pt] text-gray-500">{edu.institution}</p>
                    </div>
                    <p className="text-[11pt] text-gray-500">{formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate)}</p>
                  </div>
                  {edu.gpa && <p className="mt-1 text-[11pt] text-gray-600">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          )}
          {section.id === "skills" && resumeData.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[14pt] font-light mb-3 uppercase tracking-wider text-gray-700">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <span key={index} className="text-[11pt] text-gray-600">
                    {skill}{index < resumeData.skills.length - 1 ? " •" : ""}
                  </span>
                ))}
              </div>
            </div>
          )}
          {section.id === "projects" && resumeData.projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[14pt] font-light mb-3 uppercase tracking-wider text-gray-700">Projects</h2>
              {resumeData.projects.map((proj) => (
                <div key={proj.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-[12pt] font-normal">{proj.name}</h3>
                    {proj.link && (
                      <a href={proj.link} className="text-[11pt] text-gray-500 hover:underline">View Project</a>
                    )}
                  </div>
                  <p className="text-[11pt] text-gray-500 mb-1">{proj.technologies}</p>
                  <p className="text-[11pt] text-gray-600">{proj.description}</p>
                </div>
              ))}
            </div>
          )}
          {section.id === "certifications" && resumeData.certifications.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[14pt] font-light mb-3 uppercase tracking-wider text-gray-700">Certifications</h2>
              {resumeData.certifications.map((cert) => (
                <div key={cert.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[12pt] font-normal">{cert.name}</h3>
                      <p className="text-[11pt] text-gray-500">{cert.issuer}</p>
                    </div>
                    <p className="text-[11pt] text-gray-500">{formatDate(cert.date)}</p>
                  </div>
                  {cert.link && (
                    <a href={cert.link} className="text-[11pt] text-gray-500 hover:underline">View Certificate</a>
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