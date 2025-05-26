"use client"

import { Users, BarChart3 } from 'lucide-react'

// Component ส่วนหัวของแอปพลิเคชัน
const Header = ({ currentView, setCurrentView }) => {
  return (
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
  )
}

export default Header