// 프로젝트 전체에서 사용하는 타입 정의 파일
// TypeScript에서 데이터 구조를 명확하게 정의해두면 오류를 사전에 방지할 수 있음

// 레시피 한 개의 구조
export interface Recipe {
  id: string; // 레시피 고유 ID
  name: string; // 레시피 이름
  ingredients: string[]; // 필요한 재료 목록
  steps: string[]; // 조리 순서
  estimatedTime: string; // 예상 조리 시간
  imageUrl?: string; // 음식 이미지 URL (없을 수도 있음)
  imageSource?: string; // 이미지 출처 URL
  imageAuthor?: string; // 이미지 작성자
}

// 북마크 저장 시 MongoDB에 저장되는 구조
export interface SavedRecipe extends Recipe {
  _id?: string; // MongoDB 자동 생성 ID
  savedAt: Date; // 저장된 날짜
}

// 재료 입력 페이지에서 사용하는 사용자 설정 구조
export interface UserPreference {
  ingredients: string[]; // 입력한 재료 목록
  servings: number; // 인원수
  mealType: "아침" | "점심" | "저녁" | "간식"; // 식사 유형
}

// 네이버 이미지 검색 API 응답 구조
export interface NaverImageResult {
  title: string; // 이미지 제목
  link: string; // 이미지 링크
  thumbnail: string; // 썸네일 URL
  sizeheight: string; // 이미지 높이
  sizewidth: string; // 이미지 너비
}
