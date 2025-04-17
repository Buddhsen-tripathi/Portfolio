import { NextRequest } from 'next/server';
import PDFDocument from 'pdfkit';
import { promises as fs } from 'fs';
import path from 'path';
import { renderClassicTemplate } from './classic-pdf';
import { renderProfessionalTemplate } from './professional-pdf';

export const config = {
  api: {
    bodyParser: { sizeLimit: '2mb' },
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeData, template = 'professional', sections = [] } = body;
    if (!resumeData) {
      return new Response(JSON.stringify({ error: 'Missing resume data' }), { status: 400 });
    }

    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const fontPath = path.join(process.cwd(), 'public', 'font', 'DejaVuSans.ttf');
    const fontBoldPath = path.join(process.cwd(), 'public', 'font', 'DejaVuSans-Bold.ttf');
    const fontObliquePath = path.join(process.cwd(), 'public', 'font', 'DejaVuSans-Oblique.ttf');

    // Verify font files exist
    await fs.access(fontPath).catch(() => { throw new Error('DejaVuSans.ttf not found'); });
    await fs.access(fontBoldPath).catch(() => { throw new Error('DejaVuSans-Bold.ttf not found'); });
    await fs.access(fontObliquePath).catch(() => { throw new Error('DejaVuSans-Oblique.ttf not found'); });

    doc.registerFont('DejaVuSans', fontPath);
    doc.registerFont('DejaVuSans-Bold', fontBoldPath);
    doc.registerFont('DejaVuSans-Oblique', fontObliquePath);
    doc.font('DejaVuSans');
    doc.info.Title = `${resumeData.personalInfo?.fullName || 'Resume'}`;
    doc.info.Author = resumeData.personalInfo?.fullName || '';

    if (template === 'classic') {
      renderClassicTemplate(doc, resumeData, sections);
    } else if (template === 'professional') {
      renderProfessionalTemplate(doc, resumeData, sections);
    } else {
      return new Response(JSON.stringify({ error: 'Invalid template' }), { status: 400 });
    }
    doc.end();

    // Stream the PDF to a buffer
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    await new Promise((resolve) => doc.on('end', resolve));
    const pdfBuffer = Buffer.concat(chunks);

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${resumeData.personalInfo?.fullName || 'resume'}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate PDF' }), { status: 500 });
  }
}