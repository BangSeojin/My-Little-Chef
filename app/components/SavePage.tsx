// 레시피 저장 페이지 (4번 화면)
// 요리가 완성된 후 레시피를 북마크로 저장할지 묻는 페이지

"use client";

import Image from "next/image";
import { useState } from "react";
import { useApp } from "../lib/context";

export default function SavePage() {
  const { selectedRecipe, setCurrentPage } = useApp();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // MongoDB에 레시피 북마크 저장
  const handleSave = async () => {
    if (!selectedRecipe || saved) return;
    setLoading(true);
    try {
      await fetch("/api/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedRecipe),
      });
      setSaved(true);
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRecipe) return null;

  return (
    <main className="min-h-screen bg-amber-50 p-6 md:p-10 flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => setCurrentPage(3)}
          className="flex items-center gap-1 text-amber-700 font-medium mb-6 hover:text-amber-900 transition"
        >
          ← 뒤로가기
        </button>

        {/* PC에서 2열 레이아웃 */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* 왼쪽: 완성 축하 + 이미지 */}
          <div className="flex flex-col items-center text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold text-amber-800 mb-2">
              수고하셨어요!
            </h1>
            <p className="text-gray-500 mb-4">
              <span className="font-semibold text-amber-700">
                {selectedRecipe.name}
              </span>{" "}
              완성!
            </p>

            {/* 레시피 이미지 */}
            {selectedRecipe.imageUrl && (
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-md">
                <Image
                  src={selectedRecipe.imageUrl}
                  alt={selectedRecipe.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* 오른쪽: 저장 버튼 + 처음으로 */}
          <div className="space-y-4">
            {/* 저장 여부 질문 */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <p className="text-lg font-semibold text-gray-700 mb-4">
                이번 레시피가 마음에 드셨나요?
              </p>

              {saved ? (
                <div className="bg-amber-50 text-amber-700 py-3 rounded-xl font-semibold text-center">
                  ✅ 레시피 저장소에 저장되었어요!
                </div>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full bg-amber-500 text-white py-3 rounded-xl font-semibold hover:bg-amber-600 transition disabled:opacity-50"
                >
                  {loading ? "저장 중..." : "📚 저장하기"}
                </button>
              )}
            </div>

            {/* 처음으로 돌아가기 */}
            <button
              onClick={() => setCurrentPage(1)}
              className="w-full border-2 border-amber-300 text-amber-700 py-3 rounded-xl font-semibold hover:bg-amber-50 transition"
            >
              🏠 처음으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
