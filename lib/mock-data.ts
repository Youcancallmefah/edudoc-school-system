import type {
  Student, Payment, Document, Teacher, Notification, AuthUser, DashboardStats
} from './types';

// ─── Demo Users ───────────────────────────────────────────────────────────────
export const DEMO_USERS: AuthUser[] = [
  { id: 'u1', name: 'Wanchai Sukreep',   email: 'admin@brightfuture.ac.th',        role: 'admin',        avatarInitials: 'WS', department: 'IT Administration' },
  { id: 'u2', name: 'Siriporn Mahidol',  email: 'register@brightfuture.ac.th',     role: 'registration', avatarInitials: 'SM', department: 'Registration Office' },
  { id: 'u3', name: 'Nattapong Chaiwut', email: 'finance@brightfuture.ac.th',      role: 'finance',      avatarInitials: 'NC', department: 'Finance Department' },
  { id: 'u4', name: 'Kulwadee Prasert',  email: 'teacher@brightfuture.ac.th',      role: 'teacher',      avatarInitials: 'KP', department: 'Grade 3 Classroom' },
  { id: 'u5', name: 'Somchai Tanawat',   email: 'parent@brightfuture.ac.th',       role: 'parent',       avatarInitials: 'ST', department: undefined },
];

// ─── Teachers ─────────────────────────────────────────────────────────────────
export const TEACHERS: Teacher[] = [
  { id: 't1', name: 'Kulwadee Prasert',   email: 'kulwadee@brightfuture.ac.th',   phone: '081-234-5678', subject: 'Homeroom / Thai',   classroom: 'K1-A', grade: 'K1', joinDate: '2019-05-01', status: 'active',   studentsCount: 22 },
  { id: 't2', name: 'Suthee Phongpaibul', email: 'suthee@brightfuture.ac.th',     phone: '082-345-6789', subject: 'Homeroom / Math',   classroom: 'K2-A', grade: 'K2', joinDate: '2020-06-01', status: 'active',   studentsCount: 20 },
  { id: 't3', name: 'Orathai Jirakorn',   email: 'orathai@brightfuture.ac.th',    phone: '083-456-7890', subject: 'Homeroom / English', classroom: 'K3-A', grade: 'K3', joinDate: '2018-05-15', status: 'active',   studentsCount: 18 },
  { id: 't4', name: 'Pichaya Ruengrit',   email: 'pichaya@brightfuture.ac.th',    phone: '084-567-8901', subject: 'Homeroom / Science', classroom: 'G1-A', grade: 'G1', joinDate: '2021-05-01', status: 'active',   studentsCount: 25 },
  { id: 't5', name: 'Naruemon Sakulrat',  email: 'naruemon@brightfuture.ac.th',   phone: '085-678-9012', subject: 'Homeroom / Social',  classroom: 'G2-A', grade: 'G2', joinDate: '2017-06-01', status: 'active',   studentsCount: 24 },
  { id: 't6', name: 'Wattana Kamolsit',   email: 'wattana@brightfuture.ac.th',    phone: '086-789-0123', subject: 'Homeroom / Arts',    classroom: 'G3-A', grade: 'G3', joinDate: '2022-05-16', status: 'active',   studentsCount: 26 },
  { id: 't7', name: 'Sasithorn Plangoen', email: 'sasithorn@brightfuture.ac.th',  phone: '087-890-1234', subject: 'Homeroom / PE',      classroom: 'G4-A', grade: 'G4', joinDate: '2016-05-01', status: 'on_leave', studentsCount: 23 },
  { id: 't8', name: 'Jiraporn Viriyakom', email: 'jiraporn@brightfuture.ac.th',   phone: '088-901-2345', subject: 'Homeroom / Music',   classroom: 'G5-A', grade: 'G5', joinDate: '2023-06-01', status: 'active',   studentsCount: 21 },
];

