/* eslint-disable jsx-a11y/alt-text */
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import type { Student, Payment } from '../types';

// Register Sarabun (supports Thai + English) via jsdelivr CDN
Font.register({
  family: 'Sarabun',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/sarabun/Sarabun-Regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/sarabun/Sarabun-Bold.ttf', fontWeight: 'bold' },
  ],
});

const COLORS = {
  primary: '#1e40af',
  primaryLight: '#3b82f6',
  text: '#1e293b',
  muted: '#64748b',
  border: '#e2e8f0',
  success: '#059669',
  light: '#f1f5f9',
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Sarabun',
    fontSize: 11,
    color: COLORS.text,
    padding: 40,
    backgroundColor: '#ffffff',
  },
  header: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
    paddingBottom: 16,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  schoolName: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary },
  schoolSub: { fontSize: 9, color: COLORS.muted, marginTop: 2 },
  docTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.text, textAlign: 'right' },
  docNumber: { fontSize: 9, color: COLORS.muted, marginTop: 4, textAlign: 'right' },

  section: { marginBottom: 18 },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },

  row: { flexDirection: 'row', marginBottom: 6 },
  label: { width: 130, color: COLORS.muted, fontSize: 10 },
  value: { flex: 1, fontWeight: 'bold', fontSize: 11 },

  table: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    marginVertical: 10,
  },
  tableHead: {
    flexDirection: 'row',
    backgroundColor: COLORS.light,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  th: { fontWeight: 'bold', fontSize: 9, color: COLORS.muted, textTransform: 'uppercase' },
  td: { fontSize: 10 },

  totalBox: {
    backgroundColor: COLORS.primary,
    color: 'white',
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 4,
    marginTop: 6,
  },
  totalLabel: { fontSize: 12, fontWeight: 'bold', color: 'white' },
  totalAmount: { fontSize: 16, fontWeight: 'bold', color: 'white' },

  certBox: {
    border: `2 solid ${COLORS.primary}`,
    padding: 28,
    margin: 10,
    alignItems: 'center',
    width: '100%',
  },
  certTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 14,
    marginBottom: 4,
    textAlign: 'center',
    width: '100%',
  },
  certSub: {
    fontSize: 11,
    color: COLORS.muted,
    marginBottom: 14,
    textAlign: 'center',
    width: '100%',
  },
  certName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginVertical: 10,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 6,
    alignSelf: 'center',
    width: 420,
  },
  certBody: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 1.5,
    color: COLORS.text,
    marginVertical: 10,
    paddingHorizontal: 30,
    width: '100%',
  },
  sealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    width: '100%',
    paddingHorizontal: 40,
  },
  sealBox: { alignItems: 'center', width: 180 },
  sealLine: {
    borderTopWidth: 1,
    borderTopColor: COLORS.text,
    width: '100%',
    marginBottom: 6,
  },
  sealLabel: { fontSize: 9, color: COLORS.muted },
  sealName: { fontSize: 10, fontWeight: 'bold', marginBottom: 2 },

  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: COLORS.muted,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },

  stamp: {
    position: 'absolute',
    top: 130,
    right: 60,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    transform: 'rotate(-12deg)',
  },
  stampText: { color: COLORS.success, fontWeight: 'bold', fontSize: 14 },
  stampSub: { color: COLORS.success, fontSize: 8 },
});

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 2 }).format(n);

const fmtDate = (iso: string) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
};

const today = () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

const SCHOOL = {
  name: 'BRIGHT FUTURE ACADEMY',
  nameTh: 'โรงเรียนไบรท์ฟิวเจอร์',
  address: '123 Education Road, Bangkok 10110',
  phone: '02-123-4567',
  email: 'info@brightfuture.ac.th',
};

const Header = ({ docTitle, docNumber }: { docTitle: string; docNumber: string }) => (
  <View style={styles.header} fixed>
    <View>
      <Text style={styles.schoolName}>{SCHOOL.name}</Text>
      <Text style={styles.schoolSub}>{SCHOOL.nameTh}</Text>
      <Text style={styles.schoolSub}>{SCHOOL.address}</Text>
      <Text style={styles.schoolSub}>Tel: {SCHOOL.phone} · {SCHOOL.email}</Text>
    </View>
    <View>
      <Text style={styles.docTitle}>{docTitle}</Text>
      <Text style={styles.docNumber}>{docNumber}</Text>
      <Text style={styles.docNumber}>Issued: {today()}</Text>
    </View>
  </View>
);

