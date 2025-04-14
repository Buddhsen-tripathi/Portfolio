import { ResumeData } from "@/app/craftfolio/page";

const RESUME_STORAGE_KEY = "resume_data";

export const saveResumeData = (data: ResumeData): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(data));
  }
};

export const loadResumeData = (): ResumeData | null => {
  if (typeof window !== "undefined") {
    const storedData = localStorage.getItem(RESUME_STORAGE_KEY);
    if (storedData) {
      try {
        return JSON.parse(storedData) as ResumeData;
      } catch (error) {
        console.error("Error parsing stored resume data:", error);
        return null;
      }
    }
  }
  return null;
};

export const clearResumeData = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(RESUME_STORAGE_KEY);
  }
}; 