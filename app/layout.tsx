// 앱 전체의 레이아웃을 담당하는 파일
// AppProvider로 감싸서 모든 페이지에서 전역 상태를 사용할 수 있게 함

import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "./lib/context";

export const metadata: Metadata = {
  title: "MyLittleChef",
  description: "냉장고 재료로 만드는 AI 레시피 추천 서비스",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "MyLittleChef",
    description: "냉장고 재료로 만드는 AI 레시피 추천 서비스",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {/* 전역 상태를 모든 페이지에 제공 */}
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
