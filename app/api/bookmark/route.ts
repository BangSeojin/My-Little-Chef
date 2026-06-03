// 북마크 저장/불러오기/삭제를 담당하는 API Route
// GET: 저장된 모든 북마크 불러오기
// POST: 새 레시피 북마크 저장
// DELETE: 특정 북마크 삭제

import { ObjectId } from "mongodb";
import clientPromise from "@/app/lib/mongodb";

// 데이터베이스와 컬렉션 이름 상수
const DB_NAME = "mylittlechef";
const COLLECTION_NAME = "bookmarks";

// 저장된 모든 북마크 불러오기
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // 저장 날짜 기준 최신순으로 정렬
    const bookmarks = await db
      .collection(COLLECTION_NAME)
      .find({})
      .sort({ savedAt: -1 })
      .toArray();

    return Response.json(bookmarks);
  } catch (error) {
    console.error("북마크 불러오기 오류:", error);
    return Response.json(
      { error: "북마크를 불러오는 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

// 새 레시피 북마크 저장
export async function POST(req: Request) {
  try {
    const recipe = await req.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // 저장 날짜 추가
    const savedRecipe = {
      ...recipe,
      savedAt: new Date(),
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(savedRecipe);

    return Response.json({
      success: true,
      id: result.insertedId,
    });
  } catch (error) {
    console.error("북마크 저장 오류:", error);
    return Response.json(
      { error: "북마크 저장 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

// 특정 북마크 삭제
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });

    return Response.json({ success: true });
  } catch (error) {
    console.error("북마크 삭제 오류:", error);
    return Response.json(
      { error: "북마크 삭제 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
