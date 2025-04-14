"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ResumeData } from "@/app/resume-maker/page";
import { Plus, Trash2 } from "lucide-react";

interface ResumeFormProps {
  resumeData: ResumeData;
  onResumeDataChange: (data: ResumeData) => void;
}

export default function ResumeForm({ resumeData, onResumeDataChange }: ResumeFormProps) {
  const [activeSection, setActiveSection] = useState<string>("personal");

  const handlePersonalInfoChange = (field: string, value: string) => {
    onResumeDataChange({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [field]: value,
      },
    });
  };

  const handleSummaryChange = (value: string) => {
    onResumeDataChange({
      ...resumeData,
      summary: value,
    });
  };

  const handleExperienceChange = (id: string, field: string, value: string | boolean) => {
    onResumeDataChange({
      ...resumeData,
      experience: resumeData.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const addExperience = () => {
    const newId = (resumeData.experience.length + 1).toString();
    onResumeDataChange({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        {
          id: newId,
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
    });
  };

  const removeExperience = (id: string) => {
    onResumeDataChange({
      ...resumeData,
      experience: resumeData.experience.filter((exp) => exp.id !== id),
    });
  };

  const handleEducationChange = (id: string, field: string, value: string | boolean) => {
    onResumeDataChange({
      ...resumeData,
      education: resumeData.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const addEducation = () => {
    const newId = (resumeData.education.length + 1).toString();
    onResumeDataChange({
      ...resumeData,
      education: [
        ...resumeData.education,
        {
          id: newId,
          institution: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          current: false,
          gpa: "",
        },
      ],
    });
  };

  const removeEducation = (id: string) => {
    onResumeDataChange({
      ...resumeData,
      education: resumeData.education.filter((edu) => edu.id !== id),
    });
  };

  const handleSkillsChange = (value: string) => {
    onResumeDataChange({
      ...resumeData,
      skills: value.split(",").map((skill) => skill.trim()),
    });
  };

  const handleProjectsChange = (id: string, field: string, value: string) => {
    onResumeDataChange({
      ...resumeData,
      projects: resumeData.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    });
  };

  const addProject = () => {
    const newId = (resumeData.projects.length + 1).toString();
    onResumeDataChange({
      ...resumeData,
      projects: [
        ...resumeData.projects,
        {
          id: newId,
          name: "",
          description: "",
          technologies: "",
          link: "",
        },
      ],
    });
  };

  const removeProject = (id: string) => {
    onResumeDataChange({
      ...resumeData,
      projects: resumeData.projects.filter((proj) => proj.id !== id),
    });
  };

  const handleCertificationsChange = (id: string, field: string, value: string) => {
    onResumeDataChange({
      ...resumeData,
      certifications: resumeData.certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    });
  };

  const addCertification = () => {
    const newId = (resumeData.certifications.length + 1).toString();
    onResumeDataChange({
      ...resumeData,
      certifications: [
        ...resumeData.certifications,
        {
          id: newId,
          name: "",
          issuer: "",
          date: "",
          link: "",
        },
      ],
    });
  };

  const removeCertification = (id: string) => {
    onResumeDataChange({
      ...resumeData,
      certifications: resumeData.certifications.filter((cert) => cert.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <Button
          variant={activeSection === "personal" ? "default" : "outline"}
          onClick={() => setActiveSection("personal")}
          className="whitespace-nowrap"
        >
          Personal Info
        </Button>
        <Button
          variant={activeSection === "summary" ? "default" : "outline"}
          onClick={() => setActiveSection("summary")}
          className="whitespace-nowrap"
        >
          Summary
        </Button>
        <Button
          variant={activeSection === "experience" ? "default" : "outline"}
          onClick={() => setActiveSection("experience")}
          className="whitespace-nowrap"
        >
          Experience
        </Button>
        <Button
          variant={activeSection === "education" ? "default" : "outline"}
          onClick={() => setActiveSection("education")}
          className="whitespace-nowrap"
        >
          Education
        </Button>
        <Button
          variant={activeSection === "skills" ? "default" : "outline"}
          onClick={() => setActiveSection("skills")}
          className="whitespace-nowrap"
        >
          Skills
        </Button>
        <Button
          variant={activeSection === "projects" ? "default" : "outline"}
          onClick={() => setActiveSection("projects")}
          className="whitespace-nowrap"
        >
          Projects
        </Button>
        <Button
          variant={activeSection === "certifications" ? "default" : "outline"}
          onClick={() => setActiveSection("certifications")}
          className="whitespace-nowrap"
        >
          Certifications
        </Button>
      </div>

      {activeSection === "personal" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={resumeData.personalInfo.fullName}
                onChange={(e) => handlePersonalInfoChange("fullName", e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={resumeData.personalInfo.email}
                onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                placeholder="john.doe@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={resumeData.personalInfo.phone}
                onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                placeholder="+1 (123) 456-7890"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={resumeData.personalInfo.location}
                onChange={(e) => handlePersonalInfoChange("location", e.target.value)}
                placeholder="New York, NY"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website (optional)</Label>
              <Input
                id="website"
                value={resumeData.personalInfo.website}
                onChange={(e) => handlePersonalInfoChange("website", e.target.value)}
                placeholder="https://johndoe.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn (optional)</Label>
              <Input
                id="linkedin"
                value={resumeData.personalInfo.linkedin}
                onChange={(e) => handlePersonalInfoChange("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/johndoe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub (optional)</Label>
              <Input
                id="github"
                value={resumeData.personalInfo.github}
                onChange={(e) => handlePersonalInfoChange("github", e.target.value)}
                placeholder="https://github.com/johndoe"
              />
            </div>
          </div>
        </div>
      )}

      {activeSection === "summary" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="summary">Professional Summary</Label>
            <Textarea
              id="summary"
              value={resumeData.summary}
              onChange={(e) => handleSummaryChange(e.target.value)}
              placeholder="A brief summary of your professional background and career objectives..."
              className="min-h-[150px]"
            />
          </div>
        </div>
      )}

      {activeSection === "experience" && (
        <div className="space-y-6">
          {resumeData.experience.map((exp) => (
            <div key={exp.id} className="space-y-4 p-4 border rounded-md">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Experience {exp.id}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeExperience(exp.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`company-${exp.id}`}>Company</Label>
                  <Input
                    id={`company-${exp.id}`}
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(exp.id, "company", e.target.value)}
                    placeholder="Company Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`position-${exp.id}`}>Position</Label>
                  <Input
                    id={`position-${exp.id}`}
                    value={exp.position}
                    onChange={(e) => handleExperienceChange(exp.id, "position", e.target.value)}
                    placeholder="Job Title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`startDate-${exp.id}`}>Start Date</Label>
                  <Input
                    id={`startDate-${exp.id}`}
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => handleExperienceChange(exp.id, "startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`endDate-${exp.id}`}>End Date</Label>
                  <Input
                    id={`endDate-${exp.id}`}
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => handleExperienceChange(exp.id, "endDate", e.target.value)}
                    disabled={exp.current}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`current-${exp.id}`}
                      checked={exp.current}
                      onChange={(e) => handleExperienceChange(exp.id, "current", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`current-${exp.id}`}>I currently work here</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`description-${exp.id}`}>Description</Label>
                <Textarea
                  id={`description-${exp.id}`}
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(exp.id, "description", e.target.value)}
                  placeholder="Describe your responsibilities and achievements..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          ))}
          <Button onClick={addExperience} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Experience
          </Button>
        </div>
      )}

      {activeSection === "education" && (
        <div className="space-y-6">
          {resumeData.education.map((edu) => (
            <div key={edu.id} className="space-y-4 p-4 border rounded-md">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Education {edu.id}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEducation(edu.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`institution-${edu.id}`}>Institution</Label>
                  <Input
                    id={`institution-${edu.id}`}
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(edu.id, "institution", e.target.value)}
                    placeholder="University Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
                  <Input
                    id={`degree-${edu.id}`}
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(edu.id, "degree", e.target.value)}
                    placeholder="Bachelor of Science"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`field-${edu.id}`}>Field of Study</Label>
                  <Input
                    id={`field-${edu.id}`}
                    value={edu.field}
                    onChange={(e) => handleEducationChange(edu.id, "field", e.target.value)}
                    placeholder="Computer Science"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`gpa-${edu.id}`}>GPA (optional)</Label>
                  <Input
                    id={`gpa-${edu.id}`}
                    value={edu.gpa}
                    onChange={(e) => handleEducationChange(edu.id, "gpa", e.target.value)}
                    placeholder="3.8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`edu-startDate-${edu.id}`}>Start Date</Label>
                  <Input
                    id={`edu-startDate-${edu.id}`}
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => handleEducationChange(edu.id, "startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`edu-endDate-${edu.id}`}>End Date</Label>
                  <Input
                    id={`edu-endDate-${edu.id}`}
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => handleEducationChange(edu.id, "endDate", e.target.value)}
                    disabled={edu.current}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`edu-current-${edu.id}`}
                      checked={edu.current}
                      onChange={(e) => handleEducationChange(edu.id, "current", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor={`edu-current-${edu.id}`}>I am currently studying here</Label>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Button onClick={addEducation} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Education
          </Button>
        </div>
      )}

      {activeSection === "skills" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Textarea
              id="skills"
              value={resumeData.skills.join(", ")}
              onChange={(e) => handleSkillsChange(e.target.value)}
              placeholder="JavaScript, React, Node.js, TypeScript..."
              className="min-h-[100px]"
            />
          </div>
        </div>
      )}

      {activeSection === "projects" && (
        <div className="space-y-6">
          {resumeData.projects.map((proj) => (
            <div key={proj.id} className="space-y-4 p-4 border rounded-md">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Project {proj.id}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeProject(proj.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`project-name-${proj.id}`}>Project Name</Label>
                  <Input
                    id={`project-name-${proj.id}`}
                    value={proj.name}
                    onChange={(e) => handleProjectsChange(proj.id, "name", e.target.value)}
                    placeholder="Project Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`project-technologies-${proj.id}`}>Technologies Used</Label>
                  <Input
                    id={`project-technologies-${proj.id}`}
                    value={proj.technologies}
                    onChange={(e) => handleProjectsChange(proj.id, "technologies", e.target.value)}
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`project-link-${proj.id}`}>Project Link (optional)</Label>
                  <Input
                    id={`project-link-${proj.id}`}
                    value={proj.link}
                    onChange={(e) => handleProjectsChange(proj.id, "link", e.target.value)}
                    placeholder="https://github.com/username/project"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`project-description-${proj.id}`}>Description</Label>
                <Textarea
                  id={`project-description-${proj.id}`}
                  value={proj.description}
                  onChange={(e) => handleProjectsChange(proj.id, "description", e.target.value)}
                  placeholder="Describe your project..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          ))}
          <Button onClick={addProject} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </div>
      )}

      {activeSection === "certifications" && (
        <div className="space-y-6">
          {resumeData.certifications.map((cert) => (
            <div key={cert.id} className="space-y-4 p-4 border rounded-md">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Certification {cert.id}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCertification(cert.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`cert-name-${cert.id}`}>Certification Name</Label>
                  <Input
                    id={`cert-name-${cert.id}`}
                    value={cert.name}
                    onChange={(e) => handleCertificationsChange(cert.id, "name", e.target.value)}
                    placeholder="AWS Certified Solutions Architect"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`cert-issuer-${cert.id}`}>Issuing Organization</Label>
                  <Input
                    id={`cert-issuer-${cert.id}`}
                    value={cert.issuer}
                    onChange={(e) => handleCertificationsChange(cert.id, "issuer", e.target.value)}
                    placeholder="Amazon Web Services"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`cert-date-${cert.id}`}>Date Obtained</Label>
                  <Input
                    id={`cert-date-${cert.id}`}
                    type="month"
                    value={cert.date}
                    onChange={(e) => handleCertificationsChange(cert.id, "date", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`cert-link-${cert.id}`}>Certificate Link (optional)</Label>
                  <Input
                    id={`cert-link-${cert.id}`}
                    value={cert.link}
                    onChange={(e) => handleCertificationsChange(cert.id, "link", e.target.value)}
                    placeholder="https://credential.net/..."
                  />
                </div>
              </div>
            </div>
          ))}
          <Button onClick={addCertification} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Certification
          </Button>
        </div>
      )}
    </div>
  );
} 