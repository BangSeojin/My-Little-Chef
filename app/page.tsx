// 메인 페이지 (1번 화면)
// 재료 입력, 인원수/식사유형 선택, 레시피 저장소 버튼을 담당함

// 페이지 라우팅을 담당하는 메인 파일
// currentPage 값에 따라 알맞은 페이지 컴포넌트를 보여줌

"use client";

import { useApp } from "./lib/context";
import Home from "./components/Home";
import RecipePage from "./components/RecipePage";
import RecipeDetailPage from "./components/RecipeDetailPage";
import SavePage from "./components/SavePage";

export default function Page() {
  const { currentPage } = useApp();

  return (
    <>
      {currentPage === 1 && <Home />}
      {currentPage === 2 && <RecipePage />}
      {currentPage === 3 && <RecipeDetailPage />}
      {currentPage === 4 && <SavePage />}
    </>
  );
}
