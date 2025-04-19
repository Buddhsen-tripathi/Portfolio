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

  // Define consistent styles that will render well in both preview and PDF
  const styles = {
    heading: {
      fontSize: '32px',
      fontWeight: 700,
      lineHeight: 1.2,
      marginBottom: '1rem',
      color: '#000000',
      fontFamily: 'DejaVuSans-Bold, Arial, sans-serif',
    },
    subHeading: {
      fontSize: '20px',
      fontWeight: 700,
      lineHeight: 1.2,
      marginBottom: '1rem',
      color: '#000000',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
      fontFamily: 'DejaVuSans-Bold, Arial, sans-serif',
    },
    jobTitle: {
      fontSize: '18px',
      fontWeight: 600,
      color: '#000000',
      fontFamily: 'DejaVuSans-Bold, Arial, sans-serif',
    },
    normal: {
      fontSize: '13px',
      color: '#374151', // text-gray-700
      fontWeight: 'normal',
      fontFamily: 'DejaVuSans, Arial, sans-serif',
    },
    companyName: {
      fontSize: '15px',
      fontWeight: 500,
      color: '#374151',
      fontFamily: 'DejaVuSans-Bold, Arial, sans-serif',
    },
    link: {
      color: '#2563eb', // blue-600
      textDecoration: 'none',
      fontFamily: 'DejaVuSans, Arial, sans-serif',
    },
    dateText: {
      fontSize: '12px',
      color: '#6b7280', // text-gray-500
      fontWeight: 'normal',
      fontFamily: 'DejaVuSans, Arial, sans-serif',
    }
  };

  return (
    <div className="font-sans text-black" style={{ fontFamily: 'DejaVuSans, Arial, sans-serif' }}>
      {/* Header */}
      <div className="mb-8 border-b-2 border-gray-300 text-center" data-section-id="personal" style={{paddingBottom: '1.5rem'}}>
        <h1 className="text-[32px] font-bold mb-4" style={styles.heading}>{resumeData.personalInfo.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap justify-center gap-4 text-[14px] text-gray-600">
          {resumeData.personalInfo.email && <span style={styles.dateText}>{resumeData.personalInfo.email}</span>}
          {resumeData.personalInfo.phone && <span style={styles.dateText}>{resumeData.personalInfo.phone}</span>}
          {resumeData.personalInfo.location && <span style={styles.dateText}>{resumeData.personalInfo.location}</span>}
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-2 text-[14px]">
          {resumeData.personalInfo.website && (
            <a href={resumeData.personalInfo.website} className="text-blue-600 hover:underline" style={styles.link}>Website</a>
          )}
          {resumeData.personalInfo.linkedin && (
            <a href={resumeData.personalInfo.linkedin} className="text-blue-600 hover:underline" style={styles.link}>LinkedIn</a>
          )}
          {resumeData.personalInfo.github && (
            <a href={resumeData.personalInfo.github} className="text-blue-600 hover:underline" style={styles.link}>GitHub</a>
          )}
        </div>
      </div>

      {/* Sections */}
      {sections.filter(s => s.visible).map(section => (
        <div key={section.id} data-section-id={section.id}>
          {section.id === "summary" && resumeData.summary && (
            <div className="mb-6">
              <h2 className="text-[20px] font-bold mb-4 uppercase tracking-wide" style={styles.subHeading}>Summary</h2>
              <p className="text-[13px] text-gray-700 font-normal" style={styles.normal}>{resumeData.summary}</p>
            </div>
          )}
          {section.id === "experience" && resumeData.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[20px] font-bold mb-4 uppercase tracking-wide" style={styles.subHeading}>Experience</h2>
              {resumeData.experience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[18px] font-semibold" style={styles.jobTitle}>{exp.position}</h3>
                      <p className="text-[15px] font-medium text-gray-700" style={styles.companyName}>{exp.company}</p>
                    </div>
                    <p className="text-[12px] font-normal text-gray-500" style={styles.dateText}>{formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}</p>
                  </div>
                  <p className="mt-2 text-[13px] text-gray-700 font-normal whitespace-pre-line" style={styles.normal}>{exp.description}</p>
                </div>
              ))}
            </div>
          )}
          {section.id === "education" && resumeData.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[20px] font-bold mb-4 uppercase tracking-wide" style={styles.subHeading}>Education</h2>
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[15px] font-medium">{edu.degree} in {edu.field}</h3>
                      <p className="text-[15px] font-medium text-gray-700" style={styles.companyName}>{edu.institution}</p>
                    </div>
                    <p className="text-[12px] font-normal text-gray-500" style={styles.dateText}>{formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate)}</p>
                  </div>
                  {edu.gpa && <p className="mt-1 text-[13px] text-gray-700 font-normal" style={styles.normal}>GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          )}
          {section.id === "skills" && resumeData.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[20px] font-bold mb-4 uppercase tracking-wide" style={styles.subHeading}>Skills</h2>
              <div className="grid grid-cols-2 gap-2">
                {resumeData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    <span className="text-[13px] text-gray-700 font-normal" style={styles.normal}>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {section.id === "projects" && resumeData.projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[20px] font-bold mb-4 uppercase tracking-wide" style={styles.subHeading}>Projects</h2>
              {resumeData.projects.map((proj) => (
                <div key={proj.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-[15px] font-medium">{proj.name}</h3>
                  </div>
                  <p className="text-[13px] text-gray-600 mb-1 font-normal" style={styles.normal}>{proj.technologies}</p>
                  <p className="text-[13px] text-gray-700 font-normal" style={styles.normal}>{proj.description}</p>
                </div>
              ))}
            </div>
          )}
          {section.id === "certifications" && resumeData.certifications.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[20px] font-bold mb-4 uppercase tracking-wide" style={styles.subHeading}>Certifications</h2>
              {resumeData.certifications.map((cert) => (
                <div key={cert.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[15px] font-medium">{cert.name}</h3>
                      <p className="text-[15px] font-medium text-gray-700" style={styles.companyName}>{cert.issuer}</p>
                    </div>
                    <p className="text-[12px] font-normal text-gray-500" style={styles.dateText}>{formatDate(cert.date)}</p>
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