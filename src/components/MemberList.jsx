"use client"

import { User, Edit2, Trash2, Calendar, Loader2 } from 'lucide-react'

// Component สำหรับแสดงรายการสมาชิก
const MemberList = ({ 
  members, 
  loading, 
  handleEdit, 
  handleDelete 
}) => {
  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
        <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>
    )
  }

  if (members.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg">ไม่พบข้อมูลสมาชิก</p>
        <p>เพิ่มสมาชิกใหม่เพื่อเริ่มต้นใช้งาน</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-200">
      {members.map((member) => (
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
  )
}

export default MemberList