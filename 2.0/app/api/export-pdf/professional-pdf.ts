export function renderProfessionalTemplate(
  doc: PDFKit.PDFDocument,
  data: any,
  sections: { id: string, visible: boolean }[]
) {
  const font = 'DejaVuSans';
  const fontBold = 'DejaVuSans-Bold';
  const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  function formatDate(dateString: string) {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  function ensureSpace(neededHeight: number) {
    if (doc.y + neededHeight > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
      doc.y = doc.page.margins.top;
    }
  }

  // --- Header ---
  doc.font(fontBold).fontSize(24).fillColor('#000')
    .text(data.personalInfo.fullName || 'Your Name', {
      align: 'center',
      width: contentWidth,
    });
  doc.y += 12; // mb-4

  // Contact Info (gray, 10pt, gap-4)
  const contactItems = [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
  ].filter(Boolean);
  if (contactItems.length) {
    const separator = "    ";
    doc.font(font).fontSize(11).fillColor('#6b7280')
      .text(contactItems.join(separator), doc.page.margins.left, doc.y, {
        align: 'center',
        width: contentWidth,
      });
    doc.y += 7; // mb-1
  }

  // Links (blue, 10pt, gap-4, mt-1)
  const linkParts = [];
  if (data.personalInfo.website) linkParts.push({ text: "Website", url: data.personalInfo.website });
  if (data.personalInfo.linkedin) linkParts.push({ text: "LinkedIn", url: data.personalInfo.linkedin });
  if (data.personalInfo.github) linkParts.push({ text: "GitHub", url: data.personalInfo.github });

  if (linkParts.length) {
    doc.y += 4; // mt-1
    const separator = "    ";
    const totalText = linkParts.map(l => l.text).join(separator);
    doc.font(font).fontSize(11);
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
    doc.y += 7; // mb-1
  }

  // Border-bottom and mb-4 (smaller)
  const headerY = doc.y + 2;
  doc.moveTo(doc.page.margins.left, headerY)
    .lineTo(doc.page.width - doc.page.margins.right, headerY)
    .strokeColor('#d1d5db').lineWidth(1).stroke();
  doc.y = headerY + 18; // mb-6

  // --- Section Heading Helper ---
  function section(title: string) {
    doc.font(fontBold).fontSize(14).fillColor('#000')
      .text(title.toUpperCase(), doc.page.margins.left, doc.y, {
        width: contentWidth,
        align: 'left',
        characterSpacing: 1.5,
      });
    doc.y += 12; // mb-4
    doc.font(font).fontSize(9.5).fillColor('#374151');
  }

  // --- Render Sections ---
  sections.filter(s => s.visible).forEach(sectionObj => {
    const id = sectionObj.id;

    // --- Summary ---
    if (id === 'summary' && data.summary) {
      const summaryHeight = doc.heightOfString(data.summary, { width: contentWidth, align: 'left' }) + 10 + 14; // text + heading + margin
      ensureSpace(summaryHeight);
      section('Summary');
      doc.font(font).fontSize(10).fillColor('#374151')
        .text(data.summary, doc.page.margins.left, doc.y, {
          width: contentWidth,
          align: 'left'
        });
      doc.y += 16; // mb-2
    }

    // --- Experience ---
    if (id === 'experience' && data.experience && data.experience.length) {
      let sectionHeight = 0;
      data.experience.forEach((exp: any) => {
        sectionHeight += 14; // heading margin
        sectionHeight += doc.heightOfString(exp.position, { width: contentWidth * 0.65 }) +
          doc.heightOfString(exp.company, { width: contentWidth * 0.65 }) +
          doc.heightOfString(`${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`, { width: contentWidth * 0.32 }) +
          doc.heightOfString(exp.description, { width: contentWidth }) +
          12 + 12; // header + desc + margin
      });
      ensureSpace(sectionHeight);
      section('Experience');
      data.experience.forEach((exp: any) => {
        doc.font(fontBold).fontSize(12).fillColor('#000')
          .text(exp.position, doc.page.margins.left, doc.y, { width: contentWidth * 0.65, continued: false });
        doc.font(font).fontSize(9.5).fillColor('#6b7280')
          .text(`${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`,
            doc.page.margins.left + contentWidth * 0.68, doc.y - 12, {
            width: contentWidth * 0.32,
            align: 'right',
            continued: false,
          });
        doc.font(fontBold).fontSize(11).fillColor('#374151')
          .text(exp.company, doc.page.margins.left, doc.y + 10, { width: contentWidth * 0.65, continued: false });
        doc.y += 12;
        doc.font(font).fontSize(9.5).fillColor('#374151')
          .text(exp.description, doc.page.margins.left, doc.y + 2, {
            width: contentWidth,
            align: 'left'
          });
        doc.y += 12;
      });
      doc.y += 12;
    }

    // --- Education ---
    if (id === 'education' && data.education && data.education.length) {
      let sectionHeight = 0;
      data.education.forEach((edu: any) => {
        sectionHeight += 14; // heading margin
        sectionHeight += doc.heightOfString(`${edu.degree} in ${edu.field}`, { width: contentWidth * 0.65 }) +
          doc.heightOfString(edu.institution, { width: contentWidth * 0.65 }) +
          doc.heightOfString(`${formatDate(edu.startDate)} - ${edu.current ? 'Present' : formatDate(edu.endDate)}`, { width: contentWidth * 0.32 }) +
          (edu.gpa ? doc.heightOfString(`GPA: ${edu.gpa}`, { width: contentWidth }) : 0) +
          10 + 8;
      });
      ensureSpace(sectionHeight);
      section('Education');
      data.education.forEach((edu: any) => {
        doc.font(fontBold).fontSize(12).fillColor('#000')
          .text(`${edu.degree} in ${edu.field}`, doc.page.margins.left, doc.y - 1, {
            width: contentWidth * 0.65,
            continued: false,
          });
        doc.font(font).fontSize(10).fillColor('#6b7280')
          .text(`${formatDate(edu.startDate)} - ${edu.current ? 'Present' : formatDate(edu.endDate)}`,
            doc.page.margins.left + contentWidth * 0.68, doc.y - 10, {
            width: contentWidth * 0.32,
            align: 'right',
            continued: false,
          });

        doc.font(fontBold).fontSize(10).fillColor('#374151')
          .text(edu.institution, doc.page.margins.left, doc.y + 8, {
            width: contentWidth * 0.65,
            continued: false,
          });

        doc.y += 4;
        if (edu.gpa) {
          doc.font(font).fontSize(9.5).fillColor('#374151')
            .text(`GPA: ${edu.gpa}`, doc.page.margins.left, doc.y, {
              width: contentWidth,
              align: 'left'
            });
          doc.y += 8;
        }
        doc.y += 8;
      });
      doc.y += 4;
    }

    // --- Skills ---
    if (id === 'skills' && data.skills && data.skills.length) {
      // Estimate height for all skills rows
      const skillsRows = Math.ceil(data.skills.length / 2);
      const skillsHeight = 14 + (skillsRows * 16) + 28; // heading + rows + margin
      ensureSpace(skillsHeight);
      section('Skills');
      const colWidth = (contentWidth - 8) / 2; // 4pt gap
      let x = doc.page.margins.left;
      let y = doc.y + 2;
      let col = 0;
      data.skills.forEach((skill: string) => {
        if (col === 2) {
          col = 0;
          x = doc.page.margins.left;
          y += 16; // row height + gap
        }
        doc.circle(x + 4, y + 5, 2).fill('#9ca3af').stroke();
        doc.font(font).fontSize(9.5).fillColor('#374151')
          .text(skill, x + 10, y, {
            width: colWidth - 10,
            align: 'left',
            continued: false,
          });
        x += colWidth + 8;
        col++;
      });
      doc.y = y + 28;
    }

    // --- Projects ---
    if (id === 'projects' && data.projects && data.projects.length) {
      let sectionHeight = 0;
      data.projects.forEach((proj: any) => {
        sectionHeight += 14; // heading margin
        sectionHeight += doc.heightOfString(proj.name, { width: contentWidth }) +
          doc.heightOfString(proj.technologies, { width: contentWidth }) +
          doc.heightOfString(proj.description, { width: contentWidth }) +
          10 + 8;
      });
      ensureSpace(sectionHeight);
      section('Projects');
      data.projects.forEach((proj: any) => {
        doc.font(fontBold).fontSize(11.25).fillColor('#000')
          .text(proj.name, doc.page.margins.left, doc.y + 4, {
            width: contentWidth,
            continued: false
          });
        doc.font(font).fontSize(10).fillColor('#6b7280')
          .text(proj.technologies, doc.page.margins.left, doc.y + 2, {
            width: contentWidth,
            continued: false
          });
        doc.font(font).fontSize(9.5).fillColor('#374151')
          .text(proj.description, doc.page.margins.left, doc.y + 2, {
            width: contentWidth,
            align: 'left',
            continued: false
          });
        doc.y += 8;
      });
      doc.y += 12;
    }

    // --- Certifications ---
    if (id === 'certifications' && data.certifications && data.certifications.length) {
      let sectionHeight = 0;
      data.certifications.forEach((cert: any) => {
        sectionHeight += 14; // heading margin
        sectionHeight += doc.heightOfString(cert.name, { width: contentWidth * 0.65 }) +
          doc.heightOfString(cert.issuer, { width: contentWidth * 0.65 }) +
          doc.heightOfString(formatDate(cert.date), { width: contentWidth * 0.32 }) +
          10 + 8;
      });
      ensureSpace(sectionHeight);
      section('Certifications');
      data.certifications.forEach((cert: any) => {
        doc.font(fontBold).fontSize(11.25).fillColor('#000')
          .text(cert.name, doc.page.margins.left, doc.y, {
            width: contentWidth * 0.65,
            continued: false,
          });
        doc.font(font).fontSize(9.5).fillColor('#6b7280')
          .text(formatDate(cert.date),
            doc.page.margins.left + contentWidth * 0.68, doc.y - 10, {
            width: contentWidth * 0.32,
            align: 'right',
            continued: false,
        });  
        doc.font(fontBold).fontSize(10).fillColor('#374151')
          .text(cert.issuer, doc.page.margins.left, doc.y + 10, {
            width: contentWidth * 0.65,
            continued: false,
          });
        doc.y += 18;
        doc.y += 8;
      });
      doc.y += 10;
    }
  });
} 