"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Wand2 } from "lucide-react";
import { ResumeData } from "@/app/craftfolio/page";

interface ResumeFormProps {
  resumeData: ResumeData;
  onResumeDataChange: (data: ResumeData) => void;
  onGetSuggestion: (section: string, content: string, itemId: string) => Promise<void>;
  isLoading: boolean;
  suggestion: string | null;
  error: string | null;
  activeSuggestionId: string | null;
  setActiveSuggestionId: (id: string | null) => void;
}

export default function ResumeForm({
  resumeData,
  onResumeDataChange,
  onGetSuggestion,
  isLoading,
  suggestion,
  error,
  activeSuggestionId,
  setActiveSuggestionId,
}: ResumeFormProps) {
  const [activeSection, setActiveSection] = useState<string>("personal");

  useEffect(() => {
    setActiveSuggestionId(null);
  }, [activeSection, setActiveSuggestionId]);

  const handlePersonalInfoChange = (field: keyof ResumeData["personalInfo"], value: string) => {
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

  const handleExperienceChange = (index: number, field: string, value: string | boolean) => {
    const newExperience = [...resumeData.experience];
    newExperience[index] = {
      ...newExperience[index],
      [field]: value,
    };
    onResumeDataChange({
      ...resumeData,
      experience: newExperience,
    });
  };

  const handleEducationChange = (index: number, field: string, value: string | boolean) => {
    const newEducation = [...resumeData.education];
    newEducation[index] = {
      ...newEducation[index],
      [field]: value,
    };
    onResumeDataChange({
      ...resumeData,
      education: newEducation,
    });
  };

  const handleSkillsChange = (value: string) => {
    onResumeDataChange({
      ...resumeData,
      skills: value.split(",").map((skill) => skill.trim()),
    });
  };

  const handleProjectsChange = (index: number, field: string, value: string) => {
    const newProjects = [...resumeData.projects];
    newProjects[index] = {
      ...newProjects[index],
      [field]: value,
    };
    onResumeDataChange({
      ...resumeData,
      projects: newProjects,
    });
  };

  const handleCertificationsChange = (index: number, field: string, value: string) => {
    const newCertifications = [...resumeData.certifications];
    newCertifications[index] = {
      ...newCertifications[index],
      [field]: value,
    };
    onResumeDataChange({
      ...resumeData,
      certifications: newCertifications,
    });
  };

  const addExperience = () => {
    onResumeDataChange({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        {
          id: Date.now().toString(),
          position: "",
          company: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
    });
  };

  const removeExperience = (index: number) => {
    const newExperience = resumeData.experience.filter((_, i) => i !== index);
    onResumeDataChange({
      ...resumeData,
      experience: newExperience,
    });
  };

  const addEducation = () => {
    onResumeDataChange({
      ...resumeData,
      education: [
        ...resumeData.education,
        {
          id: Date.now().toString(),
          degree: "",
          field: "",
          institution: "",
          startDate: "",
          endDate: "",
          current: false,
          gpa: "",
        },
      ],
    });
  };

  const removeEducation = (index: number) => {
    const newEducation = resumeData.education.filter((_, i) => i !== index);
    onResumeDataChange({
      ...resumeData,
      education: newEducation,
    });
  };

  const addProject = () => {
    onResumeDataChange({
      ...resumeData,
      projects: [
        ...resumeData.projects,
        {
          id: Date.now().toString(),
          name: "",
          description: "",
          technologies: "",
        },
      ],
    });
  };

  const removeProject = (index: number) => {
    const newProjects = resumeData.projects.filter((_, i) => i !== index);
    onResumeDataChange({
      ...resumeData,
      projects: newProjects,
    });
  };

  const addCertification = () => {
    onResumeDataChange({
      ...resumeData,
      certifications: [
        ...resumeData.certifications,
        {
          id: Date.now().toString(),
          name: "",
          issuer: "",
          date: "",
        },
      ],
    });
  };

  const removeCertification = (index: number) => {
    const newCertifications = resumeData.certifications.filter((_, i) => i !== index);
    onResumeDataChange({
      ...resumeData,
      certifications: newCertifications,
    });
  };

  const handleGetSuggestionClick = async (section: string, content: string, itemId: string) => {
    try {
      await onGetSuggestion(section, content, itemId);
    } catch (err) {
      console.error("Error getting suggestion:", err);
    }
  };

  const switchSection = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeSection === "personal" ? "default" : "outline"}
          onClick={() => switchSection("personal")}
        >
          Personal Info
        </Button>
        <Button
          variant={activeSection === "summary" ? "default" : "outline"}
          onClick={() => switchSection("summary")}
        >
          Summary
        </Button>
        <Button
          variant={activeSection === "experience" ? "default" : "outline"}
          onClick={() => switchSection("experience")}
        >
          Experience
        </Button>
        <Button
          variant={activeSection === "education" ? "default" : "outline"}
          onClick={() => switchSection("education")}
        >
          Education
        </Button>
        <Button
          variant={activeSection === "skills" ? "default" : "outline"}
          onClick={() => switchSection("skills")}
        >
          Skills
        </Button>
        <Button
          variant={activeSection === "projects" ? "default" : "outline"}
          onClick={() => switchSection("projects")}
        >
          Projects
        </Button>
        <Button
          variant={activeSection === "certifications" ? "default" : "outline"}
          onClick={() => switchSection("certifications")}
        >
          Certifications
        </Button>
      </div>

      {activeSection === "personal" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={resumeData.personalInfo.fullName}
                onChange={(e) => handlePersonalInfoChange("fullName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={resumeData.personalInfo.email}
                onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={resumeData.personalInfo.phone}
                onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={resumeData.personalInfo.location}
                onChange={(e) => handlePersonalInfoChange("location", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={resumeData.personalInfo.website}
                onChange={(e) => handlePersonalInfoChange("website", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={resumeData.personalInfo.linkedin}
                onChange={(e) => handlePersonalInfoChange("linkedin", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                value={resumeData.personalInfo.github}
                onChange={(e) => handlePersonalInfoChange("github", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {activeSection === "summary" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="summary">Professional Summary</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGetSuggestionClick("summary", resumeData.summary, "summary")}
                disabled={isLoading && activeSuggestionId === "summary"}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {isLoading && activeSuggestionId === "summary" ? "Loading..." : "Get AI Suggestions"}
              </Button>
            </div>
            <Textarea
              id="summary"
              value={resumeData.summary}
              onChange={(e) => handleSummaryChange(e.target.value)}
              rows={4}
            />
            {activeSuggestionId === "summary" && error && (
              <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            {activeSuggestionId === "summary" && suggestion && (
              <div className="p-4 text-sm bg-blue-50 rounded-md">
                <h4 className="font-medium text-blue-700 mb-2">AI Suggestions:</h4>
                <div className="text-blue-600 whitespace-pre-line">{suggestion}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === "experience" && (
        <div className="space-y-4">
          {resumeData.experience.map((exp, index) => {
            const itemId = `experience-${exp.id}`;
            return (
              <div key={exp.id} className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Experience {index + 1}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeExperience(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`position-${index}`}>Position</Label>
                    <Input
                      id={`position-${index}`}
                      value={exp.position}
                      onChange={(e) => handleExperienceChange(index, "position", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`company-${index}`}>Company</Label>
                    <Input
                      id={`company-${index}`}
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                    <Input
                      id={`startDate-${index}`}
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`endDate-${index}`}>End Date</Label>
                    <Input
                      id={`endDate-${index}`}
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                      disabled={exp.current}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => handleExperienceChange(index, "current", e.target.checked)}
                      />
                      <span>I currently work here</span>
                    </Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor={`description-${index}`}>Description</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGetSuggestionClick("experience", exp.description, itemId)}
                      disabled={isLoading && activeSuggestionId === itemId}
                    >
                      <Wand2 className="h-4 w-4 mr-2" />
                      {isLoading && activeSuggestionId === itemId ? "Loading..." : "Get AI Suggestions"}
                    </Button>
                  </div>
                  <Textarea
                    id={`description-${index}`}
                    value={exp.description}
                    onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                    rows={4}
                  />
                  {activeSuggestionId === itemId && error && (
                    <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">
                      {error}
                    </div>
                  )}
                  {activeSuggestionId === itemId && suggestion && (
                    <div className="p-4 text-sm bg-blue-50 rounded-md">
                      <h4 className="font-medium text-blue-700 mb-2">AI Suggestions:</h4>
                      <div className="text-blue-600 whitespace-pre-line">{suggestion}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <Button onClick={addExperience} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </div>
      )}

      {activeSection === "education" && (
        <div className="space-y-4">
          {resumeData.education.map((edu, index) => {
            const itemId = `education-${edu.id}`;
            return (
              <div key={edu.id} className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Education {index + 1}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeEducation(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`degree-${index}`}>Degree</Label>
                    <Input
                      id={`degree-${index}`}
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`field-${index}`}>Field of Study</Label>
                    <Input
                      id={`field-${index}`}
                      value={edu.field}
                      onChange={(e) => handleEducationChange(index, "field", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`institution-${index}`}>Institution</Label>
                    <Input
                      id={`institution-${index}`}
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`gpa-${index}`}>GPA</Label>
                    <Input
                      id={`gpa-${index}`}
                      value={edu.gpa}
                      onChange={(e) => handleEducationChange(index, "gpa", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                    <Input
                      id={`startDate-${index}`}
                      type="month"
                      value={edu.startDate}
                      onChange={(e) => handleEducationChange(index, "startDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`endDate-${index}`}>End Date</Label>
                    <Input
                      id={`endDate-${index}`}
                      type="month"
                      value={edu.endDate}
                      onChange={(e) => handleEducationChange(index, "endDate", e.target.value)}
                      disabled={edu.current}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={edu.current}
                        onChange={(e) => handleEducationChange(index, "current", e.target.checked)}
                      />
                      <span>I am currently studying here</span>
                    </Label>
                  </div>
                </div>
              </div>
            );
          })}
          <Button onClick={addEducation} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </div>
      )}

      {activeSection === "skills" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGetSuggestionClick("skills", resumeData.skills.join(", "), "skills")}
                disabled={isLoading && activeSuggestionId === "skills"}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {isLoading && activeSuggestionId === "skills" ? "Loading..." : "Get AI Suggestions"}
              </Button>
            </div>
            <Textarea
              id="skills"
              value={resumeData.skills.join(", ")}
              onChange={(e) => handleSkillsChange(e.target.value)}
              rows={4}
            />
            {activeSuggestionId === "skills" && error && (
              <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            {activeSuggestionId === "skills" && suggestion && (
              <div className="p-4 text-sm bg-blue-50 rounded-md">
                <h4 className="font-medium text-blue-700 mb-2">AI Suggestions:</h4>
                <div className="text-blue-600 whitespace-pre-line">{suggestion}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === "projects" && (
        <div className="space-y-4">
          {resumeData.projects.map((proj, index) => {
            const itemId = `project-${proj.id}`;
            return (
              <div key={proj.id} className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Project {index + 1}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeProject(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${index}`}>Project Name</Label>
                    <Input
                      id={`name-${index}`}
                      value={proj.name}
                      onChange={(e) => handleProjectsChange(index, "name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`technologies-${index}`}>Technologies Used</Label>
                    <Input
                      id={`technologies-${index}`}
                      value={proj.technologies}
                      onChange={(e) => handleProjectsChange(index, "technologies", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor={`description-${index}`}>Description</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGetSuggestionClick("projects", proj.description, itemId)}
                      disabled={isLoading && activeSuggestionId === itemId}
                    >
                      <Wand2 className="h-4 w-4 mr-2" />
                      {isLoading && activeSuggestionId === itemId ? "Loading..." : "Get AI Suggestions"}
                    </Button>
                  </div>
                  <Textarea
                    id={`description-${index}`}
                    value={proj.description}
                    onChange={(e) => handleProjectsChange(index, "description", e.target.value)}
                    rows={4}
                  />
                  {activeSuggestionId === itemId && error && (
                    <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">
                      {error}
                    </div>
                  )}
                  {activeSuggestionId === itemId && suggestion && (
                    <div className="p-4 text-sm bg-blue-50 rounded-md">
                      <h4 className="font-medium text-blue-700 mb-2">AI Suggestions:</h4>
                      <div className="text-blue-600 whitespace-pre-line">{suggestion}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <Button onClick={addProject} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
      )}

      {activeSection === "certifications" && (
        <div className="space-y-4">
          {resumeData.certifications.map((cert, index) => {
            const itemId = `certification-${cert.id}`;
            return (
              <div key={cert.id} className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Certification {index + 1}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeCertification(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${index}`}>Certification Name</Label>
                    <Input
                      id={`name-${index}`}
                      value={cert.name}
                      onChange={(e) => handleCertificationsChange(index, "name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`issuer-${index}`}>Issuing Organization</Label>
                    <Input
                      id={`issuer-${index}`}
                      value={cert.issuer}
                      onChange={(e) => handleCertificationsChange(index, "issuer", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`date-${index}`}>Date</Label>
                    <Input
                      id={`date-${index}`}
                      type="month"
                      value={cert.date}
                      onChange={(e) => handleCertificationsChange(index, "date", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          <Button onClick={addCertification} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Certification
          </Button>
        </div>
      )}
    </div>
  );
}