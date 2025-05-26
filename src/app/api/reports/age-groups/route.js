import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

// GET - สร้างรายงานกลุ่มอายุ
export async function GET() {
  try {
    // ดึงข้อมูลสมาชิกทั้งหมดพร้อมอายุ
    const members = await executeQuery(`
      SELECT 
        id,
        TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) AS age
      FROM members
    `);

    // กลุ่มอายุ
    const ageGroups = [
      { range: '0-20', min: 0, max: 20 },
      { range: '21-30', min: 21, max: 30 },
      { range: '31-40', min: 31, max: 40 },
      { range: '41-50', min: 41, max: 50 },
      { range: '51+', min: 51, max: 999 } // ใช้ 999 แทน Infinity
    ];

    // คำนวณจำนวนสมาชิกในแต่ละกลุ่มอายุ
    const ageGroupData = ageGroups.map(group => {
      const count = members.filter(member => 
        member.age >= group.min && member.age <= group.max
      ).length;

      return {
        ageRange: group.range,
        count,
        percentage: members.length > 0 ? Math.round((count / members.length) * 100) : 0
      };
    });

    // หาค่าสถิติสรุป
    const ages = members.map(member => member.age);
    const summary = {
      totalMembers: members.length,
      averageAge: members.length > 0 ? Math.round(ages.reduce((a, b) => a + b, 0) / members.length) : 0,
      youngestAge: ages.length > 0 ? Math.min(...ages) : 0,
      oldestAge: ages.length > 0 ? Math.max(...ages) : 0
    };

    return NextResponse.json({
      success: true,
      data: {
        chartData: ageGroupData.map(group => ({
          ageRange: group.ageRange,
          count: group.count
        })),
        ageGroups: ageGroupData,
        summary
      },
      message: 'ดึงข้อมูลรายงานสำเร็จ'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'เกิดข้อผิดพลาดในการสร้างรายงาน' },
      { status: 500 }
    );
  }
}