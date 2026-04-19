import React, { useState } from 'react';
import { Calendar, Users, FileText, Settings, BarChart3, DollarSign, Bell, ChevronDown, Plus, Clock, TrendingUp, MessageCircle, Activity } from 'lucide-react';

const DashboardExact = () => {
  // State for navigation
  const [activeTab, setActiveTab] = useState('dashboard');

  // Appointment data
  const recentAppointments = [
    {
      id: 1,
      name: 'Patient Name',
      status: 'Confirmed',
      time: '12:30 AM',
      concern: 'Medical Concern',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop',
    },
    {
      id: 2,
      name: 'Patient Dutio',
      status: 'Confirmed',
      time: '12:00 AM',
      concern: 'Medical Concern',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
    },
  ];

  const upcomingAppointments = [
    {
      id: 3,
      name: 'Sarma Johnson',
      status: 'Confirmed',
      time: '12:00 AM',
      concern: 'Medical Concern',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop',
    },
    {
      id: 4,
      name: 'Patient Sorth',
      status: 'Confirmed',
      time: '12:00 PM',
      concern: 'Medical Concern',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
    },
  ];

  // Activity feed
  const activities = [
    {
      type: 'registration',
      text: 'Patient registered',
      detail: 'Patient register registered',
      time: '3 hours ago',
      icon: Users,
    },
    {
      type: 'lab',
      text: 'Lab results uploaded',
      detail: 'Patient uploaded liimnune and testane',
      time: '3 hours ago',
      icon: FileText,
    },
    {
      type: 'lab',
      text: 'Lab results uploaded',
      detail: 'Lab results uploaded',
      time: '2 hours ago',
      icon: FileText,
    },
    {
      type: 'registration',
      text: 'Patient registered',
      time: '2 hours ago',
      icon: Users,
    },
    {
      type: 'lab',
      text: 'Lab results uploaded',
      time: '3 hours ago',
      icon: FileText,
    },
  ];

  // Chart component (simple SVG line chart)
  const SimpleLineChart = ({ trend, color }) => (
    <svg viewBox="0 0 100 40" className="w-full h-12">
      <polyline
        points="0,35 10,30 20,28 30,25 40,22 50,20 60,18 70,20 80,25 90,28 100,30"
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 w-64 text-white fixed left-0 top-0 h-screen flex flex-col">
        {/* Logo */}
        <div className="px-6 py-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 bg-teal-400 rounded-full flex items-center justify-center">
              <Users size={20} className="text-slate-900" />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'patients', label: 'Patients', icon: Users },
            { id: 'doctors', label: 'Doctors', icon: Users },
            { id: 'billing', label: 'Billing', icon: DollarSign },
            { id: 'reports', label: 'Reports', icon: FileText },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-teal-500 text-white'
                    : 'text-gray-300 hover:bg-slate-700'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Illustration */}
        <div className="px-3 py-8">
          <div className="bg-slate-700 rounded-lg p-6 text-center">
            <div className="w-full h-24 bg-gray-400 rounded-lg mb-3 flex items-center justify-center text-xs text-gray-600">
              Illustration
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
          <h1 className="text-2xl font-bold text-gray-800">Clinic Management System</h1>
          <div className="flex items-center gap-6">
            <div className="relative hidden sm:block">
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
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop"
                alt="User"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium text-gray-700">Dr. Sarah Johnson</span>
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Appointments & Actions */}
              <div className="lg:col-span-2 space-y-8">
                {/* Appointments Overview */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Appointments Overview</h2>
                    <div className="w-16 h-16 bg-teal-50 rounded-lg flex items-center justify-center">
                      <Activity size={32} className="text-teal-400" />
                    </div>
                  </div>

                  {/* Recent Today */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Today</h3>
                    <div className="space-y-3">
                      {recentAppointments.map((apt) => (
                        <div key={apt.id} className="flex items-center justify-between py-3 px-3 hover:bg-gray-50 rounded-lg transition">
                          <div className="flex items-center gap-3 flex-1">
                            <img src={apt.image} alt={apt.name} className="w-10 h-10 rounded-full" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{apt.name}</p>
                              <p className="text-xs text-gray-500">{apt.status}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 px-4">{apt.time}</p>
                          <p className="text-sm text-gray-600 px-4">{apt.concern}</p>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
                            {apt.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming Today */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Upcoming Today</h3>
                    <div className="space-y-3">
                      {upcomingAppointments.map((apt) => (
                        <div key={apt.id} className="flex items-center justify-between py-3 px-3 hover:bg-gray-50 rounded-lg transition">
                          <div className="flex items-center gap-3 flex-1">
                            <img src={apt.image} alt={apt.name} className="w-10 h-10 rounded-full" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{apt.name}</p>
                              <p className="text-xs text-gray-500">{apt.status}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 px-4">{apt.time}</p>
                          <p className="text-sm text-gray-600 px-4">{apt.concern}</p>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                            In Progress
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions & Calendar Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Quick Actions */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <button className="flex flex-col items-center gap-3 p-6 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 hover:shadow-md transition">
                        <div className="p-3 bg-teal-500 rounded-lg">
                          <Users size={20} className="text-white" />
                        </div>
                        <span className="text-xs font-semibold text-gray-900 text-center">Add New Patient</span>
                      </button>
                      <button className="flex flex-col items-center gap-3 p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-md transition">
                        <div className="p-3 bg-purple-500 rounded-lg">
                          <Calendar size={20} className="text-white" />
                        </div>
                        <span className="text-xs font-semibold text-gray-900 text-center">Schedule Appointment</span>
                      </button>
                      <button className="flex flex-col items-center gap-3 p-6 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-md transition">
                        <div className="p-3 bg-orange-500 rounded-lg">
                          <FileText size={20} className="text-white" />
                        </div>
                        <span className="text-xs font-semibold text-gray-900 text-center">Billing</span>
                      </button>
                    </div>
                  </div>

                  {/* Calendar Heatmap */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Calendar Heatmap</h3>
                    <div className="space-y-4">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May'].map((month, monthIdx) => (
                        <div key={month}>
                          <p className="text-xs font-semibold text-gray-600 mb-2">{month}</p>
                          <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: 7 }).map((_, i) => {
                              const intensity = Math.random();
                              let bgColor = 'bg-gray-100';
                              if (intensity > 0.7) bgColor = 'bg-teal-600';
                              else if (intensity > 0.5) bgColor = 'bg-teal-400';
                              else if (intensity > 0.3) bgColor = 'bg-teal-200';
                              
                              return (
                                <div
                                  key={`${monthIdx}-${i}`}
                                  className={`w-3 h-3 rounded-sm ${bgColor} cursor-pointer hover:ring-2 hover:ring-teal-400 transition`}
                                />
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
                      <span className="text-xs text-gray-600">All</span>
                      <span className="text-xs text-gray-600">Density</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Metrics & Activity */}
              <div className="space-y-8">
                {/* Key Metrics */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Key Metrics</h3>
                  
                  <div className="space-y-6">
                    {/* Total Patients */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Total Patients</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">338</p>
                      </div>
                      <div className="w-20 h-12">
                        <SimpleLineChart trend="12%" color="#3b82f6" />
                      </div>
                    </div>

                    {/* Appointments Today */}
                    <div className="flex items-start justify-between pt-6 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Appointments Today</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">16</p>
                      </div>
                      <div className="w-20 h-12">
                        <SimpleLineChart trend="8%" color="#a78bfa" />
                      </div>
                    </div>

                    {/* New Registrations */}
                    <div className="flex items-start justify-between pt-6 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-600 font-medium">New Registrations</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">23</p>
                      </div>
                      <div className="w-20 h-12">
                        <SimpleLineChart trend="27%" color="#10b981" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* New Registrations Cards */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700">New Registrations</h4>
                    <div className="mt-3 flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-gray-900">50</p>
                      <span className="text-sm font-medium text-orange-600">📈 28%</span>
                    </div>
                  </div>

                  <div className="h-16 mb-6">
                    <SimpleLineChart trend="28%" color="#f59e0b" />
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                    <h4 className="text-sm font-semibold text-gray-700">New Registrations</h4>
                    <div className="mt-3 flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-gray-900">51</p>
                      <span className="text-sm font-medium text-purple-600">📈 27%</span>
                    </div>
                  </div>

                  <div className="h-16 mt-6">
                    <SimpleLineChart trend="27%" color="#a78bfa" />
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Recent Activity</h3>
                  <p className="text-xs text-gray-600 mb-6">Recent updates in feed</p>

                  <div className="space-y-4">
                    {activities.map((activity, idx) => {
                      const Icon = activity.icon;
                      return (
                        <div key={idx} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                          <div className="p-2 bg-teal-100 rounded-lg flex-shrink-0 mt-0.5">
                            <Icon size={16} className="text-teal-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{activity.text}</p>
                            {activity.detail && (
                              <p className="text-xs text-gray-600 mt-1">{activity.detail}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">{activity.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardExact;
