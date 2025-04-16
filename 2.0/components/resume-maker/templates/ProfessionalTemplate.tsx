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
      <div className="mb-8 border-b-2 border-gray-300 text-center" data-section-id="personal" style={{paddingBottom: '1.5rem'}}>
        <h1 className="text-[32px] font-bold mb-4" style={{ fontWeight: 700, fontFamily: 'Arial, Helvetica, sans-serif', lineHeight: 1.2 }}>{resumeData.personalInfo.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap justify-center gap-4 text-[12px] text-gray-600">
          {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
          {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
          {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-2 text-[12px]">
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
        <div key={section.id} data-section-id={section.id}>
          {section.id === "summary" && resumeData.summary && (
            <div className="mb-6">
              <h2 className="text-[20px] font-bold mb-4 uppercase tracking-wide" style={{ fontWeight: 700, fontFamily: 'Arial, Helvetica, sans-serif', lineHeight: 1.2 }}>Professional Summary</h2>
              <p className="text-[13px] text-gray-700 font-normal">{resumeData.summary}</p>
            </div>
          )}
          {section.id === "experience" && resumeData.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[20px] font-bold mb-4 uppercase tracking-wide" style={{ fontWeight: 700, fontFamily: 'Arial, Helvetica, sans-serif', lineHeight: 1.2 }}>Professional Experience</h2>
              {resumeData.experience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[18px] font-semibold">{exp.position}</h3>
                      <p className="text-[15px] font-medium text-gray-700">{exp.company}</p>
                    </div>
                    <p className="text-[12px] font-normal text-gray-500">{formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}</p>
                  </div>
                  <p className="mt-2 text-[13px] text-gray-700 font-normal whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
          )}
          {section.id === "education" && resumeData.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[20px] font-bold mb-4 uppercase tracking-wide" style={{ fontWeight: 700, fontFamily: 'Arial, Helvetica, sans-serif', lineHeight: 1.2 }}>Education</h2>
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[15px] font-medium">{edu.degree} in {edu.field}</h3>
                      <p className="text-[15px] font-medium text-gray-700">{edu.institution}</p>
                    </div>
                    <p className="text-[12px] font-normal text-gray-500">{formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate)}</p>
                  </div>
                  {edu.gpa && <p className="mt-1 text-[13px] text-gray-700 font-normal">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          )}
          {section.id === "skills" && resumeData.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[20px] font-bold mb-4 uppercase tracking-wide" style={{ fontWeight: 700, fontFamily: 'Arial, Helvetica, sans-serif', lineHeight: 1.2 }}>Skills</h2>
              <div className="grid grid-cols-2 gap-2">
                {resumeData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    <span className="text-[13px] text-gray-700 font-normal">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {section.id === "projects" && resumeData.projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[20px] font-bold mb-4 uppercase tracking-wide" style={{ fontWeight: 700, fontFamily: 'Arial, Helvetica, sans-serif', lineHeight: 1.2 }}>Projects</h2>
              {resumeData.projects.map((proj) => (
                <div key={proj.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-[15px] font-medium">{proj.name}</h3>
                    {proj.link && (
                      <a href={proj.link} className="text-[12px] text-blue-600 hover:underline">View Project</a>
                    )}
                  </div>
                  <p className="text-[13px] text-gray-600 mb-1 font-normal">{proj.technologies}</p>
                  <p className="text-[13px] text-gray-700 font-normal">{proj.description}</p>
                </div>
              ))}
            </div>
          )}
          {section.id === "certifications" && resumeData.certifications.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[20px] font-bold mb-4 uppercase tracking-wide" style={{ fontWeight: 700, fontFamily: 'Arial, Helvetica, sans-serif', lineHeight: 1.2 }}>Certifications</h2>
              {resumeData.certifications.map((cert) => (
                <div key={cert.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[15px] font-medium">{cert.name}</h3>
                      <p className="text-[15px] font-medium text-gray-700">{cert.issuer}</p>
                    </div>
                    <p className="text-[12px] font-normal text-gray-500">{formatDate(cert.date)}</p>
                  </div>
                  {cert.link && (
                    <a href={cert.link} className="text-[12px] text-blue-600 hover:underline">View Certificate</a>
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