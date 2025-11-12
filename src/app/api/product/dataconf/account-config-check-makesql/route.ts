import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body;

    console.log('[生成科目配置SQL] 前端页面传入的数据:', { itemsCount: items?.length || 0 });

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ 
        success: false, 
        data: null, 
        message: '没有数据可生成SQL', 
        error: 'items为空或不是数组' 
      });
    }

    // 生成SQL语句
    const sqlValues = items.map((row: any, index: number) => {
      const hotelid = (row.hotelid || '').replace(/'/g, "''");
      const dept = (row.dept || '').replace(/'/g, "''");
      const deptname = (row.deptname || '').replace(/'/g, "''");
      const class1 = (row.class1 || '').replace(/'/g, "''");
      const descript1 = (row.descript1 || '').replace(/'/g, "''");
      const sort = (index + 1) * 10; // 自增数字，每10递增

      // 根据映射关系：class 对应 class1，descript 对应 descript1
      return `('${hotelid}', '${dept}', '${deptname}', '${class1}', '${descript1}', '${class1}', '${descript1}', ${sort})`;
    });

    const sqlContent = `INSERT INTO [Report].[dbo].TransCodeConfig (hotelid, dept, deptname, class, descript, class1, descript1, sort) VALUES ${sqlValues.join(',\n')};`;

    // 生成文件名
    const fileName = `科目配置SQL_${new Date().toISOString().split('T')[0]}_${Date.now()}.sql`;

    console.log('[生成科目配置SQL] 生成的SQL语句行数:', sqlValues.length);
    console.log('[生成科目配置SQL] 文件名:', fileName);

    const responseData = {
      sqlContent,
      fileName,
      count: items.length,
    };

    console.log('[生成科目配置SQL] 返回给前端的内容:', JSON.stringify({ ...responseData, sqlContent: sqlContent.substring(0, 200) + '...' }, null, 2));

    return NextResponse.json({ success: true, data: responseData, message: '生成SQL成功' });
  } catch (error) {
    console.error('[生成科目配置SQL] 生成失败:', error);
    return NextResponse.json({ 
      success: false, 
      data: null, 
      message: '生成SQL失败', 
      error: error instanceof Error ? error.message : '未知错误' 
    });
  }
}

