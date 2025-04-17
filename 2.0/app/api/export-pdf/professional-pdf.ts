export function renderProfessionalTemplate(doc: PDFKit.PDFDocument, data: any, sections: {id: string, visible: boolean}[]) {
  doc.fontSize(24).font('DejaVuSans-Bold').text(data.personalInfo.fullName || 'Your Name', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(12).font('DejaVuSans').text(
    [data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].filter(Boolean).join(' | '),
    { align: 'center' }
  );
  doc.moveDown(0.5);
  let links = [];
  if (data.personalInfo.website) links.push(`🌐 ${data.personalInfo.website}`);
  if (data.personalInfo.linkedin) links.push(`in/${data.personalInfo.linkedin}`);
  if (data.personalInfo.github) links.push(`gh/${data.personalInfo.github}`);
  if (links.length) {
    doc.fontSize(11).fillColor('#2563eb').font('DejaVuSans')
      .text(links.join('   '), { align: 'center', link: data.personalInfo.website });
  }
  doc.moveDown(1);
  if (data.summary) {
    doc.fontSize(14).fillColor('#222').font('DejaVuSans-Bold').text('Professional Summary', { underline: true });
    doc.moveDown(0.2);
    doc.fontSize(11).font('DejaVuSans').fillColor('#222').text(data.summary);
    doc.moveDown(0.8);
  }
  if (data.experience && data.experience.length) {
    doc.fontSize(14).fillColor('#222').font('DejaVuSans-Bold').text('Experience', { underline: true });
    doc.moveDown(0.2);
    data.experience.forEach((exp: any) => {
      doc.fontSize(12).font('DejaVuSans-Bold').text(`${exp.position} at ${exp.company}`);
      doc.fontSize(11).font('DejaVuSans').text(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`);
      doc.fontSize(11).font('DejaVuSans').text(exp.description);
      doc.moveDown(0.5);
    });
    doc.moveDown(0.5);
  }
  if (data.education && data.education.length) {
    doc.fontSize(14).fillColor('#222').font('DejaVuSans-Bold').text('Education', { underline: true });
    doc.moveDown(0.2);
    data.education.forEach((edu: any) => {
      doc.fontSize(12).font('DejaVuSans-Bold').text(`${edu.degree} in ${edu.field}`);
      doc.fontSize(11).font('DejaVuSans').text(`${edu.institution} | ${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}`);
      if (edu.gpa) doc.fontSize(11).font('DejaVuSans').text(`GPA: ${edu.gpa}`);
      doc.moveDown(0.5);
    });
    doc.moveDown(0.5);
  }
  if (data.skills && data.skills.length) {
    doc.fontSize(14).fillColor('#222').font('DejaVuSans-Bold').text('Skills', { underline: true });
    doc.moveDown(0.2);
    doc.fontSize(11).font('DejaVuSans').text(data.skills.join(', '));
    doc.moveDown(0.5);
  }
  if (data.projects && data.projects.length) {
    doc.fontSize(14).fillColor('#222').font('DejaVuSans-Bold').text('Projects', { underline: true });
    doc.moveDown(0.2);
    data.projects.forEach((proj: any) => {
      doc.fontSize(12).font('DejaVuSans-Bold').text(proj.name);
      doc.fontSize(11).fillColor('#222').font('DejaVuSans').text(proj.technologies);
      doc.fontSize(11).fillColor('#222').font('DejaVuSans').text(proj.description);
      doc.moveDown(0.5);
    });
    doc.moveDown(0.5);
  }
  if (data.certifications && data.certifications.length) {
    doc.fontSize(14).fillColor('#222').font('DejaVuSans-Bold').text('Certifications', { underline: true });
    doc.moveDown(0.2);
    data.certifications.forEach((cert: any) => {
      doc.fontSize(12).font('DejaVuSans-Bold').text(cert.name);
      doc.fontSize(11).font('DejaVuSans').text(`${cert.issuer} | ${cert.date}`);
      doc.moveDown(0.5);
    });
  }
} 