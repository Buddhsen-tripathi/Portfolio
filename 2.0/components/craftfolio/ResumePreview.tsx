"use client";

import React from "react";
import { useRef, useState, useEffect } from "react";
import { ResumeData } from "@/app/craftfolio/page";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import ProfessionalTemplate from "./templates/ProfessionalTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";

interface Section {
  id: string;
  visible: boolean;
}

interface ResumePreviewProps {
  resumeData: ResumeData;
  template: "professional"; //Add more templates as needed (classic etc)
  onExportPDF: () => void;
  sections: Section[];
  showPreview?: boolean;
}

const templateMap = {
  professional: ProfessionalTemplate,
  classic: ClassicTemplate,
};

const PAGE_WIDTH = 794; // px
const PAGE_HEIGHT = 1123; // px
const PADDING_X = 32; // px
const PADDING_Y = 48; // px
const EXTRA_BOTTOM_BUFFER = 32; // px, extra space to reserve at bottom

// Helper to split sections into pages for preview with smarter page breaks
function splitSectionsIntoPages(content: HTMLElement, pageHeight: number): HTMLElement[] {
  const pages: HTMLElement[] = [];
  let currentPage = document.createElement('div');
  currentPage.style.height = `${pageHeight}px`;
  currentPage.style.position = 'relative';
  currentPage.style.overflow = 'hidden';
  let currentHeight = 0;
  
  // Only select direct children with data-section-id (atomic blocks)
  const sections = Array.from(content.querySelectorAll('[data-section-id]'));
  
  sections.forEach((section) => {
    const sectionEl = section as HTMLElement;
    const style = window.getComputedStyle(sectionEl);
    const mt = parseFloat(style.marginTop) || 0;
    const mb = parseFloat(style.marginBottom) || 0;
    const sectionHeight = sectionEl.offsetHeight + mt + mb;

    const sectionId = sectionEl.getAttribute('data-section-id');
    
    // Check if adding this section would overflow the page
    if (currentHeight + sectionHeight > pageHeight && currentHeight > 0) {
      pages.push(currentPage);
      currentPage = document.createElement('div');
      currentPage.style.height = `${pageHeight}px`;
      currentPage.style.position = 'relative';
      currentPage.style.overflow = 'hidden';
      currentHeight = 0;
    }
    
    // Clone the section to avoid modifying the original
    const clonedSection = sectionEl.cloneNode(true) as HTMLElement;
    
    // Add page-break-inside: avoid to critical sections
    if (sectionId === "summary" || sectionId === "skills") {
      clonedSection.style.pageBreakInside = 'avoid';
    }
    
    currentPage.appendChild(clonedSection);
    currentHeight += sectionHeight;
  });
  
  if (currentPage.childNodes.length > 0) {
    pages.push(currentPage);
  }
  
  return pages;
}

export default function ResumePreview({ resumeData, template, onExportPDF, sections, showPreview = true }: ResumePreviewProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [pages, setPages] = useState<React.ReactNode[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showAllPagesForExport, setShowAllPagesForExport] = useState(false);

  const TemplateComponent = templateMap[template] || ProfessionalTemplate;

  // Split content into pages for preview (by section)
  useEffect(() => {
    if (!contentRef.current) return;
    const tempContainer = document.createElement('div');
    tempContainer.style.width = `${PAGE_WIDTH - PADDING_X * 2}px`;
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.visibility = 'visible';
    tempContainer.style.padding = `${PADDING_Y}px ${PADDING_X}px`;
    document.body.appendChild(tempContainer);
    tempContainer.innerHTML = contentRef.current.innerHTML;
    // Split by section blocks
    const availableHeight = PAGE_HEIGHT - PADDING_Y * 2 - EXTRA_BOTTOM_BUFFER;
    const splitPages = splitSectionsIntoPages(tempContainer, availableHeight);
    setPageCount(splitPages.length);
    setPages(
      splitPages.map((page, idx) => (
        <div
          key={idx}
          className="resume-page a4-page mx-auto bg-white shadow-lg border-2 border-blue-300 rounded-lg text-black print:shadow-none print:border-none"
          style={{
            width: `${PAGE_WIDTH}px`,
            minHeight: `${PAGE_HEIGHT}px`,
            maxWidth: `${PAGE_WIDTH}px`,
            maxHeight: `${PAGE_HEIGHT}px`,
            boxSizing: 'border-box',
            overflow: 'hidden',
            position: 'relative',
            marginBottom: '32px',
            pageBreakAfter: 'always',
            breakAfter: 'page',
            padding: `${PADDING_Y}px ${PADDING_X}px`,
          }}
          dangerouslySetInnerHTML={{ __html: page.innerHTML }}
        />
      ))
    );
    setCurrentPage(0); // Reset to first page on data/template change
    document.body.removeChild(tempContainer);
  }, [resumeData, template, sections]);

  // Export PDF using server API
  const handleServerExportPDF = async () => {
    const response = await fetch('/api/export-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeData, template, sections }),
    });
    if (!response.ok) {
      alert('Failed to export PDF');
      return;
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.personalInfo.fullName || 'resume'}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  if (!showPreview) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2 pb-2">
        <Button onClick={handleServerExportPDF} className="flex items-center gap-2" variant="default">
          <Download className="w-4 h-4" />
          Export PDF
        </Button>
      </div>
      <div className="flex justify-end items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage + 1} of {pages.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, pages.length - 1))}
                disabled={currentPage === pages.length - 1}
              >
                Next
              </Button>
            </div>
      {/* Hidden content for measuring/splitting */}
      <div style={{ display: 'none' }}>
        <div
          ref={contentRef}
          className={cn(
            "resume-content w-full h-full",
            // template === "classic" && "font-serif",
            template === "professional" && "font-sans"
          )}
          style={{
            padding: `${PADDING_Y}px ${PADDING_X}px`,
            width: `${PAGE_WIDTH - PADDING_X * 2}px`,
            minHeight: `${PAGE_HEIGHT - PADDING_Y * 2}px`,
          }}
        >
          <TemplateComponent resumeData={resumeData} sections={sections} />
        </div>
      </div>
      {/* Preview pages */}
      <div className="p-8">
        {pages.length > 0 && (
          <>
            {pages.map((page, idx) => (
              <div
                key={idx}
                style={
                  showAllPagesForExport || idx === currentPage
                    ? { visibility: 'visible' }
                    : { display: 'none' }
                }
                className="resume-page-container
                           w-[794px] h-[1123px]
                           overflow-hidden
                           mx-auto
                           relative"
              >
                {page}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}