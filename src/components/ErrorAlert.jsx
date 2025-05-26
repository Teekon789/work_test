"use client"

import { AlertCircle } from 'lucide-react'

// Component สำหรับแสดงข้อความผิดพลาด
const ErrorAlert = ({ message }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start space-x-3">
    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
    <div className="text-red-700 text-sm">{message}</div>
  </div>
)

export default ErrorAlert