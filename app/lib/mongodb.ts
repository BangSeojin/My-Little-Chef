// MongoDB 연결을 관리하는 파일
// 매번 새로운 연결을 만들지 않고 기존 연결을 재사용함 (Next.js 최적화)

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error("MONGODB_URI 환경변수가 설정되지 않았습니다.");
}

// 전역 변수로 클라이언트를 캐싱 (개발 환경에서 연결 중복 방지)
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
