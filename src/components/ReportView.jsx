"use client"

import { BarChart3, Loader2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

//  สำหรับแสดงหน้ารายงาน
const ReportView = ({ reportData, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
        <p className="text-gray-600">กำลังโหลดข้อมูลรายงาน...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
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
    </div>
  )
}

export default ReportView