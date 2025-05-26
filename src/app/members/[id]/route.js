import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

// GET - ดึงข้อมูลสมาชิกโดย ID
export async function GET(request, { params }) {
  try {
    const member = await executeQuery(
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
      [params.id]
    );

    if (!member.length) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบสมาชิก' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      data: member[0],
      message: 'ดึงข้อมูลสมาชิกสำเร็จ'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  }
}

// PUT - อัปเดตข้อมูลสมาชิก
export async function PUT(request, { params }) {
  try {
    const updatedData = await request.json();
    
    await executeQuery(
      `UPDATE members SET
        title = ?,
        first_name = ?,
        last_name = ?,
        birth_date = ?,
        profile_image = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [
        updatedData.title,
        updatedData.firstName,
        updatedData.lastName,
        updatedData.birthDate,
        updatedData.profileImage || null,
        params.id
      ]
    );

    const updatedMember = await executeQuery(
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
      [params.id]
    );

    return NextResponse.json({ 
      success: true,
      data: updatedMember[0],
      message: 'อัปเดตข้อมูลสมาชิกสำเร็จ'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' },
      { status: 500 }
    );
  }
}

// DELETE - ลบสมาชิก
export async function DELETE(request, { params }) {
  try {
    const member = await executeQuery(
      `SELECT first_name, last_name FROM members WHERE id = ?`,
      [params.id]
    );

    if (!member.length) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบสมาชิก' },
        { status: 404 }
      );
    }

    await executeQuery(
      `DELETE FROM members WHERE id = ?`,
      [params.id]
    );

    return NextResponse.json({ 
      success: true,
      data: {
        id: params.id,
        name: `${member[0].first_name} ${member[0].last_name}`
      },
      message: 'ลบสมาชิกสำเร็จ'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'เกิดข้อผิดพลาดในการลบข้อมูล' },
      { status: 500 }
    );
  }
}