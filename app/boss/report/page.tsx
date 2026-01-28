// app/boss/report/page.tsx
import { createClient as createServerSupabaseClient } from '@/utils/supabase/server_backup';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import AuditButton from '../audit-button';

// 定义资产数据类型
interface Asset {
  id: string;
  name: string;
  type: '专利' | '软著';
  ai_score?: string;
  ai_risk_level?: string;
  ai_comment?: string;
  expiry_date: string; // 从 Supabase 读取的日期可能是 ISO 字符串
  has_project: boolean;
}

export default async function BossReportPage() {
  const supabase = await createServerSupabaseClient();

  // 从 Supabase 读取所有 assets 数据
  const { data: assets, error } = await supabase.from('assets').select('*');

  if (error) {
    console.error('Error fetching assets:', error);
    return (
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-red-600">加载资产数据失败</h1>
        <p className="text-center text-gray-600">请稍后再试或联系管理员。</p>
      </div>
    );
  }

  // 计算高风险资产总数
  const highRiskAssets = assets?.filter((asset) => !asset.has_project) || [];
  const highRiskCount = highRiskAssets.length;

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* 顶部风险统计看板 */}
      <Card className="mb-8 bg-red-100 border-red-400 shadow-lg text-center">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-red-700">风险资产总数</CardTitle>
          <CardDescription className="text-5xl md:text-6xl font-extrabold text-red-800 animate-pulse">
            {highRiskCount}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* 资产列表 */}
      <div className="grid grid-cols-1 gap-4">
        {assets && assets.length > 0 ? (
          assets.map((asset) => (
            <Card
              key={asset.id}
              className={
                asset.has_project
                  ? 'bg-white border-gray-200'
                  : 'bg-red-50 border-red-300' // 淡红色背景，突出风险
              }
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {asset.name}
                </CardTitle>
                <Badge
                  className={
                    asset.has_project
                      ? 'bg-green-100 text-green-700 hover:bg-green-100'
                      : 'bg-red-200 text-red-800 hover:bg-red-200' // 红色警告标签
                  }
                >
                  {asset.has_project ? '✅ 合规' : '⚠️ 未关联项目'}
                </Badge>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <p>类型: {asset.type}</p>
                {asset.expiry_date && (
                  <p>到期日: {format(new Date(asset.expiry_date), 'yyyy年MM月dd日')}</p>
                  
                )}
              <AuditButton 
              assetName={asset.name} 
              initialData={{
              score: asset.ai_score,
              risk_level: asset.ai_risk_level,
              comment: asset.ai_comment
                }}
/>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-600 mt-10">暂无资产数据可显示。</p>
        )}
      </div>
    </div>
  );
}