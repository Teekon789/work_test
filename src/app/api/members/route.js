import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

// GET - ดึงข้อมูลสมาชิกทั้งหมด
export async function GET() {
  try {
    const members = await executeQuery(`
      SELECT 
        id, 
        title, 
        first_name AS firstName, 
        last_name AS lastName, 
        birth_date AS birthDate, 
        profile_image AS profileImage,
        TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) AS age,
        DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') AS lastUpdated
      FROM members
      ORDER BY first_name, last_name
    `);

    return NextResponse.json({ 
      success: true,
      data: members,
      message: 'ดึงข้อมูลสมาชิกสำเร็จ'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  }
}

// POST - เพิ่มสมาชิกใหม่
export async function POST(request) {
  try {
    const newMember = await request.json();
    
    if (!newMember.firstName || !newMember.lastName || !newMember.birthDate) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    const result = await executeQuery(
      `INSERT INTO members 
      (title, first_name, last_name, birth_date, profile_image) 
      VALUES (?, ?, ?, ?, ?)`,
      [
        newMember.title || 'นาย',
        newMember.firstName,
        newMember.lastName,
        newMember.birthDate,
        newMember.profileImage || null
      ]
    );

    const insertedMember = await executeQuery(
      `SELECT 
        id, 
        title, 
        first_name AS firstName, 
        last_name AS lastName, 
        birth_date AS birthDate, 
        profile_image AS profileImage,
        TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) AS age
      FROM members 
      WHERE id = ?`,
      [result.insertId]
    );

    return NextResponse.json({ 
      success: true,
      data: insertedMember[0],
      message: 'เพิ่มสมาชิกใหม่สำเร็จ'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล' },
      { status: 500 }
    );
  }
}