"use client"

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  BarChart3, 
  Calendar,
  User,
  Save,
  X,
  FileImage,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MemberManagementSystem = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [currentView, setCurrentView] = useState('list');
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: 'นาย',
    firstName: '',
    lastName: '',
    birthDate: '',
    profileImage: null
  });

  // โหลดข้อมูลสมาชิกจาก API
  const fetchMembers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/members');
      const result = await response.json();
      
      if (result.success) {
        setMembers(result.data);
      } else {
        setError(result.message || 'Failed to fetch members');
      }
    } catch (error) {
      setError('Failed to load members');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  
  // โหลดข้อมูลรายงานจาก API
  const fetchReportData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/reports/age-groups');
      const result = await response.json();
      
      if (result.success) {
        setReportData(result.data);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to load report data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // โหลดข้อมูลเมื่อ component mount
  useEffect(() => {
    fetchMembers();
  }, []);

  // โหลดข้อมูลรายงานเมื่อเปลี่ยนเป็น view รายงาน
  useEffect(() => {
    if (currentView === 'report') {
      fetchReportData();
    }
  }, [currentView]);

  // เพิ่มหรือแก้ไขสมาชิก
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.birthDate) {
      setError('Please fill in all required fields');
      return;
    }
    
    setSubmitLoading(true);
    setError('');
  
    try {
      const url = editingMember 
        ? `/api/members/${editingMember.id}`
        : '/api/members';
        
      const method = editingMember ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchMembers();
        resetForm();
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to save member');
      console.error('Error:', error);
    } finally {
      setSubmitLoading(false);
    }
  };
  
  // รีเซ็ตฟอร์ม
  const resetForm = () => {
    setFormData({
      title: 'นาย',
      firstName: '',
      lastName: '',
      birthDate: '',
      profileImage: null
    });
    setEditingMember(null);
    setShowForm(false);
    setError('');
  };

  // แก้ไขสมาชิก
  const handleEdit = (member) => {
    setFormData({
      title: member.title,
      firstName: member.firstName,
      lastName: member.lastName,
      birthDate: member.birthDate,
      profileImage: member.profileImage
    });
    setEditingMember(member);
    setShowForm(true);
    setError('');
  };

  // ลบสมาชิก
  const handleDelete = async (id, memberName) => {
  if (!window.confirm(`Are you sure you want to delete ${memberName}?`)) {
    return;
  }

  setLoading(true);
  setError('');

  try {
    const response = await fetch(`/api/members/${id}`, {
      method: 'DELETE'
    });
    
    const result = await response.json();
    
    if (result.success) {
      await fetchMembers();
    } else {
      setError(result.message);
    }
  } catch (error) {
    setError('Failed to delete member');
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};

  // กรองและเรียงลำดับข้อมูล
  const filteredAndSortedMembers = members
    .filter(member => 
      `${member.firstName} ${member.lastName}`.toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'age') {
        return a.age - b.age;
      } else if (sortBy === 'name') {
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      }
      return 0;
    });

  // จัดการอัพโหลดรูปภาพ
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // ตรวจสอบขนาดไฟล์ (จำกัดที่ 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('ขนาดไฟล์รูปภาพต้องไม่เกิน 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({...formData, profileImage: e.target.result});
      };
      reader.readAsDataURL(file);
    }
  };

  // Component สำหรับแสดงข้อผิดพลาด
  const ErrorAlert = ({ message }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start space-x-3">
      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="text-red-700 text-sm">{message}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-800">ระบบบันทึกข้อมูลสมาชิก</h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentView('list')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  currentView === 'list' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>รายชื่อสมาชิก</span>
              </button>
              <button
                onClick={() => setCurrentView('report')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  currentView === 'report' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>รายงาน</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && <ErrorAlert message={error} />}

        {currentView === 'list' && (
          <>
            {/* Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="ค้นหาชื่อ-นามสกุล..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="name">เรียงตามชื่อ</option>
                    <option value="age">เรียงตามอายุ</option>
                  </select>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มสมาชิกใหม่</span>
                </button>
              </div>
            </div>

            {/* Member Form Modal */}
            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                      {editingMember ? 'แก้ไขข้อมูลสมาชิก' : 'เพิ่มสมาชิกใหม่'}
                    </h2>
                    <button
                      onClick={resetForm}
                      disabled={submitLoading}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {error && <ErrorAlert message={error} />}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        คำนำหน้าชื่อ
                      </label>
                      <select
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        disabled={submitLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                        required
                      >
                        <option value="นาย">นาย</option>
                        <option value="นาง">นาง</option>
                        <option value="นางสาว">นางสาว</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ชื่อ *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        disabled={submitLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        นามสกุล *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        disabled={submitLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        วันเดือนปีเกิด *
                      </label>
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                        disabled={submitLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        รูปภาพโปรไฟล์
                      </label>
                      <div className="flex items-center space-x-4">
                        {formData.profileImage && (
                          <img
                            src={formData.profileImage}
                            alt="Profile Preview"
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                          />
                        )}
                        <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 disabled:opacity-50 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                          <FileImage className="w-4 h-4" />
                          <span>เลือกรูปภาพ</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={submitLoading}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitLoading}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                      >
                        {submitLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span>{submitLoading ? 'กำลังบันทึก...' : 'บันทึก'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        disabled={submitLoading}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>ยกเลิก</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Members List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  รายชื่อสมาชิก ({filteredAndSortedMembers.length} คน)
                </h2>
              </div>
              
              {loading ? (
                <div className="p-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
                  <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
                </div>
              ) : filteredAndSortedMembers.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">ไม่พบข้อมูลสมาชิก</p>
                  <p>เพิ่มสมาชิกใหม่เพื่อเริ่มต้นใช้งาน</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredAndSortedMembers.map((member) => (
                    <div key={member.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        {member.profileImage ? (
                          <img
                            src={member.profileImage}
                            alt={`${member.firstName} ${member.lastName}`}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                            <User className="w-6 h-6 text-indigo-600" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {member.title} {member.firstName} {member.lastName}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>อายุ {member.age} ปี</span>
                            </span>
                            <span>แก้ไขล่าสุด: {member.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(member)}
                          disabled={loading}
                          className="p-2 text-blue-600 hover:bg-blue-100 disabled:opacity-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id, `${member.title} ${member.firstName} ${member.lastName}`)}
                          disabled={loading}
                          className="p-2 text-red-600 hover:bg-red-100 disabled:opacity-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {currentView === 'report' && (
          <div className="space-y-6">
            {loading ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
                <p className="text-gray-600">กำลังโหลดข้อมูลรายงาน...</p>
              </div>
            ) : (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-indigo-600">
                        {reportData?.summary?.totalMembers || 0}
                      </p>
                      <p className="text-sm text-gray-600">สมาชิกทั้งหมด</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {reportData?.summary?.averageAge || 0}
                      </p>
                      <p className="text-sm text-gray-600">อายุเฉลี่ย</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {reportData?.summary?.youngestAge || 0}
                      </p>
                      <p className="text-sm text-gray-600">อายุน้อยสุด</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">
                        {reportData?.summary?.oldestAge || 0}
                      </p>
                      <p className="text-sm text-gray-600">อายุมากสุด</p>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">กราฟจำนวนสมาชิกตามช่วงอายุ</h2>
                  {!reportData?.chartData || reportData.chartData.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p>ไม่มีข้อมูลสำหรับแสดงกราฟ</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={reportData.chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="ageRange" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#4f46e5" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                {/* Summary Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">รายงานจำนวนสมาชิกตามช่วงอายุ</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ช่วงอายุ
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            จำนวนสมาชิก
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            เปอร์เซ็นต์
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reportData?.ageGroups?.map((group) => (
                          <tr key={group.ageRange}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {group.ageRange} ปี
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {group.count} คน
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {group.percentage}%
                            </td>
                          </tr>
                        )) || (
                          <tr>
                            <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                              ไม่มีข้อมูล
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Total Summary */}
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">สมาชิกทั้งหมด:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {reportData?.summary?.totalMembers || 0} คน
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberManagementSystem;