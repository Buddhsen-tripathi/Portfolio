"use client";

import React from "react";
import { useRef, useState, useEffect } from "react";
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

const PAGE_WIDTH = 794; // px
const PAGE_HEIGHT = 1123; // px
const PADDING_X = 32; // px
const PADDING_Y = 48; // px

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
    const sectionHeight = sectionEl.offsetHeight;
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
    const splitPages = splitSectionsIntoPages(tempContainer, PAGE_HEIGHT - PADDING_Y * 2);
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
            background: '#f8fafc',
          }}
          dangerouslySetInnerHTML={{ __html: page.innerHTML }}
        />
      ))
    );
    setCurrentPage(0); // Reset to first page on data/template change
    document.body.removeChild(tempContainer);
  }, [resumeData, template, sections]);

  // PDF export: render each page to canvas and add to PDF with improved quality
  const handleExportPDF = async () => {
    setShowAllPagesForExport(true);
    await new Promise((resolve) => setTimeout(resolve, 100)); // let DOM update
    setExporting(true);
    try {
      // Make sure fonts are loaded before rendering
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      // Select the actually rendered .resume-page elements
      const pageDivs = Array.from(document.querySelectorAll('.resume-page')) as HTMLDivElement[];
      if (!pageDivs.length) {
        setExporting(false);
        setShowAllPagesForExport(false);
        return;
      }

      // Create PDF with proper settings
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [PAGE_WIDTH, PAGE_HEIGHT],
        hotfixes: ["px_scaling"],
      });

      // Process each page
      for (let i = 0; i < pageDivs.length; i++) {
        // Apply fixes to ensure text is rendered as black
        const pageDiv = pageDivs[i];
        const textElements = pageDiv.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span');
        textElements.forEach(el => {
          if (window.getComputedStyle(el as HTMLElement).color !== 'rgb(0, 0, 0)') {
            (el as HTMLElement).style.color = 'rgb(0, 0, 0)';
          }
        });

        // Make sure links are preserved with blue color
        const links = pageDiv.querySelectorAll('a');
        links.forEach(link => {
          link.style.color = '#2563eb'; // Blue color
        });

        // Render to canvas with optimized settings
        const pageCanvas = await html2canvas(pageDiv, {
          scale: 2.0, // Higher scale for better quality
          useCORS: true,
          logging: false,
          width: PAGE_WIDTH,
          height: PAGE_HEIGHT,
          windowWidth: PAGE_WIDTH,
          windowHeight: PAGE_HEIGHT,
          backgroundColor: '#ffffff', // Ensure white background
          imageTimeout: 1500,
          onclone: (document) => {
            // Fix font rendering in the cloned document
            const style = document.createElement('style');
            style.innerHTML = `
              * {
                font-family: Helvetica, Arial, sans-serif !important;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
            `;
            document.head.appendChild(style);
            return document;
          }
        });

        // Add to PDF with proper quality settings
        const imgData = pageCanvas.toDataURL("image/png", 1.0);
        if (i > 0) pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT], 'portrait');
        pdf.addImage(imgData, "PNG", 0, 0, PAGE_WIDTH, PAGE_HEIGHT, undefined, 'FAST');
      }

      // Save PDF with proper filename
      const firstName = resumeData.personalInfo.fullName?.split(' ')[0] || '';
      const lastName = resumeData.personalInfo.fullName?.split(' ').slice(1).join(' ') || '';
      const fileName = resumeData.personalInfo.fullName 
        ? `${firstName}_${lastName}_Resume.pdf`
        : "resume.pdf";

      pdf.save(fileName);
      onExportPDF();
    } finally {
      setExporting(false);
      setShowAllPagesForExport(false);
    }
  };

  if (!showPreview) return null;

  return (
    <div className="space-y-4 print-resume-root">
      <div className="flex justify-end gap-2 print:hidden">
        <Tooltip content="Export your resume as a PDF (screenshot of what you see)">
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
      {/* Hidden content for measuring/splitting */}
      <div style={{ display: 'none' }}>
        <div
          ref={contentRef}
          className={cn(
            "resume-content w-full h-full",
            template === "modern" && "font-sans",
            template === "classic" && "font-serif",
            template === "minimal" && "font-sans",
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
      {/* Render only the current page for preview */}
      {pages.length > 0 && (
        <div>
          {pages.map((page, idx) => (
            <div
              key={idx}
              style={
                showAllPagesForExport || idx === currentPage
                  ? { visibility: 'visible', position: 'relative', width: '100%' }
                  : { display: 'none' }
              }
              className="resume-page-container"
            >
              {page}
            </div>
          ))}
          <div className="flex justify-center items-center gap-4 mt-2 print:hidden">
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
        </div>
      )}
    </div>
  );
}