import { ResumeData } from "@/app/craftfolio/page";

interface Section {
  id: string;
  visible: boolean;
}

export default function ClassicTemplate({ resumeData, sections }: { resumeData: ResumeData; sections: Section[] }) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month] = dateString.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  return (
    <div className="font-serif text-black">
      {/* Header */}
      <div className="mb-8 text-center border-b-2 border-black pb-4" data-section-id="personal">
        <h1 className="text-[18pt] font-bold mb-1">{resumeData.personalInfo.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap justify-center gap-4 text-[11pt]">
          {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
          {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
          {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-1 text-[11pt]">
          {resumeData.personalInfo.website && (
            <a href={resumeData.personalInfo.website} className="text-blue-700 hover:underline">Website</a>
          )}
            {resumeData.personalInfo.linkedin && (
            <a href={resumeData.personalInfo.linkedin} className="text-blue-700 hover:underline flex items-center gap-1">
              <span>LinkedIn</span>
            </a>
            )}
            {resumeData.personalInfo.github && (
            <a href={resumeData.personalInfo.github} className="text-blue-700 hover:underline flex items-center gap-1">
              <span>Github</span>
            </a>
            )}
        </div>
      </div>
      {/* Sections */}
      {sections.filter(s => s.visible).map(section => (
        <div key={section.id} data-section-id={section.id}>
          {section.id === "summary" && resumeData.summary && (
            <div className="mb-6">
              <h2 className="text-[14pt] font-bold mb-2 uppercase tracking-wide">SUMMARY</h2>
              <p className="text-[11pt]">{resumeData.summary}</p>
            </div>
          )}
          {section.id === "experience" && resumeData.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[14pt] font-bold mb-3 uppercase tracking-wide">EXPERIENCE</h2>
              {resumeData.experience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[12pt] font-semibold">{exp.position}</h3>
                      <p className="text-[11pt] italic">{exp.company}</p>
                    </div>
                    <p className="text-[11pt]">{formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}</p>
                  </div>
                  <p className="mt-2 text-[11pt] whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
          )}
          {section.id === "education" && resumeData.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[14pt] font-bold mb-3 uppercase tracking-wide">EDUCATION</h2>
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[12pt] font-bold">{edu.degree} in {edu.field}</h3>
                      <p className="text-[11pt] italic">{edu.institution}</p>
                    </div>
                    <p className="text-[11pt]">{formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate)}</p>
                  </div>
                  {edu.gpa && <p className="mt-1 text-[11pt]">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          )}
          {section.id === "skills" && resumeData.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[14pt] font-bold mb-3 uppercase tracking-wide">SKILLS</h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <span key={index} className="text-[11pt] border border-black px-3 py-1">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {section.id === "projects" && resumeData.projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[14pt] font-bold mb-3 uppercase tracking-wide">PROJECTS</h2>
              {resumeData.projects.map((proj) => (
                <div key={proj.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-[12pt] font-bold">{proj.name}</h3>
                  </div>
                  <p className="text-[11pt] italic mb-1">{proj.technologies}</p>
                  <p className="text-[11pt]">{proj.description}</p>
                </div>
              ))}
            </div>
          )}
          {section.id === "certifications" && resumeData.certifications.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[14pt] font-bold mb-3 uppercase tracking-wide">CERTIFICATIONS</h2>
              {resumeData.certifications.map((cert) => (
                <div key={cert.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[12pt] font-bold">{cert.name}</h3>
                      <p className="text-[11pt] italic">{cert.issuer}</p>
                    </div>
                    <p className="text-[11pt]">{formatDate(cert.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 