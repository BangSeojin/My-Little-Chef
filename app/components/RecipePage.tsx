// 레시피 생성 페이지 (2번 화면)
// Gemini API를 호출해 레시피 3개를 스트리밍으로 보여주고 사용자가 원하는 레시피를 선택함

"use client";

import { useEffect, useState } from "react";
import { useApp } from "../lib/context";
import { Recipe } from "../lib/types";

export default function RecipePage() {
  const { preference, setRecipes, setSelectedRecipe, setCurrentPage } =
    useApp();
  const [streamingText, setStreamingText] = useState("");
  const [parsedRecipes, setParsedRecipes] = useState<Recipe[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const [error, setError] = useState("");

  // 다시 시도 버튼용 함수
  const generateRecipes = async () => {
    try {
      setStreamingText("");
      setParsedRecipes([]);
      setIsStreaming(true);
      setError("");

      const res = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preference),
      });

      if (!res.ok) throw new Error("레시피 생성 실패");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        fullText += chunk;
        setStreamingText(fullText);
      }

      try {
        // JSON 코드블록 제거 후 파싱 시도
        const cleaned = fullText
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const recipes = parsed.recipes as Recipe[];
          if (recipes && recipes.length > 0) {
            setParsedRecipes(recipes);
            setRecipes(recipes);
          } else {
            throw new Error("레시피 데이터가 없습니다.");
          }
        } else {
          throw new Error("JSON 형식을 찾을 수 없습니다.");
        }
      } catch (parseError) {
        console.error("JSON 파싱 오류:", parseError);
        console.error("원본 텍스트:", fullText);
        setError("레시피 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } catch (err) {
      setError("레시피 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error(err);
    } finally {
      setIsStreaming(false);
    }
  };

  // 컴포넌트 마운트 시 레시피 생성 시작
  useEffect(() => {
    // useEffect 안에서 직접 함수 정의 및 호출 (setState 경고 방지)
    const loadRecipes = async () => {
      try {
        setError("");
        setStreamingText("");
        setParsedRecipes([]);
        setIsStreaming(true);

        const res = await fetch("/api/recipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(preference),
        });

        if (!res.ok) throw new Error("레시피 생성 실패");

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          fullText += chunk;
          setStreamingText(fullText);
        }

        const jsonMatch = fullText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const recipes = parsed.recipes as Recipe[];
          setParsedRecipes(recipes);
          setRecipes(recipes);
        }
      } catch (err) {
        setError("레시피 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
        console.error(err);
      } finally {
        setIsStreaming(false);
      }
    };
    loadRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 레시피 선택 시 상세 페이지로 이동
  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setCurrentPage(3);
  };

  return (
    <main className="min-h-screen bg-amber-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => setCurrentPage(1)}
          className="flex items-center gap-1 text-amber-700 font-medium mb-6 hover:text-amber-900 transition"
        >
          ← 뒤로가기
        </button>

        <h1 className="text-2xl font-bold text-amber-800 mb-6">
          🍽️ 추천 레시피
        </h1>

        {/* 오류 메시지 */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4">
            {error}
            <button
              onClick={generateRecipes}
              className="ml-2 underline font-medium"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 로딩 중일 때 */}
        {isStreaming && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-amber-300 border-t-amber-600 rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">레시피를 생성하고 있어요...</p>
          </div>
        )}

        {/* 스트리밍 완료 후 레시피 카드 - PC에서 3열, 태블릿 2열, 모바일 1열 */}
        {!isStreaming && parsedRecipes.length > 0 && (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              원하는 레시피를 선택해주세요!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {parsedRecipes.map((recipe, index) => (
                <div
                  key={recipe.id}
                  onClick={() => handleSelectRecipe(recipe)}
                  className="bg-white rounded-2xl p-6 shadow-md cursor-pointer hover:shadow-lg hover:border-amber-300 border-2 border-transparent transition"
                >
                  {/* 레시피 번호와 이름 */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-amber-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <h2 className="text-lg font-bold text-amber-800">
                      {recipe.name}
                    </h2>
                  </div>

                  {/* 예상 시간 */}
                  <p className="text-sm text-gray-500 mb-3">
                    ⏱ {recipe.estimatedTime}
                  </p>

                  {/* 재료 목록 */}
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-600 mb-1">
                      재료
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {recipe.ingredients.map((ing, i) => (
                        <span
                          key={i}
                          className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded-full"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 조리 순서 미리보기 */}
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">
                      조리 순서
                    </p>
                    <ol className="text-sm text-gray-600 space-y-1">
                      {recipe.steps.slice(0, 2).map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                      {recipe.steps.length > 2 && (
                        <li className="text-amber-500">
                          + {recipe.steps.length - 2}단계 더보기...
                        </li>
                      )}
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