// ─── Students ─────────────────────────────────────────────────────────────────
export const STUDENTS: Student[] = [
  // Kindergarten 1
  { id: 's1',  studentId: '6701001', firstName: 'Nontaphat',  lastName: 'Tanawat',      grade: 'K1', classroom: 'K1-A', dateOfBirth: '2021-03-12', enrollmentDate: '2026-05-16', status: 'active',   parentName: 'Somchai Tanawat',     parentEmail: 'parent@brightfuture.ac.th', parentPhone: '081-111-2222', address: '12 Sukhumvit Rd, Bangkok 10110',       paymentStatus: 'paid',    bloodType: 'A+',  allergies: 'None',        teacherId: 't1', totalDebt: 0 },
  { id: 's2',  studentId: '6701002', firstName: 'Pimchanok',  lastName: 'Srisuwan',     grade: 'K1', classroom: 'K1-A', dateOfBirth: '2021-07-22', enrollmentDate: '2026-05-16', status: 'active',   parentName: 'Arocha Srisuwan',     parentEmail: 'arocha@gmail.com',          parentPhone: '081-222-3333', address: '45 Rama IV Rd, Bangkok 10120',         paymentStatus: 'unpaid',  bloodType: 'B+',  allergies: 'Peanuts',     teacherId: 't1', totalDebt: 18000 },
  { id: 's3',  studentId: '6701003', firstName: 'Thanapat',   lastName: 'Khamchan',     grade: 'K1', classroom: 'K1-A', dateOfBirth: '2021-01-05', enrollmentDate: '2026-05-16', status: 'active',   parentName: 'Malee Khamchan',      parentEmail: 'malee.k@gmail.com',         parentPhone: '081-333-4444', address: '78 Phahon Yothin Rd, Bangkok 10400',   paymentStatus: 'partial', bloodType: 'O+',  allergies: 'None',        teacherId: 't1', totalDebt: 9000 },
  { id: 's4',  studentId: '6701004', firstName: 'Watsamon',   lastName: 'Boontham',     grade: 'K1', classroom: 'K1-A', dateOfBirth: '2021-05-18', enrollmentDate: '2026-05-16', status: 'active',   parentName: 'Prapat Boontham',     parentEmail: 'prapat.b@gmail.com',        parentPhone: '081-444-5555', address: '23 Silom Rd, Bangkok 10500',           paymentStatus: 'paid',    bloodType: 'AB+', allergies: 'Lactose',     teacherId: 't1', totalDebt: 0 },
  // Kindergarten 2
  { id: 's5',  studentId: '6602001', firstName: 'Kornkamon',  lastName: 'Phattanapong', grade: 'K2', classroom: 'K2-A', dateOfBirth: '2020-09-30', enrollmentDate: '2025-05-16', status: 'active',   parentName: 'Niran Phattanapong',  parentEmail: 'niran.p@gmail.com',         parentPhone: '082-111-2222', address: '56 Ari Rd, Bangkok 10400',             paymentStatus: 'paid',    bloodType: 'A-',  allergies: 'None',        teacherId: 't2', totalDebt: 0 },
  { id: 's6',  studentId: '6602002', firstName: 'Ratchanon',  lastName: 'Yodsombat',    grade: 'K2', classroom: 'K2-A', dateOfBirth: '2020-11-14', enrollmentDate: '2025-05-16', status: 'active',   parentName: 'Sawang Yodsombat',    parentEmail: 'sawang.y@gmail.com',        parentPhone: '082-222-3333', address: '89 Chatuchak Rd, Bangkok 10900',       paymentStatus: 'overdue', bloodType: 'B-',  allergies: 'None',        teacherId: 't2', totalDebt: 36000 },
  { id: 's7',  studentId: '6602003', firstName: 'Siripak',    lastName: 'Lertchalerm',  grade: 'K2', classroom: 'K2-A', dateOfBirth: '2020-04-25', enrollmentDate: '2025-05-16', status: 'active',   parentName: 'Anothai Lertchalerm', parentEmail: 'anothai.l@gmail.com',       parentPhone: '082-333-4444', address: '12 On Nut Rd, Bangkok 10250',          paymentStatus: 'paid',    bloodType: 'O-',  allergies: 'Dust mites',  teacherId: 't2', totalDebt: 0 },
  // Kindergarten 3
  { id: 's8',  studentId: '6503001', firstName: 'Chayanun',   lastName: 'Worawithan',   grade: 'K3', classroom: 'K3-A', dateOfBirth: '2019-06-08', enrollmentDate: '2024-05-16', status: 'active',   parentName: 'Wanchai Worawithan',  parentEmail: 'wanchai.w@gmail.com',       parentPhone: '083-111-2222', address: '34 Ratchada Rd, Bangkok 10310',        paymentStatus: 'paid',    bloodType: 'A+',  allergies: 'None',        teacherId: 't3', totalDebt: 0 },
  { id: 's9',  studentId: '6503002', firstName: 'Natnalin',   lastName: 'Suvaporn',     grade: 'K3', classroom: 'K3-A', dateOfBirth: '2019-02-20', enrollmentDate: '2024-05-16', status: 'active',   parentName: 'Ladda Suvaporn',      parentEmail: 'ladda.s@gmail.com',         parentPhone: '083-222-3333', address: '67 Lat Phrao Rd, Bangkok 10230',       paymentStatus: 'partial', bloodType: 'B+',  allergies: 'Shellfish',   teacherId: 't3', totalDebt: 12000 },
  { id: 's10', studentId: '6503003', firstName: 'Kritsada',   lastName: 'Phomchan',     grade: 'K3', classroom: 'K3-A', dateOfBirth: '2019-08-15', enrollmentDate: '2024-05-16', status: 'active',   parentName: 'Jirapat Phomchan',    parentEmail: 'jirapat.p@gmail.com',       parentPhone: '083-333-4444', address: '90 Bangna Rd, Bangkok 10260',          paymentStatus: 'paid',    bloodType: 'O+',  allergies: 'None',        teacherId: 't3', totalDebt: 0 },
  // Grade 1
  { id: 's11', studentId: '6404001', firstName: 'Weerayuth',  lastName: 'Charoenwong',  grade: 'G1', classroom: 'G1-A', dateOfBirth: '2018-12-01', enrollmentDate: '2023-05-16', status: 'active',   parentName: 'Mongkol Charoenwong', parentEmail: 'mongkol.c@gmail.com',       parentPhone: '084-111-2222', address: '11 Nonthaburi Rd, Nonthaburi 11000',   paymentStatus: 'paid',    bloodType: 'AB-', allergies: 'None',        teacherId: 't4', totalDebt: 0 },
  { id: 's12', studentId: '6404002', firstName: 'Piyada',     lastName: 'Somboon',      grade: 'G1', classroom: 'G1-A', dateOfBirth: '2018-03-17', enrollmentDate: '2023-05-16', status: 'active',   parentName: 'Usa Somboon',         parentEmail: 'usa.s@gmail.com',           parentPhone: '084-222-3333', address: '44 Rangsit Rd, Pathumthani 12000',     paymentStatus: 'unpaid',  bloodType: 'A+',  allergies: 'Penicillin',  teacherId: 't4', totalDebt: 20000 },
  { id: 's13', studentId: '6404003', firstName: 'Tanakorn',   lastName: 'Wichitwong',   grade: 'G1', classroom: 'G1-A', dateOfBirth: '2018-09-25', enrollmentDate: '2023-05-16', status: 'active',   parentName: 'Thaweesak Wichitwong',parentEmail: 'thaweesak.w@gmail.com',     parentPhone: '084-333-4444', address: '77 Min Buri Rd, Bangkok 10510',        paymentStatus: 'paid',    bloodType: 'B+',  allergies: 'None',        teacherId: 't4', totalDebt: 0 },
  // Grade 2
  { id: 's14', studentId: '6305001', firstName: 'Poonnipa',   lastName: 'Rattanasin',   grade: 'G2', classroom: 'G2-A', dateOfBirth: '2017-05-10', enrollmentDate: '2022-05-16', status: 'active',   parentName: 'Chawalit Rattanasin', parentEmail: 'chawalit.r@gmail.com',      parentPhone: '085-111-2222', address: '22 Lad Krabang Rd, Bangkok 10520',     paymentStatus: 'paid',    bloodType: 'O-',  allergies: 'None',        teacherId: 't5', totalDebt: 0 },
  { id: 's15', studentId: '6305002', firstName: 'Suthipong',  lastName: 'Arjharn',      grade: 'G2', classroom: 'G2-A', dateOfBirth: '2017-11-28', enrollmentDate: '2022-05-16', status: 'active',   parentName: 'Khemarat Arjharn',    parentEmail: 'khemarat.a@gmail.com',      parentPhone: '085-222-3333', address: '55 Prawet Rd, Bangkok 10250',          paymentStatus: 'overdue', bloodType: 'A-',  allergies: 'Aspirin',     teacherId: 't5', totalDebt: 42000 },
  { id: 's16', studentId: '6305003', firstName: 'Nuttaya',    lastName: 'Chantamas',    grade: 'G2', classroom: 'G2-A', dateOfBirth: '2017-07-03', enrollmentDate: '2022-05-16', status: 'active',   parentName: 'Pimolnat Chantamas',  parentEmail: 'pimolnat.c@gmail.com',      parentPhone: '085-333-4444', address: '88 Samut Prakan Rd, Samut Prakan 10270', paymentStatus: 'paid',  bloodType: 'B-',  allergies: 'None',        teacherId: 't5', totalDebt: 0 },
  // Grade 3
  { id: 's17', studentId: '6206001', firstName: 'Kriangkrai', lastName: 'Kerdkaew',     grade: 'G3', classroom: 'G3-A', dateOfBirth: '2016-04-18', enrollmentDate: '2021-05-16', status: 'active',   parentName: 'Viroj Kerdkaew',      parentEmail: 'viroj.k@gmail.com',         parentPhone: '086-111-2222', address: '33 Klong Toei Rd, Bangkok 10110',      paymentStatus: 'paid',    bloodType: 'AB+', allergies: 'None',        teacherId: 't6', totalDebt: 0 },
  { id: 's18', studentId: '6206002', firstName: 'Mathurada',  lastName: 'Pongthep',     grade: 'G3', classroom: 'G3-A', dateOfBirth: '2016-09-07', enrollmentDate: '2021-05-16', status: 'active',   parentName: 'Chalermchai Pongthep',parentEmail: 'chalermchai.p@gmail.com',   parentPhone: '086-222-3333', address: '66 Thonburi Rd, Bangkok 10600',        paymentStatus: 'partial', bloodType: 'O+',  allergies: 'None',        teacherId: 't6', totalDebt: 7500 },
  { id: 's19', studentId: '6206003', firstName: 'Supakorn',   lastName: 'Meeboon',      grade: 'G3', classroom: 'G3-A', dateOfBirth: '2016-01-24', enrollmentDate: '2021-05-16', status: 'active',   parentName: 'Nui Meeboon',         parentEmail: 'nui.m@gmail.com',           parentPhone: '086-333-4444', address: '99 Phra Nakhon Rd, Bangkok 10200',     paymentStatus: 'paid',    bloodType: 'A+',  allergies: 'Ibuprofen',   teacherId: 't6', totalDebt: 0 },
  // Grade 4
  { id: 's20', studentId: '6107001', firstName: 'Thanachon',  lastName: 'Somjit',       grade: 'G4', classroom: 'G4-A', dateOfBirth: '2015-08-14', enrollmentDate: '2020-05-16', status: 'active',   parentName: 'Ratana Somjit',       parentEmail: 'ratana.s@gmail.com',        parentPhone: '087-111-2222', address: '14 Wang Thonglang Rd, Bangkok 10310',  paymentStatus: 'paid',    bloodType: 'B+',  allergies: 'None',        teacherId: 't7', totalDebt: 0 },
  { id: 's21', studentId: '6107002', firstName: 'Chalisa',    lastName: 'Nakprasit',    grade: 'G4', classroom: 'G4-A', dateOfBirth: '2015-02-27', enrollmentDate: '2020-05-16', status: 'active',   parentName: 'Anong Nakprasit',     parentEmail: 'anong.n@gmail.com',         parentPhone: '087-222-3333', address: '47 Huai Khwang Rd, Bangkok 10310',     paymentStatus: 'paid',    bloodType: 'O-',  allergies: 'None',        teacherId: 't7', totalDebt: 0 },
  // Grade 5
  { id: 's22', studentId: '6008001', firstName: 'Pannarai',   lastName: 'Sroithong',    grade: 'G5', classroom: 'G5-A', dateOfBirth: '2014-06-16', enrollmentDate: '2019-05-16', status: 'active',   parentName: 'Sornthep Sroithong',  parentEmail: 'sornthep.s@gmail.com',      parentPhone: '088-111-2222', address: '25 Don Mueang Rd, Bangkok 10210',      paymentStatus: 'paid',    bloodType: 'A+',  allergies: 'None',        teacherId: 't8', totalDebt: 0 },
  { id: 's23', studentId: '6008002', firstName: 'Sirawit',    lastName: 'Duangsri',     grade: 'G5', classroom: 'G5-A', dateOfBirth: '2014-10-03', enrollmentDate: '2019-05-16', status: 'active',   parentName: 'Lalida Duangsri',     parentEmail: 'lalida.d@gmail.com',        parentPhone: '088-222-3333', address: '58 Sai Mai Rd, Bangkok 10220',         paymentStatus: 'overdue', bloodType: 'AB+', allergies: 'None',        teacherId: 't8', totalDebt: 28000 },
  // Grade 6
  { id: 's24', studentId: '5909001', firstName: 'Worapong',   lastName: 'Thabtim',      grade: 'G6', classroom: 'G6-A', dateOfBirth: '2013-04-29', enrollmentDate: '2018-05-16', status: 'active',   parentName: 'Rachan Thabtim',      parentEmail: 'rachan.t@gmail.com',        parentPhone: '089-111-2222', address: '37 Bang Rak Rd, Bangkok 10500',        paymentStatus: 'paid',    bloodType: 'O+',  allergies: 'None',        teacherId: 't8', totalDebt: 0 },
  { id: 's25', studentId: '5909002', firstName: 'Jiratchaya', lastName: 'Kongsong',     grade: 'G6', classroom: 'G6-A', dateOfBirth: '2013-12-08', enrollmentDate: '2018-05-16', status: 'graduated', parentName: 'Surachet Kongsong',   parentEmail: 'surachet.k@gmail.com',      parentPhone: '089-222-3333', address: '70 Sathon Rd, Bangkok 10120',          paymentStatus: 'paid',    bloodType: 'B+',  allergies: 'Latex',       teacherId: 't8', totalDebt: 0 },
];

