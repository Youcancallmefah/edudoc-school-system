'use client';

import { pdf } from '@react-pdf/renderer';
import React from 'react';
import type { Student, Payment, DocumentType } from '../types';
import {
  TuitionReceiptPDF, StudentCertificatePDF, EnrollmentLetterPDF,
  GraduationCertificatePDF, TranscriptPDF,
} from './templates';

export async function generatePdfBlob(
  type: DocumentType,
  student: Student,
  payments: Payment[] = []
): Promise<Blob> {
  let element: React.ReactElement;
  switch (type) {
    case 'receipt':
      element = React.createElement(TuitionReceiptPDF, { student, payments });
      break;
    case 'certificate':
      element = React.createElement(StudentCertificatePDF, { student });
      break;
    case 'enrollment':
      element = React.createElement(EnrollmentLetterPDF, { student });
      break;
    case 'graduation':
      element = React.createElement(GraduationCertificatePDF, { student });
      break;
    case 'transcript':
      element = React.createElement(TranscriptPDF, { student });
      break;
    default:
      element = React.createElement(EnrollmentLetterPDF, { student });
  }
  return await pdf(element).toBlob();
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function generateAndDownload(
  type: DocumentType,
  student: Student,
  payments: Payment[] = []
) {
  const blob = await generatePdfBlob(type, student, payments);
  const safeName = `${student.firstName}_${student.lastName}`.replace(/[^a-z0-9_]/gi, '');
  const typeName = {
    receipt: 'Receipt',
    certificate: 'Certificate',
    transcript: 'Transcript',
    enrollment: 'EnrollmentLetter',
    graduation: 'Graduation',
    lesson_plan: 'LessonPlan',
  }[type];
  downloadBlob(blob, `${typeName}_${safeName}_${student.studentId}.pdf`);
}

export async function previewPdf(
  type: DocumentType,
  student: Student,
  payments: Payment[] = []
) {
  const blob = await generatePdfBlob(type, student, payments);
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
