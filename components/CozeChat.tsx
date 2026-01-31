'use client';

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
            bot_id: '7601481250146172962',
          },
          componentProps: {
            title: 'One Platform 助手',
          },
          auth: {
            type: 'token',
            // 👇 记得确认这里的 Token 是否正确
            token: 'pat_az1k8U756vT94ia0DJmQg2WFuhxOASdico1Iko4dANxWxZTycVbSM46BeXO36i9U',
            onRefreshToken: function () {
              return 'pat_az1k8U756vT94ia0DJmQg2WFuhxOASdico1Iko4dANxWxZTycVbSM46BeXO36i9U'
            }
          }
        });
      }}
    />
  );
}