import { jsPDF, GState } from 'jspdf';
import type { TailoredTipsResult } from './types';

export function generatePdfDocument(data: TailoredTipsResult) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Watermark function
  const addWatermark = () => {
    doc.saveGraphicsState();
    doc.setGState(new GState({ opacity: 0.05 }));
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(60);
    doc.text('JD ANALYZER', pageWidth / 2, pageHeight / 2, {
      angle: -45,
      align: 'center',
    });
    doc.restoreGraphicsState();
  };

  // Add initial watermark
  addWatermark();

  let y = 60;
  const margin = 40;
  const maxLineWidth = pageWidth - margin * 2;

  // Function to handle page breaks
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      addWatermark();
      y = 60;
      return true;
    }
    return false;
  };

  // Title
  doc.setFontSize(24);
  doc.setTextColor(33, 33, 33);
  doc.text('Tailored Resume Tips', margin, y);
  y += 40;

  // Executive Summary
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text('Executive Summary', margin, y);
  y += 20;
  
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  const summaryLines = doc.splitTextToSize(data.executive_summary, maxLineWidth);
  checkPageBreak(summaryLines.length * 15 + 20);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 15 + 30;

  // Bullet Point Rewrites
  checkPageBreak(40);
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text('Bullet Point Rewrites', margin, y);
  y += 25;

  data.bullet_point_rewrites.forEach((bullet) => {
    // Some bullets are separated by -> for Before/After
    const parts = bullet.split('->');
    let original = bullet;
    let rewrite = '';
    
    if (parts.length > 1) {
      original = parts[0].trim();
      rewrite = parts.slice(1).join('->').trim();
    }

    doc.setFontSize(10);
    doc.setTextColor(150, 50, 50); // Red-ish
    const origLines = doc.splitTextToSize(`Original: ${original}`, maxLineWidth);
    checkPageBreak(origLines.length * 14 + 20);
    doc.text(origLines, margin, y);
    y += origLines.length * 14 + 8;

    if (rewrite) {
      doc.setTextColor(50, 150, 50); // Green-ish
      const newLines = doc.splitTextToSize(`Suggested: ${rewrite}`, maxLineWidth);
      checkPageBreak(newLines.length * 14 + 15);
      doc.text(newLines, margin, y);
      y += newLines.length * 14 + 20;
    } else {
      y += 15;
    }
  });

  y += 10;

  // Interview Prep Focus
  checkPageBreak(40);
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text('Interview Prep Focus', margin, y);
  y += 25;

  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  data.interview_prep_focus.forEach((focus, i) => {
    const lines = doc.splitTextToSize(`${i + 1}. ${focus}`, maxLineWidth);
    checkPageBreak(lines.length * 14 + 10);
    doc.text(lines, margin, y);
    y += lines.length * 14 + 10;
  });

  // Trigger download
  doc.save('JD-Analyzer-Tailored-Tips.pdf');
}
