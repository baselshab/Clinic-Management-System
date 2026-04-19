import React, { useState } from 'react';
import { Calendar, Users, FileText, Settings, BarChart3, DollarSign, Bell, ChevronDown, Plus, Clock, CheckCircle, AlertCircle, TrendingUp, MessageCircle } from 'lucide-react';

// Reusable Components

const Navbar = ({ userName, userImage }) => (
  <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
    <h1 className="text-2xl font-bold text-gray-800">Clinic Management System</h1>
    <div className="flex items-center gap-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          className="bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-4 py-2 text-sm w-64 focus:outline-none focus:border-teal-400"
        />
      </div>
      <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
        <Bell size={20} className="text-gray-600" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition">
        <img src={userImage} alt="User" className="w-8 h-8 rounded-full" />
        <span className="text-sm font-medium text-gray-700">{userName}</span>
        <ChevronDown size={16} className="text-gray-500" />
      </div>
    </div>
  </div>
);

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'doctors', label: 'Doctors', icon: Users },
    { id: 'billing', label: 'Billing', icon: DollarSign },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 w-64 min-h-screen text-white fixed left-0 top-0 pt-6 flex flex-col">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-2 justify-center mb-2">
          <div className="w-10 h-10 bg-teal-400 rounded-full flex items-center justify-center">
            <Users size={20} className="text-slate-900" />
          </div>
        </div>
        <h2 className="text-sm font-bold text-center text-gray-300">ClinicCare</h2>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-teal-500 text-white'
                  : 'text-gray-300 hover:bg-slate-700'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-6 border-t border-slate-700">
        <div className="bg-slate-700 rounded-lg p-4 text-center">
          <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-3"></div>
          <p className="text-xs text-gray-300 mb-3">Ready to schedule?</p>
          <button className="w-full bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold py-2 rounded-lg transition">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, trend, icon: Icon, color }) => (
  <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition">
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
    <div className="flex items-center gap-2 text-green-600 text-sm">
      <TrendingUp size={16} />
      <span>{trend}% increase</span>
    </div>
  </div>
);

const AppointmentCard = ({ name, time, type, status, color, image }) => {
  const statusColors = {
    confirmed: 'bg-green-100 text-green-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    completed: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className={`rounded-lg p-4 border-l-4 ${color} bg-white hover:shadow-md transition`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <img src={image} alt={name} className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-semibold text-gray-900">{name}</p>
            <p className="text-sm text-gray-500">{time}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <p className="text-sm text-gray-600">{type}</p>
      <button className="mt-3 text-sm font-semibold text-teal-600 hover:text-teal-700">
        View Details
      </button>
    </div>
  );
};

const PatientRow = ({ name, time, concern, status, image }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-100 hover:bg-gray-50 px-4 rounded transition">
    <div className="flex items-center gap-3 flex-1">
      <img src={image} alt={name} className="w-10 h-10 rounded-full" />
      <div>
        <p className="font-semibold text-gray-900 text-sm">{name}</p>
        <p className="text-xs text-gray-500">{status}</p>
      </div>
    </div>
    <div className="text-center flex-1">
      <p className="text-sm font-medium text-gray-900">{time}</p>
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-600">{concern}</p>
    </div>
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
      status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
    }`}>
      {status}
    </span>
  </div>
);

const CalendarHeatmap = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  const weeks = 5;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Calendar Heatmap</h3>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-5 gap-8">
          {months.map((month) => (
            <div key={month}>
              <p className="text-xs font-semibold text-gray-600 mb-3 text-center">{month}</p>
              <div className="grid grid-cols-5 gap-1">
                {Array.from({ length: weeks * 5 }).map((_, i) => {
                  const intensity = Math.random();
                  let bgColor = 'bg-gray-100';
                  if (intensity > 0.7) bgColor = 'bg-teal-600';
                  else if (intensity > 0.5) bgColor = 'bg-teal-400';
                  else if (intensity > 0.3) bgColor = 'bg-teal-200';
                  
                  return (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-sm ${bgColor} cursor-pointer hover:ring-2 hover:ring-teal-400 transition`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Dashboard View
