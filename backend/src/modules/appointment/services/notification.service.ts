import { Injectable, Logger } from '@nestjs/common';
import { Appointment } from '../schemas/appointment.schema';

export interface NotificationMessage {
  to: string;
  subject: string;
  body: string;
  type: 'email' | 'sms' | 'push';
}

/**
 * Notification Service
 * Handles sending notifications for appointment reminders, confirmations, etc.
 * This is a placeholder implementation. In production, integrate with
 * actual email/SMS providers (SendGrid, Twilio, AWS SES, etc.)
 */
@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  /**
   * Send appointment reminder notification
   */
  async sendAppointmentReminder(appointment: Appointment): Promise<void> {
    const message: NotificationMessage = {
      to: this.extractContactInfo(appointment),
      subject: `Appointment Reminder - ${this.formatDate(appointment.scheduledDate)}`,
      body: this.buildReminderMessage(appointment),
      type: 'email',
    };

    await this.send(message);
  }

  /**
   * Send appointment confirmation notification
   */
  async sendAppointmentConfirmation(appointment: Appointment): Promise<void> {
    const message: NotificationMessage = {
      to: this.extractContactInfo(appointment),
      subject: `Appointment Confirmed - ${this.formatDate(appointment.scheduledDate)}`,
      body: this.buildConfirmationMessage(appointment),
      type: 'email',
    };

    await this.send(message);
  }

  /**
   * Send appointment cancellation notification
   */
  async sendAppointmentCancellation(appointment: Appointment): Promise<void> {
    const message: NotificationMessage = {
      to: this.extractContactInfo(appointment),
      subject: `Appointment Cancelled - ${this.formatDate(appointment.scheduledDate)}`,
      body: this.buildCancellationMessage(appointment),
      type: 'email',
    };

    await this.send(message);
  }

  /**
   * Send a generic notification
   */
  async send(message: NotificationMessage): Promise<void> {
    // TODO: Integrate with actual notification provider
    // For now, just log the message
    this.logger.log(`📧 Sending ${message.type} notification to: ${message.to}`);
    this.logger.log(`Subject: ${message.subject}`);
    this.logger.log(`Body: ${message.body}`);
    this.logger.log('---');

    // Example integration points:
    // - Email: SendGrid, AWS SES, Nodemailer
    // - SMS: Twilio, AWS SNS
    // - Push: Firebase Cloud Messaging, OneSignal

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  /**
   * Build reminder message
   */
  private buildReminderMessage(appointment: Appointment): string {
    const patientName = this.extractPatientName(appointment);
    const doctorName = this.extractDoctorName(appointment);
    const date = this.formatDate(appointment.scheduledDate);

    return `
Dear ${patientName},

This is a friendly reminder that you have an appointment scheduled:

Date & Time: ${date}
Doctor: ${doctorName}
Type: ${appointment.appointmentType}
Location: ${appointment.location || 'TBD'}

Please arrive 10-15 minutes early.

If you need to reschedule or cancel, please contact us at least 24 hours in advance.

Best regards,
Clinic Management System
    `.trim();
  }

  /**
   * Build confirmation message
   */
  private buildConfirmationMessage(appointment: Appointment): string {
    const patientName = this.extractPatientName(appointment);
    const doctorName = this.extractDoctorName(appointment);
    const date = this.formatDate(appointment.scheduledDate);

    return `
Dear ${patientName},

Your appointment has been confirmed:

Date & Time: ${date}
Doctor: ${doctorName}
Type: ${appointment.appointmentType}
Location: ${appointment.location || 'TBD'}

Please bring your ID and insurance card.

Best regards,
Clinic Management System
    `.trim();
  }

  /**
   * Build cancellation message
   */
  private buildCancellationMessage(appointment: Appointment): string {
    const patientName = this.extractPatientName(appointment);
    const date = this.formatDate(appointment.scheduledDate);

    return `
Dear ${patientName},

Your appointment scheduled for ${date} has been cancelled.

${appointment.cancellationReason ? `Reason: ${appointment.cancellationReason}` : ''}

If you would like to reschedule, please contact us.

Best regards,
Clinic Management System
    `.trim();
  }

  /**
   * Extract contact info from appointment
   */
  private extractContactInfo(appointment: Appointment): string {
    // In a real implementation, you'd fetch this from the patient record
    return 'patient@example.com';
  }

  /**
   * Extract patient name from appointment
   */
  private extractPatientName(appointment: Appointment): string {
    // In a real implementation, populate from patientId reference
    return 'Patient';
  }

  /**
   * Extract doctor name from appointment
   */
  private extractDoctorName(appointment: Appointment): string {
    // In a real implementation, populate from doctorId reference
    return 'Doctor';
  }

  /**
   * Format date for display
   */
  private formatDate(date: Date): string {
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