// ─── Payments ─────────────────────────────────────────────────────────────────
export const PAYMENTS: Payment[] = [
  // Student s1 - Nontaphat (fully paid)
  { id: 'p1',  studentId: 's1', amount: 18000, dueDate: '2026-06-01', paidDate: '2026-05-10', status: 'paid', term: '2026-T1', type: 'tuition',  receiptNumber: 'RC-2026-001', description: 'Term 1/2026 Tuition Fee' },
  { id: 'p2',  studentId: 's1', amount: 2500,  dueDate: '2026-06-01', paidDate: '2026-05-10', status: 'paid', term: '2026-T1', type: 'activity', receiptNumber: 'RC-2026-002', description: 'Term 1/2026 Activity Fee' },
  { id: 'p3',  studentId: 's1', amount: 3200,  dueDate: '2026-06-01', paidDate: '2026-05-10', status: 'paid', term: '2026-T1', type: 'lunch',    receiptNumber: 'RC-2026-003', description: 'Term 1/2026 Lunch Fee' },
  // Student s2 - Pimchanok (unpaid)
  { id: 'p4',  studentId: 's2', amount: 18000, dueDate: '2026-06-01', status: 'unpaid', term: '2026-T1', type: 'tuition',  description: 'Term 1/2026 Tuition Fee' },
  // Student s3 - Thanapat (partial)
  { id: 'p5',  studentId: 's3', amount: 18000, dueDate: '2026-06-01', paidDate: '2026-05-08', status: 'paid', term: '2026-T1', type: 'tuition',  receiptNumber: 'RC-2026-004', description: 'Term 1/2026 Tuition Fee' },
  { id: 'p6',  studentId: 's3', amount: 2500,  dueDate: '2026-06-01', status: 'unpaid', term: '2026-T1', type: 'activity', description: 'Term 1/2026 Activity Fee' },
  { id: 'p7',  studentId: 's3', amount: 3200,  dueDate: '2026-06-01', status: 'unpaid', term: '2026-T1', type: 'lunch',    description: 'Term 1/2026 Lunch Fee' },
  // Student s4 - Watsamon (paid)
  { id: 'p8',  studentId: 's4', amount: 18000, dueDate: '2026-06-01', paidDate: '2026-05-03', status: 'paid', term: '2026-T1', type: 'tuition',  receiptNumber: 'RC-2026-005', description: 'Term 1/2026 Tuition Fee' },
  { id: 'p9',  studentId: 's4', amount: 2500,  dueDate: '2026-06-01', paidDate: '2026-05-03', status: 'paid', term: '2026-T1', type: 'activity', receiptNumber: 'RC-2026-006', description: 'Term 1/2026 Activity Fee' },
  // Student s6 - Ratchanon (overdue)
  { id: 'p10', studentId: 's6', amount: 18000, dueDate: '2026-04-01', status: 'overdue', term: '2026-T1', type: 'tuition',  description: 'Term 1/2026 Tuition Fee - OVERDUE' },
  { id: 'p11', studentId: 's6', amount: 18000, dueDate: '2025-11-01', status: 'overdue', term: '2025-T2', type: 'tuition',  description: 'Term 2/2025 Tuition Fee - OVERDUE' },
  // Student s12 - Piyada (unpaid)
  { id: 'p12', studentId: 's12', amount: 20000, dueDate: '2026-06-01', status: 'unpaid', term: '2026-T1', type: 'tuition', description: 'Term 1/2026 Tuition Fee' },
  // Student s15 - Suthipong (overdue)
  { id: 'p13', studentId: 's15', amount: 20000, dueDate: '2026-03-01', status: 'overdue', term: '2025-T2', type: 'tuition', description: 'Term 2/2025 Tuition Fee - OVERDUE' },
  { id: 'p14', studentId: 's15', amount: 22000, dueDate: '2026-04-01', status: 'overdue', term: '2026-T1', type: 'tuition', description: 'Term 1/2026 Tuition Fee - OVERDUE' },
  // Student s23 - Sirawit (overdue)
  { id: 'p15', studentId: 's23', amount: 28000, dueDate: '2026-04-15', status: 'overdue', term: '2026-T1', type: 'tuition', description: 'Term 1/2026 Tuition Fee - OVERDUE' },
];

