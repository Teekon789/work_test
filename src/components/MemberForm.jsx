"use client"

import { useState } from 'react'
import { Save, X, FileImage, Loader2 } from 'lucide-react'

// สำหรับฟอร์มเพิ่ม/แก้ไขสมาชิก
const MemberForm = ({ 
  formData, 
  setFormData, 
  editingMember, 
  submitLoading, 
  handleSubmit, 
  resetForm,
  error,
  setError
}) => {
  // จัดการอัพโหลดรูปภาพ
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // ตรวจสอบขนาดไฟล์ (จำกัดที่ 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('ขนาดไฟล์รูปภาพต้องไม่เกิน 5MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData({...formData, profileImage: e.target.result})
      }
      reader.readAsDataURL(file)
    }
  }

  return (
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
  )
}

export default MemberForm