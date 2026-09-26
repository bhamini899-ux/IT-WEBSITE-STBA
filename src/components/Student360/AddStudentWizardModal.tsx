import React, { useState } from 'react';
import { X, Check, User, GraduationCap, Users, Bus, AlertCircle } from 'lucide-react';
import { Student, StudentHouse } from '../../types';

interface AddStudentWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (newStudent: Student) => void;
}

export const AddStudentWizardModal: React.FC<AddStudentWizardModalProps> = ({
  isOpen,
  onClose,
  onAddStudent,
}) => {
  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [dob, setDob] = useState('2010-05-15');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [motherTongue, setMotherTongue] = useState('Hindi');
  const [photoUrl, setPhotoUrl] = useState('');

  // Step 2: Academic
  const [className, setClassName] = useState('10-A');
  const [rollNo, setRollNo] = useState('25');
  const [house, setHouse] = useState<StudentHouse>('Agni');
  const [admissionNo, setAdmissionNo] = useState(`ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`);

  // Step 3: Guardian
  const [fatherName, setFatherName] = useState('');
  const [fatherPhone, setFatherPhone] = useState('+91 98290 ');
  const [fatherEmail, setFatherEmail] = useState('');
  const [fatherOccupation, setFatherOccupation] = useState('');
  const [motherName, setMotherName] = useState('');
  const [address, setAddress] = useState('');

  // Step 4: Transport & Facilities
  const [transportMode, setTransportMode] = useState<'School Bus' | 'Private'>('School Bus');
  const [busNumber, setBusNumber] = useState('Bus 01');
  const [stopName, setStopName] = useState('Central Square');
  const [feePlan, setFeePlan] = useState('Standard Annual (₹72,000)');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSaving) return;
    setIsSaving(true);

    const sec = className.includes('-') ? className.split('-')[1] : 'A';
    const roll = parseInt(rollNo) || 1;
    const paddedRoll = roll < 10 ? `0${roll}` : `${roll}`;
    const newStudentId = `STU-10${sec}-${paddedRoll}`;

    const studentObj: Student = {
      id: newStudentId,
      name: name.trim(),
      admissionNo: admissionNo,
      admissionDate: '17 Sep 2026',
      className: className,
      section: sec,
      rollNo: roll,
      gender: gender,
      house: house,
      status: 'Active',
      isNewAdmission: true,
      photoUrl: photoUrl || `https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80`,
      todayStatus: 'present',
      attendancePercentage: 100,
      lastAbsence: 'None (New Admission)',
      guardianName: fatherName || 'Guardian',
      guardianPhone: fatherPhone || '+91 98290 00000',
      feeStatus: 'Paid',
      transportRoute: transportMode === 'School Bus' ? (busNumber === 'Bus 01' ? 'Route 01' : 'Route 02') : 'Private',
      dob: dob,
      bloodGroup: bloodGroup,
      address: address || 'Bikaner, Rajasthan',
      motherTongue: motherTongue,
      nationality: 'Indian',
      academicStatus: 'Good',
      academicAverage: 85.0,
      academicRank: 10,
      family: {
        fatherName: fatherName || 'Guardian',
        fatherOccupation: fatherOccupation || 'Business',
        fatherPhone: fatherPhone,
        fatherEmail: fatherEmail || 'guardian@smartschool.in',
        motherName: motherName || 'Mother',
        motherOccupation: 'Home Executive',
        motherPhone: fatherPhone,
        motherEmail: fatherEmail || 'guardian@smartschool.in',
        emergencyContactName: fatherName || 'Guardian',
        emergencyContactPhone: fatherPhone,
        emergencyContactRelation: 'Father'
      },
      transportDetails: {
        busNumber: transportMode === 'School Bus' ? busNumber : 'None',
        routeId: transportMode === 'School Bus' ? (busNumber === 'Bus 01' ? 'Route 01' : 'Route 02') : 'None',
        routeName: transportMode === 'School Bus' ? 'North Town Loop' : 'Private Commute',
        stopName: stopName,
        morningPickupTime: '07:40 AM',
        afternoonDropTime: '03:15 PM',
        driverName: 'Amit Kumar',
        driverPhone: '+91 94140 12001',
        mode: transportMode
      },
      feeDetails: {
        totalAnnual: 72000,
        paidAmount: 72000,
        pendingAmount: 0,
        overdueAmount: 0,
        nextDueDate: '15 Jan 2027',
        lastPaymentDate: 'Today (17 Sep)',
        receipts: [
          {
            id: `REC-${Date.now().toString().slice(-6)}`,
            date: '17 Sep 2026',
            amount: 72000,
            term: 'Full Session 2026-27',
            mode: 'UPI',
            status: 'Paid'
          }
        ]
      },
      libraryDetails: {
        activeIssuedCount: 0,
        overdueCount: 0,
        totalReadCount: 0,
        totalFinesPending: 0
      },
      leaves: [],
      activities: [],
      achievements: [],
      disciplineRecords: [],
      healthRecords: {
        allergies: ['None'],
        chronicConditions: ['None'],
        medications: ['None'],
        dietaryRestrictions: 'Standard',
        emergencyActionPlan: 'Standard protocols',
        pediatricianName: 'School Physician',
        pediatricianPhone: '+91 94141 55221',
        vaccinationsUpToDate: true
      },
      documents: [
        {
          id: `DOC-NEW-${Date.now()}`,
          name: 'Enrollment Form 2026.pdf',
          category: 'Admission',
          uploadDate: '17 Sep 2026',
          fileSize: '1.4 MB',
          verified: true
        }
      ],
      communications: [
        {
          id: `COM-${Date.now()}`,
          date: 'Today',
          time: 'Just now',
          channel: 'SMS',
          recipient: fatherPhone,
          subject: 'Admission Confirmation',
          message: `Welcome to Smart School 360! Student ${name} has been enrolled in Class ${className}. Student ID: ${newStudentId}`,
          delivered: true,
          sentBy: 'Admissions Office'
        }
      ],
      timeline: [
        {
          id: `TM-${Date.now()}`,
          date: 'Today',
          time: 'Just now',
          category: 'System',
          title: 'Student Admitted',
          description: `Formally enrolled into Class ${className}, House ${house}. Digital identity created.`
        }
      ],
      smartAlerts: [],
      notes: []
    };

    onAddStudent(studentObj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="text-base font-black">New Student Admission Wizard</h3>
            <p className="text-xs text-slate-400">Step {step} of 4: Smart School 360° Identity Registration</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          {[
            { num: 1, label: 'Demographics', icon: User },
            { num: 2, label: 'Academic & House', icon: GraduationCap },
            { num: 3, label: 'Guardians', icon: Users },
            { num: 4, label: 'Transport & Fee', icon: Bus },
          ].map((s) => {
            const Icon = s.icon;
            const isCurrent = step === s.num;
            const isCompleted = step > s.num;
            return (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-xs font-semibold hidden sm:inline ${isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step Form Body */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Student Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aryan Mittal"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'M' | 'F')}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mother Tongue</label>
                  <input
                    type="text"
                    value={motherTongue}
                    onChange={(e) => setMotherTongue(e.target.value)}
                    placeholder="Hindi / English / Punjabi"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Photo URL (Optional)</label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Class & Section</label>
                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="10-A">Class 10-A</option>
                    <option value="10-B">Class 10-B</option>
                    <option value="10-C">Class 10-C</option>
                    <option value="10-D">Class 10-D</option>
                    <option value="10-E">Class 10-E</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Roll Number</label>
                  <input
                    type="number"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">School House</label>
                  <select
                    value={house}
                    onChange={(e) => setHouse(e.target.value as StudentHouse)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Agni">Agni (Red)</option>
                    <option value="Surya">Surya (Gold)</option>
                    <option value="Prithvi">Prithvi (Green)</option>
                    <option value="Vayu">Vayu (Blue)</option>
                    <option value="Trishul">Trishul (Purple)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Admission Number</label>
                  <input
                    type="text"
                    value={admissionNo}
                    onChange={(e) => setAdmissionNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Father / Guardian Name *</label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="e.g. Ramesh Mittal"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Guardian Phone *</label>
                  <input
                    type="text"
                    value={fatherPhone}
                    onChange={(e) => setFatherPhone(e.target.value)}
                    placeholder="+91 98290 12345"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mother Name</label>
                  <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    placeholder="e.g. Sarita Mittal"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Guardian Email</label>
                  <input
                    type="email"
                    value={fatherEmail}
                    onChange={(e) => setFatherEmail(e.target.value)}
                    placeholder="parent@domain.com"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Permanent Residential Address</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, Colony, City, Pin code"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Transport Facility</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                    <input
                      type="radio"
                      checked={transportMode === 'School Bus'}
                      onChange={() => setTransportMode('School Bus')}
                      className="text-blue-600"
                    />
                    School Bus Service
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                    <input
                      type="radio"
                      checked={transportMode === 'Private'}
                      onChange={() => setTransportMode('Private')}
                      className="text-blue-600"
                    />
                    Self / Parent Commute
                  </label>
                </div>
              </div>

              {transportMode === 'School Bus' && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <label className="block text-slate-500 mb-1">Select Bus & Route</label>
                    <select
                      value={busNumber}
                      onChange={(e) => setBusNumber(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                    >
                      <option value="Bus 01">Bus 01 (Route 01: North Town Loop)</option>
                      <option value="Bus 02">Bus 02 (Route 02: East Extension)</option>
                      <option value="Bus 03">Bus 03 (Route 03: South Ring Express)</option>
                      <option value="Bus 04">Bus 04 (Route 04: West Suburbs Loop)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Pickup Stop Name</label>
                    <input
                      type="text"
                      value={stopName}
                      onChange={(e) => setStopName(e.target.value)}
                      placeholder="e.g. Shastri Nagar Circle"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tuition Fee Plan</label>
                <select
                  value={feePlan}
                  onChange={(e) => setFeePlan(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Standard Annual (₹72,000)">Standard Annual (₹72,000 / Year)</option>
                  <option value="Quarterly Installments (₹18,000 x 4)">Quarterly Installments (₹18,000 x 4)</option>
                  <option value="Staff Ward Concession (₹36,000)">Staff Ward Concession (₹36,000)</option>
                </select>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p>
                  Upon submission, Smart School 360° will automatically assign an encrypted RFID token, issue a Digital Identity Card, and dispatch welcoming notifications to the guardian.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
            >
              Previous
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !name.trim()}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Continue to Step {step + 1}
            </button>
          ) : (
            <button
              type="button"
              disabled={isSaving}
              onClick={handleComplete}
              className={`px-6 py-2 rounded-lg text-white text-xs font-bold shadow-xs transition-colors ${
                isSaving
                  ? 'bg-emerald-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer'
              }`}
            >
              {isSaving ? 'Saving Admission...' : 'Complete Enrollment & Generate ID'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
