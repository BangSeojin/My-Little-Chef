// 페이지 간 데이터를 공유하는 전역 상태 관리 파일
// 재료 목록, 인원수, 식사유형, 생성된 레시피, 선택된 레시피 등을 전역으로 관리함

"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Recipe, UserPreference } from "./types";

// 전역 상태 구조 정의
interface AppContextType {
  // 사용자 입력 설정
  preference: UserPreference;
  setPreference: (preference: UserPreference) => void;

  // Gemini가 생성한 레시피 3개
  recipes: Recipe[];
  setRecipes: (recipes: Recipe[]) => void;

  // 사용자가 선택한 레시피 1개
  selectedRecipe: Recipe | null;
  setSelectedRecipe: (recipe: Recipe | null) => void;

  // 1-1 저장소에서 레시피를 선택했는지 여부 (4번 저장 화면 스킵용)
  isFromBookmark: boolean;
  setIsFromBookmark: (value: boolean) => void;

  // 현재 페이지 (1: 메인, 2: 레시피 생성, 3: 상세, 4: 저장)
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

// Context 생성
const AppContext = createContext<AppContextType | undefined>(undefined);

// 전역 상태를 제공하는 Provider 컴포넌트
export function AppProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<UserPreference>({
    ingredients: [],
    servings: 1,
    mealType: "점심",
  });
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isFromBookmark, setIsFromBookmark] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <AppContext.Provider
      value={{
        preference,
        setPreference,
        recipes,
        setRecipes,
        selectedRecipe,
        setSelectedRecipe,
        isFromBookmark,
        setIsFromBookmark,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Context를 쉽게 사용하기 위한 커스텀 훅
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp은 AppProvider 안에서만 사용할 수 있습니다.");
  }
  return context;
}
