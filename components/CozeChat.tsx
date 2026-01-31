'use client'; // 👈 这一行是关键，声明这是客户端组件

import Script from 'next/script';

export default function CozeChat() {
  return (
    <Script
      id="coze-sdk"
      strategy="afterInteractive"
      src="https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.19/libs/cn/index.js"
      onLoad={() => {
        // @ts-ignore
        new CozeWebSDK.WebChatClient({
          config: {
            bot_id: '7601481250146172962', // 您的 Bot ID
          },
          componentProps: {
            title: 'One Platform 助手',
          },
          auth: {
            type: 'token',
            // 👇 填入您的真实 Token
            token: 'pat_az1k8U756vt94ia0DJmQg2WFuhxOASdicOlIko4dANxWxZTycVbSM46BeXO36i9U', 
            onRefreshToken: function () {
              return 'pat_az1k8U756vt94ia0DJmQg2WFuhxOASdicOlIko4dANxWxZTycVbSM46BeXO36i9U'
            }
          }
        });
      }}
    />
  );
}