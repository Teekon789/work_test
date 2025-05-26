"use client"

import React, { useState, useEffect } from 'react'
import { Users, Loader2 } from 'lucide-react'
import Header from '@/components/Header'
import SearchControls from '@/components/SearchControls'
import MemberForm from '@/components/MemberForm'
import MemberList from '@/components/MemberList'
import ReportView from '@/components/ReportView'
import ErrorAlert from '@/components/ErrorAlert'

const MemberManagementSystem = () => {
  // State ต่างๆ
  const [members, setMembers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [currentView, setCurrentView] = useState('list')
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [reportData, setReportData] = useState(null)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    title: 'นาย',
    firstName: '',
    lastName: '',
    birthDate: '',
    profileImage: null
  })

  // ฟังก์ชันโหลดข้อมูลสมาชิกจาก API
  const fetchMembers = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/members')
      const result = await response.json()
      
      if (result.success) {
        setMembers(result.data)
      } else {
        setError(result.message || 'Failed to fetch members')
      }
    } catch (error) {
      setError('Failed to load members')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // ฟังก์ชันโหลดข้อมูลรายงานจาก API
  const fetchReportData = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/reports/age-groups')
      const result = await response.json()
      
      if (result.success) {
        setReportData(result.data)
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('Failed to load report data')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // โหลดข้อมูลเมื่อ component mount
  useEffect(() => {
    fetchMembers()
  }, [])

  // โหลดข้อมูลรายงานเมื่อเปลี่ยนเป็น view รายงาน
  useEffect(() => {
    if (currentView === 'report') {
      fetchReportData()
    }
  }, [currentView])

  // ฟังก์ชันเพิ่มหรือแก้ไขสมาชิก
  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    
    if (!formData.firstName || !formData.lastName || !formData.birthDate) {
      setError('Please fill in all required fields')
      return
    }
    
    setSubmitLoading(true)
    setError('')
  
    try {
      const url = editingMember 
        ? `/api/members/${editingMember.id}`
        : '/api/members'
        
      const method = editingMember ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        await fetchMembers()
        resetForm()
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('Failed to save member')
      console.error('Error:', error)
    } finally {
      setSubmitLoading(false)
    }
  }
  
  // ฟังก์ชันรีเซ็ตฟอร์ม
  const resetForm = () => {
    setFormData({
      title: 'นาย',
      firstName: '',
      lastName: '',
      birthDate: '',
      profileImage: null
    })
    setEditingMember(null)
    setShowForm(false)
    setError('')
  }

  // ฟังก์ชันแก้ไขสมาชิก
  const handleEdit = (member) => {
    setFormData({
      title: member.title,
      firstName: member.firstName,
      lastName: member.lastName,
      birthDate: member.birthDate,
      profileImage: member.profileImage
    })
    setEditingMember(member)
    setShowForm(true)
    setError('')
  }

  // ฟังก์ชันลบสมาชิก
  const handleDelete = async (id, memberName) => {
    if (!window.confirm(`Are you sure you want to delete ${memberName}?`)) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/members/${id}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (result.success) {
        await fetchMembers()
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('Failed to delete member')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // กรองและเรียงลำดับข้อมูลสมาชิก
  const filteredAndSortedMembers = members
    .filter(member => 
      `${member.firstName} ${member.lastName}`.toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'age') {
        return a.age - b.age
      } else if (sortBy === 'name') {
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
      }
      return 0
    })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header currentView={currentView} setCurrentView={setCurrentView} />

        {/* Error Alert */}
        {error && <ErrorAlert message={error} />}

        {currentView === 'list' && (
          <>
            {/* Search Controls */}
            <SearchControls
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              sortBy={sortBy}
              setSortBy={setSortBy}
              setShowForm={setShowForm}
              loading={loading}
            />

            {/* Member Form */}
            {showForm && (
              <MemberForm
                formData={formData}
                setFormData={setFormData}
                editingMember={editingMember}
                submitLoading={submitLoading}
                handleSubmit={handleSubmit}
                resetForm={resetForm}
                error={error}
                setError={setError}
              />
            )}

            {/* Members List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  รายชื่อสมาชิก ({filteredAndSortedMembers.length} คน)
                </h2>
              </div>
              
              <MemberList 
                members={filteredAndSortedMembers} 
                loading={loading} 
                handleEdit={handleEdit} 
                handleDelete={handleDelete} 
              />
            </div>
          </>
        )}

        {currentView === 'report' && (
          <ReportView reportData={reportData} loading={loading} />
        )}
      </div>
    </div>
  )
}

export default MemberManagementSystem