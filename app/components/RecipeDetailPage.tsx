"use client";

import { useEffect, useState } from "react";
import { useApp } from "../lib/context";

export default function RecipeDetailPage() {
  const { selectedRecipe, setSelectedRecipe, isFromBookmark, setCurrentPage } =
    useApp();
  const [imageUrl, setImageUrl] = useState("");
  const [imageSource, setImageSource] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!selectedRecipe) return;

    // 네이버 이미지 검색 API 호출
    const fetchImage = async () => {
      try {
        const res = await fetch(
          `/api/image?query=${encodeURIComponent(selectedRecipe.name)}`,
        );
        const data = await res.json();
        if (data.imageUrl) {
          setImageUrl(data.imageUrl);
          setImageSource(data.sourceUrl ?? "");
        }
      } catch (error) {
        console.error("이미지 불러오기 실패:", error);
        setImageError(true);
      }
    };

    fetchImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRecipe?.name]);

  // 이미지 정보를 selectedRecipe에 반영
  useEffect(() => {
    if (!selectedRecipe || !imageUrl) return;
    setSelectedRecipe({ ...selectedRecipe, imageUrl, imageSource });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);

  const handleComplete = () => setShowConfirm(true);

  const handleConfirmYes = () => {
    setShowConfirm(false);
    setCurrentPage(isFromBookmark ? 1 : 4);
  };

  // selectedRecipe가 없으면 아무것도 렌더링하지 않음
  if (!selectedRecipe) return null;

  return (
    <main className="min-h-screen bg-amber-50">
      {/* 음식 이미지 영역 */}
      <div className="relative w-full h-64 md:h-96">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={selectedRecipe.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-amber-200 flex items-center justify-center">
            <span className="text-6xl">🍳</span>
          </div>
        )}

        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => setCurrentPage(isFromBookmark ? 1 : 2)}
          className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm text-amber-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-white transition shadow"
        >
          ← 뒤로가기
        </button>

        {/* 이미지 출처 */}
        {imageSource && (
          <a
            href={imageSource}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 bg-black/40 text-white text-xs px-2 py-1 rounded"
          >
            이미지 출처
          </a>
        )}
      </div>

      {/* 레시피 상세 내용 - PC에서 2열 */}
      <div className="max-w-5xl mx-auto p-6 md:p-10">
        <h1 className="text-2xl font-bold text-amber-800 mb-1">
          {selectedRecipe.name}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          ⏱ {selectedRecipe.estimatedTime}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 재료 목록 */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">재료</h2>
            <ul className="space-y-2">
              {selectedRecipe.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <span className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0" />
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          {/* 조리 순서 */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              조리 순서
            </h2>
            <ol className="space-y-4">
              {selectedRecipe.steps.map((step, index) => (
                <li key={index} className="flex gap-3 text-sm text-gray-600">
                  <span className="bg-amber-500 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* 요리 완성 버튼 */}
        <button
          onClick={handleComplete}
          className="w-full mt-6 bg-amber-500 text-white py-4 rounded-2xl text-lg font-bold hover:bg-amber-600 transition shadow-md"
        >
          🎉 요리 완성!
        </button>
      </div>

      {/* 요리 완성 확인 모달 */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-xl">
            <p className="text-xl font-bold text-gray-800 mb-6">
              요리가 완성되었나요?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl border-2 border-amber-300 text-amber-700 font-semibold hover:bg-amber-50 transition"
              >
                아뇨
              </button>
              <button
                onClick={handleConfirmYes}
                className="flex-1 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition"
              >
                네
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
