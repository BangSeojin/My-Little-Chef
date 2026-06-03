// 네이버 이미지 검색 API를 활용해 음식 이미지를 가져오는 API Route
// 클라이언트에서 음식 이름을 받아 관련 이미지와 출처를 반환함

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // URL에서 검색어 추출 (예: /api/image?query=김치찌개)
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
      return Response.json({ error: "검색어가 없습니다." }, { status: 400 });
    }

    // 네이버 이미지 검색 API 호출
    const response = await fetch(
      `https://openapi.naver.com/v1/search/image?query=${encodeURIComponent(query)}&display=1&sort=sim`,
      {
        headers: {
          "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID as string,
          "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET as string,
        },
      },
    );

    if (!response.ok) {
      throw new Error("네이버 API 호출 실패");
    }

    const data = await response.json();
    const item = data.items?.[0];

    if (!item) {
      return Response.json(
        { error: "이미지를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 이미지 URL과 출처 반환
    return Response.json({
      imageUrl: item.thumbnail, // 원본 대신 썸네일 사용 (SSL 오류 방지)
      thumbnail: item.thumbnail,
      sourceUrl: item.link, // 출처는 원본 링크 유지
      title: item.title.replace(/<[^>]*>/g, ""),
    });
  } catch (error) {
    console.error("이미지 검색 오류:", error);
    return Response.json(
      { error: "이미지 검색 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
