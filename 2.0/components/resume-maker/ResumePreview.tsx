"use client";

import { useRef, useState } from "react";
import { ResumeData } from "@/app/craftfolio/page";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";
import ProfessionalTemplate from "./templates/ProfessionalTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";

interface Section {
  id: string;
  visible: boolean;
}

interface ResumePreviewProps {
  resumeData: ResumeData;
  template: "modern" | "classic" | "minimal" | "professional";
  onExportPDF: () => void;
  sections: Section[];
  showPreview?: boolean;
}

const templateMap = {
  professional: ProfessionalTemplate,
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
};

export default function ResumePreview({ resumeData, template, onExportPDF, sections, showPreview = true }: ResumePreviewProps) {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = async () => {
    if (resumeRef.current) {
      setExporting(true);
      try {
        const canvas = await html2canvas(resumeRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          width: 793, // A4 width in pixels at 96 DPI
          height: 1122, // A4 height in pixels at 96 DPI
          windowWidth: 793,
          windowHeight: 1122
        });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });
        pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
        pdf.save(`${resumeData.personalInfo.fullName || "resume"}.pdf`);
        onExportPDF();
      } finally {
        setExporting(false);
      }
    }
  };

  if (!showPreview) return null;

  const TemplateComponent = templateMap[template] || ProfessionalTemplate;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Tooltip content="Export your resume as a PDF">
          <Button onClick={handleExportPDF} className="flex items-center gap-2" disabled={exporting}>
            {exporting ? (
              <span className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></span>
            ) : (
              <Download className="w-4 h-4" />
            )}
            Export PDF
          </Button>
        </Tooltip>
      </div>
      <div 
        ref={resumeRef}
        className={cn(
          "w-[210mm] min-h-[297mm] mx-auto bg-white shadow-lg p-8 border border-gray-200 rounded-lg text-black print:shadow-none print:border-none",
          template === "modern" && "font-sans",
          template === "classic" && "font-serif",
          template === "minimal" && "font-sans",
          template === "professional" && "font-sans"
        )}
        style={{ boxSizing: 'border-box' }}
      >
        <TemplateComponent resumeData={resumeData} sections={sections} />
      </div>
    </div>
  );
}