// ─── Documents ────────────────────────────────────────────────────────────────
export const DOCUMENTS: Document[] = [
  { id: 'd1',  studentId: 's1',  type: 'receipt',     title: 'Tuition Receipt T1/2026',       generatedAt: '2026-05-10T09:15:00', generatedBy: 'Nattapong Chaiwut',  status: 'sent',      sentTo: 'parent@brightfuture.ac.th', fileSize: '128 KB' },
  { id: 'd2',  studentId: 's4',  type: 'receipt',     title: 'Tuition Receipt T1/2026',       generatedAt: '2026-05-03T10:20:00', generatedBy: 'Nattapong Chaiwut',  status: 'sent',      sentTo: 'prapat.b@gmail.com',        fileSize: '128 KB' },
  { id: 'd3',  studentId: 's8',  type: 'certificate', title: 'Student Certificate 2026',      generatedAt: '2026-05-12T14:05:00', generatedBy: 'Siriporn Mahidol',   status: 'downloaded', fileSize: '215 KB' },
  { id: 'd4',  studentId: 's25', type: 'graduation',  title: 'Graduation Certificate 2026',   generatedAt: '2026-05-15T11:30:00', generatedBy: 'Siriporn Mahidol',   status: 'sent',      sentTo: 'surachet.k@gmail.com',      fileSize: '340 KB' },
  { id: 'd5',  studentId: 's24', type: 'transcript',  title: 'Grade Transcript G6 2025',      generatedAt: '2026-05-14T09:00:00', generatedBy: 'Siriporn Mahidol',   status: 'sent',      sentTo: 'rachan.t@gmail.com',        fileSize: '180 KB' },
  { id: 'd6',  studentId: 's11', type: 'enrollment',  title: 'Enrollment Verification Letter', generatedAt: '2026-05-13T15:45:00', generatedBy: 'Siriporn Mahidol',   status: 'downloaded', fileSize: '95 KB' },
  { id: 'd7',  studentId: 's17', type: 'receipt',     title: 'Tuition Receipt T1/2026',       generatedAt: '2026-05-01T08:30:00', generatedBy: 'Nattapong Chaiwut',  status: 'sent',      sentTo: 'viroj.k@gmail.com',         fileSize: '128 KB' },
  { id: 'd8',  studentId: 's22', type: 'transcript',  title: 'Grade Transcript G5 2025',      generatedAt: '2026-05-09T13:00:00', generatedBy: 'Kulwadee Prasert',   status: 'generated', fileSize: '175 KB' },
  { id: 'd9',  studentId: 's20', type: 'certificate', title: 'Good Conduct Certificate',      generatedAt: '2026-05-07T16:20:00', generatedBy: 'Siriporn Mahidol',   status: 'downloaded', fileSize: '220 KB' },
  { id: 'd10', studentId: 's1',  type: 'enrollment',  title: 'Enrollment Verification Letter', generatedAt: '2026-05-05T10:10:00', generatedBy: 'Siriporn Mahidol',   status: 'sent',      sentTo: 'parent@brightfuture.ac.th', fileSize: '95 KB' },
];

