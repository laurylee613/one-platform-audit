'use client';

import { useEffect } from 'react';

export default function CozeWidget() {
  useEffect(() => {
    // 1. 动态创建 script 标签 (原生 JS，绕过 Next.js 的检查)
    const script = document.createElement('script');
    script.src = "https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.19/libs/cn/index.js";
    script.async = true;

    // 2. 加载完成后初始化
    script.onload = () => {
      // @ts-ignore
      if (window.CozeWebSDK) {
          // @ts-ignore
          new window.CozeWebSDK.WebChatClient({
            config: {
              bot_id: '7601481250146172962', // 您的 Bot ID
            },
            componentProps: {
              title: 'One Platform 助手',
            },
            auth: {
              type: 'token',
              // 👇 再次确认这里填的是您的真实 Token
              token: 'pat_az1k8U756vt94ia0DJmQg2WFuhxOASdicOlIko4dANxWxZTycVbSM46BeXO36i9U',
              onRefreshToken: function () {
                return 'pat_az1k8U756vt94ia0DJmQg2WFuhxOASdicOlIko4dANxWxZTycVbSM46BeXO36i9U'
              }
            }
          });
      }
    };

    // 3. 挂载到页面
    document.body.appendChild(script);

    // 4. 清理机制
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return null; // 不渲染任何 Next.js 组件
}