const Footer = () => (
  <Text style={styles.footer} fixed>
    This is an officially generated document from EduDoc System · {SCHOOL.name} · Page Generated {today()}
  </Text>
);

// ─── 1. TUITION RECEIPT ───────────────────────────────────────────────────────
export const TuitionReceiptPDF = ({ student, payments }: { student: Student; payments: Payment[] }) => {
  const paid = payments.filter(p => p.status === 'paid');
  const total = paid.reduce((s, p) => s + p.amount, 0);
  const receiptNo = `RC-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Header docTitle="TUITION RECEIPT" docNumber={`No. ${receiptNo}`} />

        <View style={styles.stamp}>
          <Text style={styles.stampText}>PAID</Text>
          <Text style={styles.stampSub}>CONFIRMED</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student Information</Text>
          <View style={styles.row}><Text style={styles.label}>Student Name:</Text><Text style={styles.value}>{student.firstName} {student.lastName}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Student ID:</Text><Text style={styles.value}>{student.studentId}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Grade / Classroom:</Text><Text style={styles.value}>{student.grade} — {student.classroom}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Parent / Guardian:</Text><Text style={styles.value}>{student.parentName}</Text></View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <View style={styles.table}>
            <View style={styles.tableHead}>
              <Text style={[styles.th, { flex: 3 }]}>Description</Text>
              <Text style={[styles.th, { width: 80 }]}>Term</Text>
              <Text style={[styles.th, { width: 100, textAlign: 'right' }]}>Amount</Text>
            </View>
            {paid.length > 0 ? paid.map(p => (
              <View key={p.id} style={styles.tableRow}>
                <Text style={[styles.td, { flex: 3 }]}>{p.description}</Text>
                <Text style={[styles.td, { width: 80 }]}>{p.term}</Text>
                <Text style={[styles.td, { width: 100, textAlign: 'right' }]}>{fmtCurrency(p.amount)}</Text>
              </View>
            )) : (
              <View style={styles.tableRow}>
                <Text style={[styles.td, { flex: 3, color: COLORS.muted }]}>Tuition Fee — Term 1/2026</Text>
                <Text style={[styles.td, { width: 80 }]}>2026-T1</Text>
                <Text style={[styles.td, { width: 100, textAlign: 'right' }]}>{fmtCurrency(18000)}</Text>
              </View>
            )}
          </View>

          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>TOTAL PAID</Text>
            <Text style={styles.totalAmount}>{fmtCurrency(total || 18000)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { width: 'auto', marginBottom: 4 }]}>Payment Method: Bank Transfer</Text>
          <Text style={[styles.label, { width: 'auto', marginBottom: 4 }]}>Payment Date: {today()}</Text>
        </View>

        <View style={styles.sealRow}>
          <View style={styles.sealBox}>
            <View style={styles.sealLine} />
            <Text style={styles.sealName}>Nattapong Chaiwut</Text>
            <Text style={styles.sealLabel}>Finance Officer</Text>
          </View>
          <View style={styles.sealBox}>
            <View style={styles.sealLine} />
            <Text style={styles.sealName}>School Director</Text>
            <Text style={styles.sealLabel}>Authorized Signature</Text>
          </View>
        </View>

        <Footer />
      </Page>
    </Document>
  );
};

// ─── 2. STUDENT CERTIFICATE ──────────────────────────────────────────────────
export const StudentCertificatePDF = ({ student }: { student: Student }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={[styles.page, { padding: 20 }]}>
      <View style={styles.certBox}>
        <Text style={[styles.schoolName, { textAlign: 'center', width: '100%' }]}>{SCHOOL.name}</Text>
        <Text style={[styles.schoolSub, { textAlign: 'center', width: '100%' }]}>{SCHOOL.nameTh}</Text>

        <Text style={styles.certTitle}>CERTIFICATE</Text>
        <Text style={styles.certSub}>of Academic Standing</Text>

        <Text style={styles.certBody}>This is to certify that</Text>
        <Text style={styles.certName}>{student.firstName} {student.lastName}</Text>
        <Text style={styles.certBody}>
          Student ID {student.studentId}, has been enrolled as a student of {SCHOOL.name},
          in Grade {student.grade}, Classroom {student.classroom}, for the academic year 2026.
          The student is currently in good academic standing and has fulfilled all attendance
          and behavioral requirements set forth by the institution.
        </Text>

        <Text style={[styles.certSub, { marginTop: 8, marginBottom: 8 }]}>Issued on {today()}</Text>

        <View style={styles.sealRow}>
          <View style={styles.sealBox}>
            <View style={styles.sealLine} />
            <Text style={styles.sealName}>Siriporn Mahidol</Text>
            <Text style={styles.sealLabel}>Registrar</Text>
          </View>
          <View style={styles.sealBox}>
            <View style={styles.sealLine} />
            <Text style={styles.sealName}>School Director</Text>
            <Text style={styles.sealLabel}>Principal</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

// ─── 3. ENROLLMENT VERIFICATION LETTER ───────────────────────────────────────
export const EnrollmentLetterPDF = ({ student }: { student: Student }) => {
  const refNo = `EN-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Header docTitle="ENROLLMENT VERIFICATION" docNumber={`Ref. ${refNo}`} />

        <View style={styles.section}>
          <Text style={{ fontSize: 11, marginBottom: 20 }}>To Whom It May Concern,</Text>
          <Text style={{ fontSize: 11, lineHeight: 1.8, marginBottom: 12 }}>
            This letter is to verify that the following student is currently enrolled at {SCHOOL.name}:
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: COLORS.light, padding: 16, borderRadius: 4 }]}>
          <View style={styles.row}><Text style={styles.label}>Full Name:</Text><Text style={styles.value}>{student.firstName} {student.lastName}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Student ID:</Text><Text style={styles.value}>{student.studentId}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Date of Birth:</Text><Text style={styles.value}>{fmtDate(student.dateOfBirth)}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Grade Level:</Text><Text style={styles.value}>{student.grade}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Classroom:</Text><Text style={styles.value}>{student.classroom}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Enrollment Date:</Text><Text style={styles.value}>{fmtDate(student.enrollmentDate)}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Status:</Text><Text style={[styles.value, { color: COLORS.success }]}>ACTIVE</Text></View>
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: 11, lineHeight: 1.8 }}>
            The student is in good standing and is expected to complete the current academic year.
            This document is issued upon the request of the parent/guardian for official purposes.
            {'\n\n'}
            Should you require any further information, please do not hesitate to contact our office
            at {SCHOOL.phone} or {SCHOOL.email}.
            {'\n\n'}
            Sincerely,
          </Text>
        </View>

        <View style={[styles.sealRow, { marginTop: 30, justifyContent: 'flex-start' }]}>
          <View style={styles.sealBox}>
            <View style={styles.sealLine} />
            <Text style={styles.sealName}>Siriporn Mahidol</Text>
            <Text style={styles.sealLabel}>Registrar · {today()}</Text>
          </View>
        </View>

        <Footer />
      </Page>
    </Document>
  );
};