// ─── Notifications ────────────────────────────────────────────────────────────
export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'payment',      title: 'Payment Overdue',        message: 'Ratchanon Yodsombat (K2) has 2 overdue payments totaling ฿36,000.',                read: false, createdAt: '2026-05-16T08:00:00' },
  { id: 'n2', type: 'payment',      title: 'Payment Received',       message: 'Nontaphat Tanawat (K1) — ฿23,700 received for Term 1/2026.',                       read: false, createdAt: '2026-05-10T09:15:00' },
  { id: 'n3', type: 'document',     title: 'Document Sent',          message: 'Graduation certificate for Jiratchaya Kongsong emailed to surachet.k@gmail.com.',   read: true,  createdAt: '2026-05-15T11:32:00' },
  { id: 'n4', type: 'payment',      title: 'Payment Overdue',        message: 'Suthipong Arjharn (G2) has overdue balance of ฿42,000. Please follow up.',         read: false, createdAt: '2026-05-14T07:00:00' },
  { id: 'n5', type: 'system',       title: 'System Update',          message: 'EduDoc system updated to version 2.4.1. New bulk document generation available.',   read: true,  createdAt: '2026-05-13T06:00:00' },
  { id: 'n6', type: 'announcement', title: 'Term 1/2026 Begins',     message: 'Academic term 1/2026 starts on June 2, 2026. All tuition due by June 1.',           read: true,  createdAt: '2026-05-12T09:00:00' },
  { id: 'n7', type: 'document',     title: 'Bulk Receipt Generated', message: '18 tuition receipts generated and emailed to parents for Term 1/2026.',             read: true,  createdAt: '2026-05-10T10:00:00' },
];

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const DASHBOARD_STATS: DashboardStats = {
  totalStudents: 179,
  activeStudents: 176,
  pendingPayments: 14,
  overduePayments: 5,
  documentsThisMonth: 47,
  totalTeachers: 8,
  collectedRevenue: 2_847_500,
  pendingRevenue: 133_000,
};

// ─── Utility helpers ─────────────────────────────────────────────────────────
export const GRADE_ORDER = ['K1', 'K2', 'K3', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6'];

export function getStudentPayments(studentId: string): Payment[] {
  return PAYMENTS.filter(p => p.studentId === studentId);
}

export function getStudentDocuments(studentId: string): Document[] {
  return DOCUMENTS.filter(d => d.studentId === studentId);
}

export function getStudentById(id: string): Student | undefined {
  return STUDENTS.find(s => s.id === id);
}

export function getTeacherById(id: string): Teacher | undefined {
  return TEACHERS.find(t => t.id === id);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(amount);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
}
