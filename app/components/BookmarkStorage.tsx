// 레시피 저장소 모달 컴포넌트 (1-1번 화면)
// 북마크된 레시피 목록을 보여주고 클릭하면 해당 레시피 상세로 이동함

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useApp } from "../lib/context";
import { SavedRecipe } from "../lib/types";

interface Props {
  onClose: () => void;
}

export default function BookmarkStorage({ onClose }: Props) {
  const { setSelectedRecipe, setIsFromBookmark, setCurrentPage } = useApp();
  const [bookmarks, setBookmarks] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  // 컴포넌트 마운트 시 북마크 목록 불러오기
  useEffect(() => {
    // useEffect 안에서 직접 함수 정의 및 호출 (setState 경고 방지)
    const loadBookmarks = async () => {
      try {
        const res = await fetch("/api/bookmark");
        const data = await res.json();
        setBookmarks(data);
      } catch (error) {
        console.error("북마크 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBookmarks();
  }, []);

  // 북마크 클릭 시 해당 레시피 상세 페이지로 이동
  const handleBookmarkClick = (recipe: SavedRecipe) => {
    setSelectedRecipe(recipe);
    setIsFromBookmark(true); // 저장소에서 진입했음을 표시 (4번 화면 스킵용)
    setCurrentPage(3);
    onClose();
  };

  // 북마크 삭제
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    try {
      await fetch("/api/bookmark", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      // 삭제 후 목록 갱신
      setBookmarks(bookmarks.filter((b) => b._id !== id));
    } catch (error) {
      console.error("북마크 삭제 실패:", error);
    }
  };

  return (
    // 모달 배경
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        {/* 모달 헤더 */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-amber-800">📚 레시피 저장소</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* 북마크 목록 */}
        <div className="overflow-y-auto flex-1 p-6">
          {loading ? (
            <p className="text-center text-gray-400">불러오는 중...</p>
          ) : bookmarks.length === 0 ? (
            <p className="text-center text-gray-400">저장된 레시피가 없어요.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark._id}
                  onClick={() => handleBookmarkClick(bookmark)}
                  className="relative cursor-pointer rounded-xl overflow-hidden aspect-square"
                >
                  {/* 음식 이미지 */}
                  {bookmark.imageUrl ? (
                    <Image
                      src={bookmark.imageUrl}
                      alt={bookmark.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-amber-100 flex items-center justify-center">
                      <span className="text-4xl">🍳</span>
                    </div>
                  )}

                  {/* 반투명 흰색 오버레이 + 레시피 이름 */}
                  <div className="absolute inset-0 bg-white/60 flex items-center justify-center p-2">
                    <p className="text-amber-900 font-bold text-center text-sm">
                      {bookmark.name}
                    </p>
                  </div>

                  {/* 삭제 버튼 */}
                  <button
                    onClick={(e) => handleDelete(e, bookmark._id!)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 z-10"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
