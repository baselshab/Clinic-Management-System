import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../modules/user/user.service';
import { PatientService } from '../modules/patient/patient.service';
import { DoctorService } from '../modules/doctor/doctor.service';
import { StaffService } from '../modules/staff/staff.service';
import { AppointmentService } from '../modules/appointment/appointment.service';
import { MedicalRecordService } from '../modules/medical-record/medical-record.service';
import { InvoiceService } from '../modules/billing/invoice.service';
import { PaymentService } from '../modules/billing/payment.service';
import { UserRole } from '../modules/user/schemas/user.schema';
import { Gender, BloodType } from '../modules/patient/schemas/patient.schema';
import { DoctorStatus, ConsultationType } from '../modules/doctor/schemas/doctor.schema';
import { StaffRole, StaffStatus, ShiftType } from '../modules/staff/schemas/staff.schema';
import {
  AppointmentStatus,
  AppointmentType,
  AppointmentPriority,
} from '../modules/appointment/schemas/appointment.schema';
import {
  RecordStatus,
  VisitType,
  PrescriptionFrequency,
  PrescriptionDuration,
} from '../modules/medical-record/schemas/medical-record.schema';
import {
  InvoiceStatus,
  InvoiceType,
  PaymentMethod,
} from '../modules/billing/schemas/invoice.schema';
import { PaymentStatus } from '../modules/billing/schemas/payment.schema';
import { Types } from 'mongoose';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);
  const patientService = app.get(PatientService);
  const doctorService = app.get(DoctorService);
  const staffService = app.get(StaffService);
  const appointmentService = app.get(AppointmentService);
  const medicalRecordService = app.get(MedicalRecordService);
  const invoiceService = app.get(InvoiceService);
  const paymentService = app.get(PaymentService);

  console.log('🌱 Starting database seeding...');

  // Check if users exist
  const usersCount = await userService.count();
  const createdUsers: any[] = [];

  if (usersCount === 0) {
    console.log('📝 Creating default users...');

    const users = [
      {
        email: 'admin@clinic.com',
        name: 'System Administrator',
        password: 'Admin@123',
        role: UserRole.ADMIN,
        phone: '+1234567890',
      },
      {
        email: 'doctor1@clinic.com',
        name: 'Dr. John Smith',
        password: 'Doctor@123',
        role: UserRole.DOCTOR,
        phone: '+1234567891',
      },
      {
        email: 'doctor2@clinic.com',
        name: 'Dr. Emily White',
        password: 'Doctor@123',
        role: UserRole.DOCTOR,
        phone: '+1234567895',
      },
      {
        email: 'nurse@clinic.com',
        name: 'Nurse Sarah Johnson',
        password: 'Nurse@123',
        role: UserRole.NURSE,
        phone: '+1234567892',
      },
      {
        email: 'receptionist@clinic.com',
        name: 'Receptionist Emily Davis',
        password: 'Receptionist@123',
        role: UserRole.RECEPTIONIST,
        phone: '+1234567893',
      },
      {
        email: 'patient1@clinic.com',
        name: 'Patient Michael Brown',
        password: 'Patient@123',
        role: UserRole.PATIENT,
        phone: '+1234567894',
      },
      {
        email: 'patient2@clinic.com',
        name: 'Patient Lisa Anderson',
        password: 'Patient@123',
        role: UserRole.PATIENT,
        phone: '+1234567896',
      },
    ];

    for (const userData of users) {
      const user = await userService.create(userData);
      createdUsers.push(user);
    }

    console.log('✅ Default users created successfully!');
  } else {
    console.log('ℹ️  Database already has users. Skipping user seed.');
    // Fetch existing users for relationships
    const allUsers = await userService.findAll(1, 100);
    createdUsers.push(...allUsers.users);
  }

  // Seed Patient records
  const patientsCount = await patientService.count();
  if (patientsCount === 0) {
    console.log('📝 Creating patient records...');

    const patientUsers = createdUsers.filter(u => u.role === UserRole.PATIENT);

    for (const user of patientUsers) {
      await patientService.create({
        userId: (user as any)._id || (user as any).id,
        firstName: user.name.split(' ')[0] || 'Patient',
        lastName: user.name.split(' ')[1] || 'User',
        dateOfBirth: new Date('1990-05-15'),
        gender: Gender.MALE,
        phone: user.phone,
        email: user.email,
        address: '123 Main St',
        city: 'New York',
        country: 'US',
        postalCode: '10001',
        bloodType: BloodType.O_POSITIVE,
        height: 175,
        weight: 70,
        allergies: ['Penicillin'],
        familyHistory: ['Diabetes'],
        currentMedications: [],
        emergencyContactName: 'Jane Doe',
        emergencyContactPhone: '+1234567899',
        emergencyContactRelation: 'Spouse',
        notes: 'Sample patient record',
      });
    }

    console.log('✅ Patient records created successfully!');
  }

  // Seed doctor records
  const doctorsCount = await doctorService.count();
  if (doctorsCount === 0) {
    console.log('📝 Creating doctor records...');

    const doctorUsers = createdUsers.filter(u => u.role === UserRole.DOCTOR);

    const specializations = ['Cardiology', 'Dermatology'];

    for (let i = 0; i < doctorUsers.length; i++) {
      const user = doctorUsers[i];
      await doctorService.create({
        userId: (user as any)._id || (user as any).id,
        specialization: specializations[i] || 'General Medicine',
        subSpecialties: [specializations[i] || 'General Medicine', 'Internal Medicine'],
        yearsOfExperience: 10 + i * 5,
        qualifications: 'MBBS, MD, FACC',
        licenseNumber: `MED-${10000 + i}`,
        licenseExpiryDate: new Date('2027-12-31'),
        biography: `Dr. ${user.name} is a board-certified specialist.`,
        consultationFee: 200 + i * 50,
        consultationTypes: [ConsultationType.IN_PERSON, ConsultationType.VIDEO_CALL],
        appointmentDuration: 30,
        maxPatientsPerDay: 15,
        clinicLocation: `Room ${301 + i}, Building A`,
        workingHours: '9:00 AM - 5:00 PM',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        certifications: ['Board Certified', 'Fellowship'],
        languages: ['English', 'Arabic'],
      });
    }

    console.log('✅ Doctor records created successfully!');
  }

  // Seed staff records
  const staffCount = await staffService.count();
  if (staffCount === 0) {
    console.log('📝 Creating staff records...');

    const nurseUser = createdUsers.find(u => u.role === UserRole.NURSE);
    const receptionistUser = createdUsers.find(u => u.role === UserRole.RECEPTIONIST);

    const doctorRecords = await doctorService.findAll(1, 10);
    const firstDoctor = doctorRecords.doctors[0];

    if (nurseUser) {
      await staffService.create({
        userId: (nurseUser as any)._id || (nurseUser as any).id,
        role: StaffRole.NURSE,
        position: 'Senior Nurse',
        department: 'Nursing',
        fullName: nurseUser.name,
        phone: nurseUser.phone,
        email: nurseUser.email,
        dateOfBirth: new Date('1992-03-20'),
        hireDate: new Date('2020-01-15'),
        education: 'Bachelor of Nursing',
        licenseNumber: 'LIC-NURSE-001',
        shift: ShiftType.MORNING,
        workingHours: '9:00 AM - 5:00 PM',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        salary: 5000,
        currency: 'USD',
        assignedLocation: 'Room 201',
        assignedDoctor: firstDoctor ? ((firstDoctor as any)._id || (firstDoctor as any).id) : undefined,
        emergencyContactName: 'John Nurse',
        emergencyContactPhone: '+1234567897',
        emergencyContactRelation: 'Spouse',
        notes: 'Experienced nurse',
      });
    }

    if (receptionistUser) {
      await staffService.create({
        userId: (receptionistUser as any)._id || (receptionistUser as any).id,
        role: StaffRole.RECEPTIONIST,
        position: 'Front Desk Receptionist',
        department: 'Reception',
        fullName: receptionistUser.name,
        phone: receptionistUser.phone,
        email: receptionistUser.email,
        dateOfBirth: new Date('1995-07-10'),
        hireDate: new Date('2021-06-01'),
        education: 'High School Diploma',
        licenseNumber: 'LIC-REC-001',
        shift: ShiftType.MORNING,
        workingHours: '9:00 AM - 5:00 PM',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        salary: 3000,
        currency: 'USD',
        assignedLocation: 'Reception Desk',
        emergencyContactName: 'Jane Reception',
        emergencyContactPhone: '+1234567898',
        emergencyContactRelation: 'Spouse',
        notes: 'Friendly and professional',
      });
    }

    console.log('✅ Staff records created successfully!');
  }

  // Seed appointment records
  const appointmentsCount = await appointmentService.count();
  if (appointmentsCount === 0) {
    console.log('📝 Creating appointment records...');

    const patientRecords = await patientService.findAll(1, 10);
    const doctorRecords = await doctorService.findAll(1, 10);
    const staffRecords = await staffService.findAll(1, 10);

    const patients = patientRecords.patients;
    const doctors = doctorRecords.doctors;
    const receptionists = staffRecords.staff.filter(
      (s: any) => s.role === StaffRole.RECEPTIONIST,
    );

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Create a completed appointment (yesterday)
    if (patients.length > 0 && doctors.length > 0) {
      await appointmentService.create({
        patientId: (patients[0] as any)._id || (patients[0] as any).id,
        doctorId: (doctors[0] as any)._id || (doctors[0] as any).id,
        scheduledDate: new Date(yesterday.setHours(10, 0, 0, 0)),
        duration: 30,
        appointmentType: AppointmentType.CONSULTATION,
        status: AppointmentStatus.COMPLETED,
        priority: AppointmentPriority.NORMAL,
        reason: 'Regular health check-up',
        symptoms: 'Mild fatigue',
        notes: 'Patient feeling better',
        doctorNotes: 'Healthy vitals, continue current medication',
        diagnosis: 'Minor vitamin deficiency',
        treatmentPlan: ['Vitamin D supplements', 'Exercise 30 min daily'],
        consultationFee: 150,
        isFollowUpNeeded: true,
        followUpDate: nextWeek,
        sendReminder: true,
        location: doctors[0]?.clinicLocation || 'Room 301',
      });
    }

    // Create a confirmed appointment (today)
    if (patients.length > 0 && doctors.length > 0) {
      await appointmentService.create({
        patientId: (patients[0] as any)._id || (patients[0] as any).id,
        doctorId: (doctors[0] as any)._id || (doctors[0] as any).id,
        scheduledDate: new Date(today.setHours(14, 0, 0, 0)),
        duration: 30,
        appointmentType: AppointmentType.FOLLOW_UP,
        status: AppointmentStatus.CONFIRMED,
        priority: AppointmentPriority.NORMAL,
        reason: 'Follow-up on vitamin deficiency',
        consultationFee: 100,
        isFollowUpNeeded: false,
        sendReminder: true,
        location: doctors[0]?.clinicLocation || 'Room 301',
      });
    }

    // Create a pending appointment (tomorrow)
    if (patients.length > 1 && doctors.length > 0) {
      await appointmentService.create({
        patientId: (patients[1] as any)._id || (patients[1] as any).id,
        doctorId: (doctors[0] as any)._id || (doctors[0] as any).id,
        scheduledDate: new Date(tomorrow.setHours(11, 0, 0, 0)),
        duration: 45,
        appointmentType: AppointmentType.CONSULTATION,
        status: AppointmentStatus.PENDING,
        priority: AppointmentPriority.HIGH,
        reason: 'Skin rash consultation',
        symptoms: 'Red rash on arms',
        consultationFee: 200,
        isFollowUpNeeded: false,
        sendReminder: true,
        location: doctors[0]?.clinicLocation || 'Room 301',
      });
    }

    // Create an emergency appointment (next week)
    if (patients.length > 0 && doctors.length > 1) {
      await appointmentService.create({
        patientId: (patients[1] as any)._id || (patients[1] as any).id,
        doctorId: (doctors[1] as any)._id || (doctors[1] as any).id,
        scheduledDate: new Date(nextWeek.setHours(9, 30, 0, 0)),
        duration: 60,
        appointmentType: AppointmentType.EMERGENCY,
        status: AppointmentStatus.PENDING,
        priority: AppointmentPriority.URGENT,
        reason: 'Severe allergic reaction',
        symptoms: 'Swelling, difficulty breathing',
        consultationFee: 300,
        isFollowUpNeeded: true,
        followUpDate: new Date(nextWeek.getTime() + 7 * 24 * 60 * 60 * 1000),
        sendReminder: true,
        location: doctors[1]?.clinicLocation || 'Room 302',
      });
    }

    // Create a cancelled appointment
    if (patients.length > 0 && doctors.length > 0) {
      const cancelledDate = new Date(today);
      cancelledDate.setHours(16, 0, 0, 0);
      await appointmentService.create({
        patientId: (patients[0] as any)._id || (patients[0] as any).id,
        doctorId: (doctors[1] as any)._id || (doctors[1] as any).id,
        scheduledDate: cancelledDate,
        duration: 30,
        appointmentType: AppointmentType.CHECK_UP,
        status: AppointmentStatus.CANCELLED,
        priority: AppointmentPriority.LOW,
        reason: 'Annual check-up',
        cancellationReason: 'Patient requested reschedule',
        consultationFee: 150,
        isFollowUpNeeded: true,
        followUpDate: new Date(nextWeek.getTime() + 14 * 24 * 60 * 60 * 1000),
        sendReminder: false,
        location: doctors[1]?.clinicLocation || 'Room 302',
      });
    }

    console.log('✅ Appointment records created successfully!');
  }

  // Seed medical records
  const medicalRecordsCount = await medicalRecordService.count();
  if (medicalRecordsCount === 0) {
    console.log('📝 Creating medical records...');

    const patientRecords = await patientService.findAll(1, 10);
    const doctorRecords = await doctorService.findAll(1, 10);
    const appointmentRecords = await appointmentService.findAll(1, 10);

    const patients = patientRecords.patients;
    const doctors = doctorRecords.doctors;
    const appointments = appointmentRecords.appointments;

    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const lastMonth = new Date(today);
    lastMonth.setDate(lastMonth.getDate() - 30);

    // Create a finalized medical record (last week)
    if (patients.length > 0 && doctors.length > 0) {
      await medicalRecordService.create({
        patientId: (patients[0] as any)._id || (patients[0] as any).id,
        doctorId: (doctors[0] as any)._id || (doctors[0] as any).id,
        appointmentId: appointments.length > 0 
          ? ((appointments[0] as any)._id || (appointments[0] as any).id) 
          : undefined,
        visitDate: new Date(lastWeek.setHours(10, 0, 0, 0)),
        visitType: VisitType.CONSULTATION,
        status: RecordStatus.FINALIZED,
        chiefComplaint: 'Persistent headaches and mild fever for the past week',
        physicalExamination: 'Patient appears fatigued, mild dehydration observed, vital signs stable',
        vitalSigns: 'BP: 120/80, Temp: 98.6F, HR: 72 bpm, RR: 16 breaths/min',
        diagnosis: 'Migraine with aura, Mild dehydration',
        diagnosisCode: 'ICD-10: G43.1, E86.0',
        differentialDiagnosis: 'Tension headache, sinus infection ruled out',
        labTestsOrdered: 'Complete blood count, MRI brain scan recommended',
        labResults: 'Blood work normal, MRI shows no abnormalities',
        prescribedMedications: ['Ibuprofen 400mg', 'Paracetamol 500mg as needed'],
        prescriptions: [
          {
            medication: 'Ibuprofen',
            dosage: '400mg',
            frequency: PrescriptionFrequency.TWICE_DAILY,
            duration: 7,
            durationUnit: PrescriptionDuration.DAYS,
            instructions: 'Take after food',
          },
          {
            medication: 'Paracetamol',
            dosage: '500mg',
            frequency: PrescriptionFrequency.AS_NEEDED,
            duration: 14,
            durationUnit: PrescriptionDuration.DAYS,
            instructions: 'Take every 6 hours as needed for pain',
          },
        ],
        treatmentPlan: [
          'Rest for 3 days',
          'Increase fluid intake to 2-3 liters daily',
          'Avoid screen time for extended periods',
          'Follow-up in 2 weeks',
        ],
        referrals: 'Refer to neurologist if symptoms persist after 2 weeks',
        followUpInstructions: 'Return immediately if symptoms worsen or new symptoms appear',
        followUpDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
        doctorNotes: 'Patient responded well to initial treatment. Monitor progress.',
        attachments: [],
        isSensitive: false,
      });
    }

    // Create a draft medical record (today)
    if (patients.length > 0 && doctors.length > 0) {
      await medicalRecordService.create({
        patientId: (patients[0] as any)._id || (patients[0] as any).id,
        doctorId: (doctors[0] as any)._id || (doctors[0] as any).id,
        visitDate: new Date(today.setHours(14, 0, 0, 0)),
        visitType: VisitType.FOLLOW_UP,
        status: RecordStatus.DRAFT,
        chiefComplaint: 'Follow-up on migraine treatment',
        physicalExamination: 'Patient reports improvement in headache frequency',
        vitalSigns: 'BP: 118/78, Temp: 98.4F, HR: 68 bpm',
        diagnosis: 'Migraine - improving with current treatment',
        diagnosisCode: 'ICD-10: G43.1',
        prescribedMedications: ['Ibuprofen 400mg - continuing'],
        prescriptions: [
          {
            medication: 'Ibuprofen',
            dosage: '400mg',
            frequency: PrescriptionFrequency.TWICE_DAILY,
            duration: 14,
            durationUnit: PrescriptionDuration.DAYS,
            instructions: 'Continue current dosage',
          },
        ],
        treatmentPlan: [
          'Continue current medication',
          'Maintain hydration',
          'Schedule follow-up in 1 month',
        ],
        followUpInstructions: 'Return in 1 month for reassessment',
        followUpDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
        doctorNotes: 'Good progress. Continue current treatment plan.',
      });
    }

    // Create an emergency medical record (two weeks ago)
    if (patients.length > 1 && doctors.length > 1) {
      await medicalRecordService.create({
        patientId: (patients[1] as any)._id || (patients[1] as any).id,
        doctorId: (doctors[1] as any)._id || (doctors[1] as any).id,
        visitDate: new Date(twoWeeksAgo.setHours(9, 30, 0, 0)),
        visitType: VisitType.EMERGENCY,
        status: RecordStatus.FINALIZED,
        chiefComplaint: 'Severe allergic reaction with difficulty breathing',
        physicalExamination: 'Swelling of face and arms, wheezing, elevated heart rate',
        vitalSigns: 'BP: 140/90, Temp: 99.2F, HR: 95 bpm, RR: 22 breaths/min, O2 Sat: 94%',
        diagnosis: 'Acute allergic reaction, Anaphylaxis',
        diagnosisCode: 'ICD-10: T78.2, T78.3',
        labTestsOrdered: 'Allergy panel blood test',
        labResults: 'Elevated IgE levels, positive for multiple allergens',
        prescribedMedications: [
          'Epinephrine auto-injector 0.3mg',
          'Cetirizine 10mg',
          'Prednisone 20mg',
        ],
        prescriptions: [
          {
            medication: 'Epinephrine auto-injector',
            dosage: '0.3mg',
            frequency: PrescriptionFrequency.AS_NEEDED,
            duration: 1,
            durationUnit: PrescriptionDuration.UNTIL_FURTHER_NOTICE,
            instructions: 'Use immediately if severe allergic reaction occurs. Seek emergency care.',
          },
          {
            medication: 'Cetirizine',
            dosage: '10mg',
            frequency: PrescriptionFrequency.ONCE_DAILY,
            duration: 14,
            durationUnit: PrescriptionDuration.DAYS,
            instructions: 'Take daily for allergy management',
          },
          {
            medication: 'Prednisone',
            dosage: '20mg',
            frequency: PrescriptionFrequency.ONCE_DAILY,
            duration: 5,
            durationUnit: PrescriptionDuration.DAYS,
            instructions: 'Take in the morning with food. Taper off as directed.',
          },
        ],
        treatmentPlan: [
          'Administered epinephrine in emergency room',
          'Observed for 4 hours post-treatment',
          'Prescribed allergy medications',
          'Allergist referral provided',
        ],
        referrals: 'Urgent referral to allergist/immunologist',
        followUpInstructions: 'Use epinephrine auto-injector if symptoms recur. Call 911 immediately.',
        followUpDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
        doctorNotes: 'Critical case. Patient educated on allergen avoidance and auto-injector use.',
        isSensitive: false,
      });
    }

    // Create a lab test medical record (last month)
    if (patients.length > 0 && doctors.length > 0) {
      await medicalRecordService.create({
        patientId: (patients[0] as any)._id || (patients[0] as any).id,
        doctorId: (doctors[0] as any)._id || (doctors[0] as any).id,
        visitDate: new Date(lastMonth.setHours(11, 0, 0, 0)),
        visitType: VisitType.LAB_TEST,
        status: RecordStatus.FINALIZED,
        chiefComplaint: 'Routine annual health check-up',
        physicalExamination: 'General physical examination conducted',
        vitalSigns: 'BP: 122/82, Temp: 98.6F, HR: 74 bpm, Weight: 70kg, Height: 175cm',
        diagnosis: 'Healthy individual, No significant findings',
        diagnosisCode: 'ICD-10: Z00.00',
        labTestsOrdered: 'Complete blood count, Lipid panel, Blood glucose, Liver function, Kidney function',
        labResults: 'All results within normal range. Cholesterol slightly elevated (210 mg/dL)',
        prescribedMedications: [],
        prescriptions: [],
        treatmentPlan: [
          'Maintain healthy diet low in saturated fats',
          'Exercise 30 minutes daily',
          'Recheck cholesterol in 3 months',
          'Annual follow-up recommended',
        ],
        followUpInstructions: 'Return for cholesterol recheck in 3 months',
        followUpDate: new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000),
        doctorNotes: 'Overall healthy patient. Lifestyle modifications recommended for cholesterol management.',
        attachments: ['lab_results_annual_checkup.pdf'],
      });
    }

    console.log('✅ Medical records created successfully!');
  }

  // Seed billing data (invoices and payments)
  const invoicesCount = await invoiceService.count();
  if (invoicesCount === 0) {
    console.log('📝 Creating billing records...');

    const patientRecords = await patientService.findAll(1, 10);
    const doctorRecords = await doctorService.findAll(1, 10);
    const appointmentRecords = await appointmentService.findAll(1, 10);
    const medicalRecords = await medicalRecordService.findAll(1, 10);

    const patients = patientRecords.patients;
    const doctors = doctorRecords.doctors;
    const appointments = appointmentRecords.appointments;
    const records = medicalRecords.records;

    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const nextMonth = new Date(today);
    nextMonth.setDate(nextMonth.getDate() + 30);

    // Create a paid invoice (last week)
    if (patients.length > 0 && doctors.length > 0) {
      const invoice = await invoiceService.create({
        patientId: (patients[0] as any)._id || (patients[0] as any).id,
        doctorId: (doctors[0] as any)._id || (doctors[0] as any).id,
        appointmentId: appointments.length > 0 
          ? ((appointments[0] as any)._id || (appointments[0] as any).id) 
          : undefined,
        medicalRecordId: records.length > 0 
          ? ((records[0] as any)._id || (records[0] as any).id) 
          : undefined,
        invoiceType: InvoiceType.CONSULTATION,
        status: InvoiceStatus.PAID,
        items: [
          {
            description: 'Consultation fee',
            quantity: 1,
            unitPrice: 150,
            amount: 150,
          },
          {
            description: 'Medical examination',
            quantity: 1,
            unitPrice: 50,
            amount: 50,
          },
        ],
        subtotal: 200,
        discountPercent: 5,
        discountAmount: 10,
        taxPercent: 10,
        taxAmount: 19,
        totalAmount: 209,
        paidAmount: 209,
        balanceAmount: 0,
        issueDate: new Date(lastWeek.setHours(10, 0, 0, 0)),
        dueDate: nextMonth,
        description: 'Payment for consultation and examination',
        notes: 'Thank you for your payment',
        paymentInstructions: 'Payment can be made via cash, card, or bank transfer',
        isInsuranceClaim: false,
      });

      // Create payment for this invoice
      await paymentService.create({
        invoiceId: (invoice as any)._id || (invoice as any).id,
        patientId: (patients[0] as any)._id || (patients[0] as any).id,
        doctorId: (doctors[0] as any)._id || (doctors[0] as any).id,
        amount: 209,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        status: PaymentStatus.COMPLETED,
        paymentDate: new Date(lastWeek.setHours(11, 0, 0, 0)),
        description: 'Credit card payment for consultation',
        paymentGateway: 'Stripe',
        transactionId: `ch_${Date.now()}`,
        referenceNumber: 'TXN-REF-001',
        notes: 'Payment processed successfully',
        processedBy: 'admin@clinic.com',
        currency: 'USD',
        exchangeRate: 1,
      });
    }

    // Create a pending invoice (today)
    if (patients.length > 0 && doctors.length > 0) {
      await invoiceService.create({
        patientId: (patients[0] as any)._id || (patients[0] as any).id,
        doctorId: (doctors[0] as any)._id || (doctors[0] as any).id,
        invoiceType: InvoiceType.FOLLOW_UP,
        status: InvoiceStatus.PENDING,
        items: [
          {
            description: 'Follow-up consultation',
            quantity: 1,
            unitPrice: 100,
            amount: 100,
          },
        ],
        subtotal: 100,
        taxPercent: 10,
        taxAmount: 10,
        totalAmount: 110,
        paidAmount: 0,
        balanceAmount: 110,
        issueDate: new Date(today.setHours(14, 0, 0, 0)),
        dueDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
        description: 'Follow-up consultation fee',
        notes: 'Payment due within 14 days',
        paymentInstructions: 'Online payment available through patient portal',
        isInsuranceClaim: false,
      });
    }

    // Create an emergency invoice (two weeks ago)
    if (patients.length > 1 && doctors.length > 1) {
      const emergencyInvoice = await invoiceService.create({
        patientId: (patients[1] as any)._id || (patients[1] as any).id,
        doctorId: (doctors[1] as any)._id || (doctors[1] as any).id,
        invoiceType: InvoiceType.EMERGENCY,
        status: InvoiceStatus.PARTIALLY_PAID,
        items: [
          {
            description: 'Emergency consultation',
            quantity: 1,
            unitPrice: 300,
            amount: 300,
          },
          {
            description: 'Epinephrine administration',
            quantity: 1,
            unitPrice: 150,
            amount: 150,
          },
          {
            description: 'Observation room (4 hours)',
            quantity: 4,
            unitPrice: 50,
            amount: 200,
          },
        ],
        subtotal: 650,
        taxPercent: 10,
        taxAmount: 65,
        totalAmount: 715,
        paidAmount: 400,
        balanceAmount: 315,
        issueDate: new Date(twoWeeksAgo.setHours(9, 30, 0, 0)),
        dueDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
        description: 'Emergency treatment for allergic reaction',
        notes: 'Partial payment received, balance due',
        isInsuranceClaim: true,
        insuranceProvider: 'Blue Cross Insurance',
        insurancePolicyNumber: 'INS-987654',
        insuranceCoverageAmount: 300,
      });

      // Create partial payment
      await paymentService.create({
        invoiceId: (emergencyInvoice as any)._id || (emergencyInvoice as any).id,
        patientId: (patients[1] as any)._id || (patients[1] as any).id,
        doctorId: (doctors[1] as any)._id || (doctors[1] as any).id,
        amount: 400,
        paymentMethod: PaymentMethod.CASH,
        status: PaymentStatus.COMPLETED,
        paymentDate: new Date(twoWeeksAgo.setHours(14, 0, 0, 0)),
        description: 'Cash payment for emergency treatment',
        referenceNumber: 'TXN-REF-002',
        notes: 'Partial payment received at discharge',
        processedBy: 'receptionist@clinic.com',
        currency: 'USD',
        exchangeRate: 1,
      });
    }

    // Create an insurance claim invoice
    if (patients.length > 0 && doctors.length > 0) {
      await invoiceService.create({
        patientId: (patients[0] as any)._id || (patients[0] as any).id,
        doctorId: (doctors[0] as any)._id || (doctors[0] as any).id,
        invoiceType: InvoiceType.LAB_TEST,
        status: InvoiceStatus.SENT,
        items: [
          {
            description: 'Complete blood count',
            quantity: 1,
            unitPrice: 80,
            amount: 80,
          },
          {
            description: 'Lipid panel',
            quantity: 1,
            unitPrice: 100,
            amount: 100,
          },
          {
            description: 'Blood glucose test',
            quantity: 1,
            unitPrice: 60,
            amount: 60,
          },
          {
            description: 'Liver function test',
            quantity: 1,
            unitPrice: 90,
            amount: 90,
          },
        ],
        subtotal: 330,
        taxPercent: 10,
        taxAmount: 33,
        totalAmount: 363,
        paidAmount: 0,
        balanceAmount: 363,
        issueDate: new Date(today.setHours(11, 0, 0, 0)),
        dueDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
        description: 'Annual checkup lab tests',
        notes: 'Insurance claim submitted',
        isInsuranceClaim: true,
        insuranceProvider: 'Blue Cross Insurance',
        insurancePolicyNumber: 'INS-987654',
        insuranceCoverageAmount: 300,
      });
    }

    console.log('✅ Billing records created successfully!');
  }

  await app.close();

  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Database seeding completed successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('📋 Default Users:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin:         admin@clinic.com / Admin@123');
  console.log('Doctor 1:      doctor1@clinic.com / Doctor@123');
  console.log('Doctor 2:      doctor2@clinic.com / Doctor@123');
  console.log('Nurse:         nurse@clinic.com / Nurse@123');
  console.log('Receptionist:  receptionist@clinic.com / Receptionist@123');
  console.log('Patient 1:     patient1@clinic.com / Patient@123');
  console.log('Patient 2:     patient2@clinic.com / Patient@123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('📊 Medical Records: 4 sample records created');
  console.log('💰 Billing: 4 invoices + 2 payments created');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

seed().catch((err) => {
  console.error('❌ Error seeding database:', err);
  process.exit(1);
});
