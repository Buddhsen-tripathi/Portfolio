export function renderClassicTemplate(doc: PDFKit.PDFDocument, data: any, sections: { id: string, visible: boolean }[]) {
  const font = 'DejaVuSans';
  const fontBold = 'DejaVuSans-Bold';
  const fontOblique = 'DejaVuSans-Oblique';
  const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  // Helper to format dates as 'Month Year'
  function formatDate(dateString: string) {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  // Header: Name (centered, 18pt, bold)
  doc.font(fontBold).fontSize(18).fillColor('#111')
    .text(data.personalInfo.fullName || 'Your Name', {
      align: 'center',
      continued: false,
    });
  doc.moveDown(0.2);

  // Contact Info (centered, 11pt, black)
  const contactLine = [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
  ].filter(Boolean).join('   ');
  if (contactLine) {
    doc.font(font).fontSize(11).fillColor('#111')
      .text(contactLine, { align: 'center' });
    doc.moveDown(0.2);
  }

  // Links (centered, blue, not underlined, all in one line)
  const linkParts = [];
  if (data.personalInfo.website) linkParts.push({ text: "Website", url: data.personalInfo.website });
  if (data.personalInfo.linkedin) linkParts.push({ text: "LinkedIn", url: data.personalInfo.linkedin });
  if (data.personalInfo.github) linkParts.push({ text: "Github", url: data.personalInfo.github });

  if (linkParts.length) {
    // Calculate total width for centering
    const separator = "   ";
    const totalText = linkParts.map(l => l.text).join(separator);
    const totalWidth = doc.widthOfString(totalText);
    let x = doc.page.margins.left + (contentWidth - totalWidth) / 2;
    const y = doc.y;

    linkParts.forEach((link, i) => {
      doc.font(font).fontSize(11).fillColor('#2563eb')
        .text(link.text, x, y, { link: link.url, underline: false, continued: false });
      x += doc.widthOfString(link.text);
      if (i < linkParts.length - 1) {
        doc.font(font).fontSize(11).fillColor('#111')
          .text(separator, x, y, { continued: false });
        x += doc.widthOfString(separator);
      }
    });
    doc.moveDown(0.2);
  }

  // Black border-bottom under header (matches React border)
  const headerY = doc.y + 4;
  doc.moveTo(doc.page.margins.left, headerY)
    .lineTo(doc.page.width - doc.page.margins.right, headerY)
    .strokeColor('#111').lineWidth(2).stroke();
  doc.moveDown(0.8);

  // Section heading helper (with more precise spacing)
  function section(title: string) {
    doc.moveDown(0.5);
    doc.font(fontBold).fontSize(14).fillColor('#111').text(
      title.toUpperCase(),
      doc.page.margins.left,
      doc.y,
      {
        width: contentWidth,
        align: 'left',
        characterSpacing: 1.5,
      }
    );
    doc.y += 8; // mb-2 (8px) below heading
    doc.font(font).fontSize(11).fillColor('#111');
  }

  function ensureSpace(doc: PDFKit.PDFDocument, neededHeight: number) {
    if (doc.y + neededHeight > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
      doc.y = doc.page.margins.top;
    }
  }

  // Render sections
  sections.filter(s => s.visible).forEach(sectionObj => {
    const id = sectionObj.id;
    if (id === 'summary' && data.summary) {
      const summaryHeight = doc.heightOfString(data.summary, {
        width: contentWidth,
        align: 'left'
      }) + 14 + 8 + 24; // heading + mb-2 + mb-6
      ensureSpace(doc, summaryHeight);
      section('Summary');
      doc.text(data.summary, doc.page.margins.left, doc.y, {
        width: contentWidth,
        align: 'left'
      });
      doc.y += 24; // mb-6
    }
    if (id === 'experience' && data.experience && data.experience.length) {
      section('Experience');
      doc.y += 8; // mb-2
      data.experience.forEach((exp: any) => {
        // Estimate height for this entry
        const entryHeight =
          doc.heightOfString(exp.position, { width: contentWidth * 0.65 }) +
          doc.heightOfString(exp.company, { width: contentWidth * 0.65 }) +
          doc.heightOfString(`${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`, { width: contentWidth * 0.32 }) +
          doc.heightOfString(exp.description, { width: contentWidth }) +
          16; // mb-4
        ensureSpace(doc, entryHeight);

        doc.save();
        const startY = doc.y;
        const lineHeight = doc.currentLineHeight();

        // Left: Position (bold) and Company (italic)
        doc.font(fontBold).fontSize(12).fillColor('#111')
          .text(exp.position, doc.page.margins.left, startY, {
            width: contentWidth * 0.65,
            continued: false,
          });
        doc.font(fontOblique).fontSize(11).fillColor('#111')
          .text(exp.company, doc.page.margins.left, startY + lineHeight, {
            width: contentWidth * 0.65,
            continued: false,
          });

        // Right: Dates
        doc.font(font).fontSize(11).fillColor('#111');
        const rightText = `${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`;
        doc.text(rightText, doc.page.margins.left + contentWidth * 0.68, startY, {
          align: 'right',
          width: contentWidth * 0.32,
          continued: false,
        });

        doc.y = startY + 2 * lineHeight;
        doc.moveDown(0.25);
        doc.font(font).fontSize(11).fillColor('#111')
          .text(exp.description, doc.page.margins.left, doc.y, {
            width: contentWidth,
            align: 'left'
          });
        doc.y += 16; // mb-4
        doc.restore();
      });
      doc.y += 16; // mb-6 after section
    }
    if (id === 'education' && data.education && data.education.length) {
      section('Education');
      data.education.forEach((edu: any) => {
        doc.save();
        const startY = doc.y;
        const lineHeight = doc.currentLineHeight();

        // Left: Degree in Field (bold) and Institution (italic)
        doc.font(fontBold).fontSize(12).fillColor('#111')
          .text(`${edu.degree} in ${edu.field}`, doc.page.margins.left, startY, {
            width: contentWidth * 0.65,
            continued: false,
          });
        doc.font(fontOblique).fontSize(11).fillColor('#111')
          .text(edu.institution, doc.page.margins.left, startY + lineHeight, {
            width: contentWidth * 0.65,
            continued: false,
          });

        // Right: Dates
        doc.font(font).fontSize(11).fillColor('#111');
        const rightText = `${formatDate(edu.startDate)} - ${edu.current ? 'Present' : formatDate(edu.endDate)}`;
        doc.text(rightText, doc.page.margins.left + contentWidth * 0.68, startY, {
          align: 'right',
          width: contentWidth * 0.32,
          continued: false,
        });

        doc.y = startY + 2 * lineHeight;
        if (edu.gpa) {
          doc.moveDown(0.2);
          doc.font(font).fontSize(11).fillColor('#111')
            .text(`GPA: ${edu.gpa}`, doc.page.margins.left, doc.y, {
              width: contentWidth,
              align: 'left'
            });
        }
        doc.y += 16; // mb-4 (16px) below each entry
        doc.restore();
      });
    }
    if (id === 'skills' && data.skills && data.skills.length) {
      section('Skills');
      const pillPaddingX = 6;
      const pillPaddingY = 2;
      let x = doc.page.margins.left;
      let y = doc.y;
      const pillHeight = 18;
      const gap = 8; // gap-2 (8px)
      const maxRowWidth = contentWidth * 0.75;

      data.skills.forEach((skill: string) => {
        const textWidth = doc.widthOfString(skill) + pillPaddingX * 2;
        if (x + textWidth > doc.page.margins.left + maxRowWidth) {
          x = doc.page.margins.left;
          y += pillHeight + gap;
        }
        doc.rect(x, y, textWidth, pillHeight - 4).strokeColor('#111').lineWidth(1).stroke();
        doc.font(font).fontSize(11).fillColor('#111')
          .text(skill, x + pillPaddingX, y + pillPaddingY, {
            width: textWidth - pillPaddingX * 2,
            align: 'center',
            continued: false,
          });
        x += textWidth + gap;
      });
      doc.y = y + pillHeight + 8; // mb-6 (24px) below skills section
    }
    if (id === 'projects' && data.projects && data.projects.length) {
      section('Projects');
      data.projects.forEach((proj: any) => {
        doc.font(fontBold).fontSize(12).fillColor('#111')
          .text(proj.name, doc.page.margins.left, doc.y, {
            width: contentWidth,
            continued: false
          });
        doc.font(fontOblique).fontSize(11).fillColor('#111')
          .text(proj.technologies, doc.page.margins.left, doc.y, {
            width: contentWidth,
            continued: false
          });
        doc.font(font).fontSize(11).fillColor('#111')
          .text(proj.description, doc.page.margins.left, doc.y, {
            width: contentWidth,
            align: 'left',
            continued: false
          });
        doc.y += 16; // mb-4 (16px) below each entry
      });
    }
    if (id === 'certifications' && data.certifications && data.certifications.length) {
      section('Certifications');
      data.certifications.forEach((cert: any) => {
        doc.save();
        const startY = doc.y;
        const lineHeight = doc.currentLineHeight();
        doc.font(fontBold).fontSize(12).fillColor('#111')
          .text(cert.name, doc.page.margins.left, startY, {
            width: contentWidth * 0.65,
            continued: false,
          });
        doc.font(fontOblique).fontSize(11).fillColor('#111')
          .text(cert.issuer, doc.page.margins.left, startY + lineHeight, {
            width: contentWidth * 0.65,
            continued: false,
          });
        doc.font(font).fontSize(11).fillColor('#111');
        const rightText = `${formatDate(cert.date)}`;
        doc.text(rightText, doc.page.margins.left + contentWidth * 0.68, startY, {
          align: 'right',
          width: contentWidth * 0.32,
          continued: false,
        });
        doc.y = startY + 2 * lineHeight;
        doc.y += 16; // mb-4 (16px) below each entry
        doc.restore();
      });
    }
  });
}