const DashboardView = () => {
  const metrics = [
    { title: 'Total Patients', value: '338', trend: 12, icon: Users, color: 'bg-teal-500' },
    { title: 'Appointments Today', value: '16', trend: 8, icon: Calendar, color: 'bg-blue-500' },
    { title: 'New Registrations', value: '23', trend: 27, icon: Plus, color: 'bg-green-500' },
  ];

  const appointments = [
    { name: 'Patient Name', time: '12:30 AM', concern: 'Medical Concern', status: 'confirmed', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop' },
    { name: 'Patient Dutio', time: '12:00 AM', concern: 'Medical Concern', status: 'completed', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop' },
    { name: 'Sarma Johnson', time: '12:00 AM', concern: 'Medical Concern', status: 'in-progress', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop' },
    { name: 'Patient Sorth', time: '12:00 PM', concern: 'Medical Concern', status: 'in-progress', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop' },
  ];

  const activities = [
    { type: 'registration', text: 'Patient registered', time: '3 hours ago', icon: Users },
    { type: 'lab', text: 'Lab results uploaded', time: '3 hours ago', icon: FileText },
    { type: 'lab', text: 'Lab results uploaded', time: '2 hours ago', icon: FileText },
    { type: 'registration', text: 'Patient registered', time: '2 hours ago', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, idx) => (
          <MetricCard key={idx} {...metric} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments Overview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Appointments Overview</h3>
            
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-4">Recent Today</p>
              <div className="space-y-3">
                {appointments.slice(0, 2).map((apt, idx) => (
                  <PatientRow key={idx} {...apt} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-4">Upcoming Today</p>
              <div className="space-y-3">
                {appointments.slice(2).map((apt, idx) => (
                  <PatientRow key={idx} {...apt} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
          <p className="text-sm text-gray-600 mb-4">Recent updates in feed</p>
          <div className="space-y-4">
            {activities.map((activity, idx) => {
              const Icon = activity.icon;
              return (
                <div key={idx} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Icon size={16} className="text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Calendar & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CalendarHeatmap />
        
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-4">
            <button className="p-6 rounded-lg bg-gradient-to-br from-teal-50 to-teal-100 hover:shadow-md transition flex flex-col items-center gap-3">
              <div className="p-3 bg-teal-500 rounded-lg">
                <Plus size={20} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Add New Patient</span>
            </button>
            <button className="p-6 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-md transition flex flex-col items-center gap-3">
              <div className="p-3 bg-purple-500 rounded-lg">
                <Calendar size={20} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Schedule Appointment</span>
            </button>
            <button className="p-6 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-md transition flex flex-col items-center gap-3">
              <div className="p-3 bg-orange-500 rounded-lg">
                <FileText size={20} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Billing</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Appointments View
const AppointmentsView = () => {
  const daysOfWeek = ['Mon Day', 'Tue Day', 'Wed Day', 'Thu Day', 'Fri Day', 'Sat Day'];
  const timeSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '10:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];

  const appointmentData = [
    { day: 2, time: '10:00 AM', name: 'Follow-up', type: 'Follow-up', color: 'border-purple-400 bg-purple-50' },
    { day: 2, time: '10:00 AM', name: 'Consultation', type: 'Consultation', color: 'border-teal-400 bg-teal-50' },
    { day: 1, time: '1:00 PM', name: 'Patient Sutio\nWeek-up', type: 'Week-up', color: 'border-teal-400 bg-teal-50' },
    { day: 3, time: '2:00 PM', name: 'Consultation', type: 'Consultation', color: 'border-teal-400 bg-teal-50' },
    { day: 4, time: '2:00 PM', name: 'Patient Sutio\nMeck-up', type: 'Meck-up', color: 'border-teal-400 bg-teal-50' },
    { day: 5, time: '2:00 PM', name: 'Follow-up\nFollow-up', type: 'Follow-up', color: 'border-purple-400 bg-purple-50' },
    { day: 0, time: '2:00 PM', name: 'Patient Sorth\nWeek-up', type: 'Week-up', color: 'border-teal-400 bg-teal-50' },
    { day: 2, time: '3:00 PM', name: 'Consultation', type: 'Consultation', color: 'border-teal-400 bg-teal-50' },
    { day: 1, time: '3:00 PM', name: 'Follow-up', type: 'Follow-up', color: 'border-purple-400 bg-purple-50' },
    { day: 3, time: '3:00 PM', name: 'Sarma Johnso\nMeck-up', type: 'Meck-up', color: 'border-teal-400 bg-teal-50' },
    { day: 5, time: '3:00 PM', name: 'Follow-up\nFollow-up', type: 'Follow-up', color: 'border-purple-400 bg-purple-50' },
  ];

  const todayAppointments = [
    { name: 'Sarma Johnson', time: '10:00 AM', type: 'Hypertension Check-up', status: 'confirmed' },
    { name: 'Patient Dutio', time: '12:00 AM', type: 'Hypertension Check-up', status: 'confirmed' },
    { name: 'Patien Sorth', time: '12:00 PM', type: 'Hypertension Check-up', status: 'completed' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
          <div className="flex items-center gap-3">
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-teal-400">
              <option>Doctor, Department</option>
            </select>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Calendar size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Users size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="overflow-x-auto mb-6">
          <div className="min-w-full">
            <div className="grid grid-cols-7 gap-px bg-gray-200 p-px rounded-lg overflow-hidden">
              {daysOfWeek.map((day, idx) => (
                <div key={idx} className="bg-white p-4 text-center">
                  <p className="font-semibold text-gray-900 text-sm">{day}</p>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-4 mt-4">
              {Array.from({ length: 7 }).map((_, dayIdx) => (
                <div key={dayIdx} className="space-y-2">
                  {timeSlots.map((time, timeIdx) => {
                    const apt = appointmentData.find(a => a.day === dayIdx && a.time === time);
                    return (
                      <div key={timeIdx} className="min-h-12">
                        {apt ? (
                          <div className={`p-3 rounded-lg text-xs font-semibold border-l-4 ${apt.color} cursor-pointer hover:shadow-md transition`}>
                            <p>{apt.name}</p>
                            <p className="text-gray-600">{time}</p>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400">{time}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4">Calendar Heatmap</p>
      </div>

      {/* Today's Appointments Sidebar */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Today's Appointments</h3>
        <div className="space-y-3">
          {todayAppointments.map((apt, idx) => (
            <AppointmentCard
              key={idx}
              name={apt.name}
              time={apt.time}
              type={apt.type}
              status={apt.status}
              color="border-l-4 border-teal-400"
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Patient Profile View
const PatientProfileView = () => {
  const patient = {
    name: 'Sarma Johnson',
    fullName: 'Fata',
    email: 'johnmon@gmail.com',
    phone: '+123 456 7790',
    id: 'sarma johnson',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  };

  const medicalHistory = [
    { date: 'Today', title: 'Hypertension Check-up - 10:00 AM', icon: Calendar },
    { date: '3 months ago', title: 'Initial Diagnosis - 3 months ago', icon: FileText },
    { date: '3 months ago', title: 'Initial Diagnosis - 3 months ago', icon: FileText },
  ];

  const pastAppointments = [
    { time: '10:00 AM', name: 'Sarma Johnson', type: 'Hypertension Check-up', date: 'Today', status: 'Confirmed' },
    { time: '12:00 AM', name: 'Patient Dutio', type: 'Hypertension Check-up', date: 'Monday', status: 'Completed' },
    { time: '12:00 PM', name: 'Patient Sutio', type: 'Hypertension Check-up', date: 'Week-up', status: 'Completed' },
    { time: '12:00 PM', name: 'Patien Sorth', type: 'Hypertension Check-up', date: 'Meck-up', status: 'Completed' },
  ];

  const prescriptions = [
    { name: 'Sarma Johnson', dosage: '1 Dosage', frequency: 'Frequency' },
    { name: 'Sarma Johnson', dosage: '2 Dosage', frequency: 'Frequency' },
    { name: 'Sarma Johnson', dosage: '2 Dosage', frequency: 'Frequency' },
  ];

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-start gap-6 mb-6">
            <img src={patient.image} alt={patient.name} className="w-24 h-24 rounded-full border-4 border-teal-100" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
              <p className="text-gray-600">Full name: {patient.fullName}</p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">✉️ {patient.email}</p>
                <p className="text-sm text-gray-600">📱 {patient.phone}</p>
                <p className="text-sm text-gray-600">ID: {patient.id}</p>
              </div>
            </div>
          </div>

          {/* Medical Alerts */}
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <div className="flex gap-3">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Medical Alerts</p>
                <p className="text-sm text-red-700">Hypertension is superior medicaits, danqo, aed treatment</p>
              </div>
            </div>
          </div>
        </div>

        {/* Medical History Sidebar */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Medical History</h3>
          <div className="space-y-4">
            {medicalHistory.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex gap-3">
                  <div className="p-2 bg-teal-100 rounded-lg flex-shrink-0">
                    <Icon size={16} className="text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600">{item.date}</p>
                    <p className="text-sm text-gray-900 font-medium">{item.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Past Appointments & Treatments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Past Appointments</h3>
          <div className="space-y-3">
            {pastAppointments.map((apt, idx) => (
              <div key={idx} className="border-l-4 border-teal-400 bg-teal-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{apt.time} • {apt.name}</p>
                    <p className="text-sm text-gray-600">{apt.type}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Treatments & Medications</h3>
          
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-4">Current Prescriptions</p>
            <div className="space-y-3">
              {prescriptions.map((med, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{med.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">{med.dosage}</p>
                    <p className="text-xs text-gray-600">{med.frequency}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">Ongoing Treatment Plan</p>
            <p className="text-sm text-gray-600">Ongoing treatment plan in statient plan</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Progress Notes</p>
            <p className="text-sm text-gray-600">Progress notes medical mental and progression pasienote data</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-6 rounded-lg bg-teal-50 hover:bg-teal-100 transition flex flex-col items-center gap-3">
            <div className="p-3 bg-teal-500 rounded-lg">
              <FileText size={20} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900 text-center">View Prescriptions</span>
          </button>
          <button className="p-6 rounded-lg bg-purple-50 hover:bg-purple-100 transition flex flex-col items-center gap-3">
            <div className="p-3 bg-purple-500 rounded-lg">
              <Users size={20} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900 text-center">Edit Profile</span>
          </button>
          <button className="p-6 rounded-lg bg-teal-50 hover:bg-teal-100 transition flex flex-col items-center gap-3">
            <div className="p-3 bg-teal-500 rounded-lg">
              <Plus size={20} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900 text-center">Add New Patient</span>
          </button>
          <button className="p-6 rounded-lg bg-purple-50 hover:bg-purple-100 transition flex flex-col items-center gap-3">
            <div className="p-3 bg-purple-500 rounded-lg">
              <Calendar size={20} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900 text-center">Schedule New Visit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function ClinicManagementSystem() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderView = () => {
    switch (activeTab) {
      case 'appointments':
        return <AppointmentsView />;
      case 'patients':
        return <PatientProfileView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar userName="Dr. Sarah Johnson" userImage="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop" />

        {/* Content Area */}
        <main className="flex-1 overflow-auto px-8 py-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