// ─── 4. GRADUATION CERTIFICATE ───────────────────────────────────────────────
export const GraduationCertificatePDF = ({ student }: { student: Student }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={[styles.page, { padding: 20 }]}>
      <View style={[styles.certBox, { borderColor: '#d97706', borderWidth: 4 }]}>
        <Text style={[styles.schoolName, { color: '#d97706', textAlign: 'center', width: '100%' }]}>{SCHOOL.name}</Text>
        <Text style={[styles.schoolSub, { textAlign: 'center', width: '100%' }]}>Est. 2010 · Excellence in Education</Text>

        <Text style={[styles.certTitle, { color: '#d97706', marginTop: 12 }]}>DIPLOMA</Text>
        <Text style={styles.certSub}>Certificate of Graduation</Text>

        <Text style={styles.certBody}>This is to proudly certify that</Text>
        <Text style={[styles.certName, { fontSize: 24 }]}>{student.firstName} {student.lastName}</Text>
        <Text style={styles.certBody}>
          has successfully completed all the requirements of the Primary Education curriculum
          and is hereby awarded this diploma with all the rights and privileges thereto pertaining.
          Given this day, {today()}, at {SCHOOL.name}.
        </Text>

        <View style={styles.sealRow}>
          <View style={styles.sealBox}>
            <View style={styles.sealLine} />
            <Text style={styles.sealName}>School Director</Text>
            <Text style={styles.sealLabel}>Principal</Text>
          </View>
          <View style={styles.sealBox}>
            <View style={styles.sealLine} />
            <Text style={styles.sealName}>Academic Director</Text>
            <Text style={styles.sealLabel}>Academic Affairs</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

// ─── 5. GRADE TRANSCRIPT ─────────────────────────────────────────────────────
export const TranscriptPDF = ({ student }: { student: Student }) => {
  const subjects = [
    { name: 'Thai Language',        score: 92, grade: 'A' },
    { name: 'Mathematics',          score: 88, grade: 'A' },
    { name: 'English',              score: 85, grade: 'A' },
    { name: 'Science',              score: 90, grade: 'A' },
    { name: 'Social Studies',       score: 87, grade: 'A' },
    { name: 'Arts & Crafts',        score: 95, grade: 'A' },
    { name: 'Physical Education',   score: 91, grade: 'A' },
    { name: 'Music',                score: 89, grade: 'A' },
  ];
  const avg = subjects.reduce((s, x) => s + x.score, 0) / subjects.length;
  const refNo = `TR-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`;

  return (
    <Document>
      <Page size="A4" style={[styles.page, { padding: 32 }]}>
        <Header docTitle="ACADEMIC TRANSCRIPT" docNumber={`Ref. ${refNo}`} />

        <View style={[styles.section, { marginBottom: 12 }]}>
          <Text style={styles.sectionTitle}>Student Information</Text>
          <View style={[styles.row, { marginBottom: 3 }]}><Text style={styles.label}>Student Name:</Text><Text style={styles.value}>{student.firstName} {student.lastName}</Text></View>
          <View style={[styles.row, { marginBottom: 3 }]}><Text style={styles.label}>Student ID:</Text><Text style={styles.value}>{student.studentId}</Text></View>
          <View style={[styles.row, { marginBottom: 3 }]}><Text style={styles.label}>Grade:</Text><Text style={styles.value}>{student.grade}</Text></View>
          <View style={[styles.row, { marginBottom: 3 }]}><Text style={styles.label}>Academic Year:</Text><Text style={styles.value}>2025</Text></View>
        </View>

        <View style={[styles.section, { marginBottom: 10 }]}>
          <Text style={styles.sectionTitle}>Subject Results</Text>
          <View style={[styles.table, { marginVertical: 6 }]}>
            <View style={[styles.tableHead, { padding: 6 }]}>
              <Text style={[styles.th, { flex: 3 }]}>Subject</Text>
              <Text style={[styles.th, { width: 80, textAlign: 'center' }]}>Score</Text>
              <Text style={[styles.th, { width: 80, textAlign: 'center' }]}>Grade</Text>
            </View>
            {subjects.map((s, i) => (
              <View key={i} style={[styles.tableRow, { padding: 6 }]}>
                <Text style={[styles.td, { flex: 3 }]}>{s.name}</Text>
                <Text style={[styles.td, { width: 80, textAlign: 'center' }]}>{s.score}/100</Text>
                <Text style={[styles.td, { width: 80, textAlign: 'center', fontWeight: 'bold' }]}>{s.grade}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.totalBox, { padding: 10 }]}>
            <Text style={styles.totalLabel}>OVERALL GPA</Text>
            <Text style={styles.totalAmount}>{(avg / 25).toFixed(2)} / 4.00</Text>
          </View>
        </View>

        <View style={[styles.section, { marginBottom: 8 }]}>
          <Text style={styles.sectionTitle}>Grading Scale</Text>
          <Text style={{ fontSize: 9, color: COLORS.muted }}>
            A = 80-100 (Excellent) · B = 70-79 (Good) · C = 60-69 (Fair) · D = 50-59 (Pass) · F = Below 50 (Fail)
          </Text>
        </View>

        <View style={[styles.sealRow, { marginTop: 16 }]}>
          <View style={styles.sealBox}>
            <View style={styles.sealLine} />
            <Text style={styles.sealName}>Class Teacher</Text>
            <Text style={styles.sealLabel}>Homeroom</Text>
          </View>
          <View style={styles.sealBox}>
            <View style={styles.sealLine} />
            <Text style={styles.sealName}>Academic Director</Text>
            <Text style={styles.sealLabel}>Approved</Text>
          </View>
        </View>

        <Footer />
      </Page>
    </Document>
  );
};
