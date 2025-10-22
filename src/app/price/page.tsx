import Link from "next/link";

export default function PricePage() {
  const plans = [
    {
      name: "免费版",
      price: "¥0",
      period: "永久免费",
      description: "适合个人用户和初学者",
      features: [
        "基础AI对话功能",
        "每日10次对话限制",
        "标准响应速度",
        "社区支持",
        "基础工具调用"
      ],
      buttonText: "开始使用",
      buttonStyle: "border border-gray-300 text-gray-700 hover:bg-gray-50",
      popular: false
    },
    {
      name: "专业版",
      price: "¥20",
      period: "每月",
      description: "适合专业用户和小团队",
      features: [
        "无限制AI对话",
        "高级工具调用",
        "优先响应速度",
        "邮件技术支持",
        "自定义Agent配置",
        "API访问权限"
      ],
      buttonText: "立即订阅",
      buttonStyle: "bg-blue-600 text-white hover:bg-blue-700",
      popular: true
    },
    {
      name: "企业版",
      price: "¥220",
      period: "每年",
      description: "适合企业用户和大团队",
      features: [
        "专业版所有功能",
        "团队协作功能",
        "专属客服支持",
        "定制化开发",
        "数据导出功能",
        "SLA服务保障",
        "私有部署选项"
      ],
      buttonText: "联系销售",
      buttonStyle: "bg-green-600 text-white hover:bg-green-700",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            选择适合您的方案
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            无论您是个人用户还是企业团队，我们都有适合您的AI Agent解决方案
          </p>
        </div>

        {/* 价格卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
            >
              {/* 推荐标签 */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    最受欢迎
                  </span>
                </div>
              )}

              {/* 方案名称和价格 */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">
                    {plan.period}
                  </span>
                </div>
                <p className="text-gray-600">
                  {plan.description}
                </p>
              </div>

              {/* 功能列表 */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* 按钮 */}
              <div className="text-center">
                <Link
                  href={plan.name === "企业版" ? "/contact" : "/signup"}
                  className={`inline-block w-full py-3 px-6 rounded-lg font-medium transition-colors ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* 底部说明 */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            所有方案都支持7天免费试用，不满意可随时取消
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <span>✓ 安全支付</span>
            <span>✓ 随时取消</span>
            <span>✓ 技术支持</span>
          </div>
        </div>

        {/* 返回首页链接 */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
