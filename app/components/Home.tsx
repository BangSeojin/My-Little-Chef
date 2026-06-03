"use client";

import { useState } from "react";
import { useApp } from "../lib/context";
import BookmarkStorage from "./BookmarkStorage";

export default function Home() {
  const { preference, setPreference, setCurrentPage, setIsFromBookmark } =
    useApp();
  const [inputValue, setInputValue] = useState("");
  const [showBookmark, setShowBookmark] = useState(false);

  // 재료 추가
  const addIngredient = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (preference.ingredients.includes(trimmed)) return;
    setPreference({
      ...preference,
      ingredients: [...preference.ingredients, trimmed],
    });
    setInputValue("");
  };

  // 엔터키로 재료 추가
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addIngredient();
  };

  // 재료 삭제
  const removeIngredient = (ingredient: string) => {
    setPreference({
      ...preference,
      ingredients: preference.ingredients.filter((i) => i !== ingredient),
    });
  };

  // 레시피 생성 페이지로 이동
  const handleStart = () => {
    if (preference.ingredients.length === 0) {
      alert("재료를 최소 1개 이상 입력해주세요.");
      return;
    }
    setIsFromBookmark(false);
    setCurrentPage(2);
  };

  return (
    <main className="min-h-screen bg-amber-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-amber-800">🍳 MyLittleChef</h1>
          <button
            onClick={() => setShowBookmark(true)}
            className="bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-amber-700 transition"
          >
            📚 레시피 저장소
          </button>
        </div>

        {/* PC/태블릿: 2열, 모바일: 1열 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 왼쪽 열 */}
          <div className="space-y-4">
            {/* 재료 입력 */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                재료 입력
              </h2>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="재료를 입력하세요 (예: 계란)"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  onClick={addIngredient}
                  className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition"
                >
                  추가
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {preference.ingredients.map((ingredient) => (
                  <span
                    key={ingredient}
                    className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {ingredient}
                    <button
                      onClick={() => removeIngredient(ingredient)}
                      className="text-amber-500 hover:text-amber-700 font-bold ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 인원수 선택 */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                인원수
              </h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    setPreference({
                      ...preference,
                      servings: Math.max(1, preference.servings - 1),
                    })
                  }
                  className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold text-xl hover:bg-amber-200 transition"
                >
                  -
                </button>
                <span className="text-2xl font-bold text-amber-800">
                  {preference.servings}명
                </span>
                <button
                  onClick={() =>
                    setPreference({
                      ...preference,
                      servings: Math.min(10, preference.servings + 1),
                    })
                  }
                  className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold text-xl hover:bg-amber-200 transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 오른쪽 열 */}
          <div className="space-y-4">
            {/* 식사 유형 선택 */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                식사 유형
              </h2>
              <div className="grid grid-cols-4 gap-2">
                {(["아침", "점심", "저녁", "간식"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() =>
                      setPreference({ ...preference, mealType: type })
                    }
                    className={`py-2 rounded-lg text-sm font-medium transition ${
                      preference.mealType === type
                        ? "bg-amber-500 text-white"
                        : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* 레시피 생성 버튼 */}
            <button
              onClick={handleStart}
              className="w-full bg-amber-500 text-white py-4 rounded-2xl text-lg font-bold hover:bg-amber-600 transition shadow-md"
            >
              🍽️ 레시피 추천받기
            </button>
          </div>
        </div>
      </div>

      {showBookmark && (
        <BookmarkStorage onClose={() => setShowBookmark(false)} />
      )}
    </main>
  );
}
