// Groq API를 활용해 레시피를 생성하는 API Route
// 클라이언트에서 재료/인원수/식사유형을 받아 레시피 3개를 스트리밍으로 반환함

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { ingredients, servings, mealType } = await req.json();

    // 식사 유형별 추가 조건
    const mealTypeGuide: Record<string, string> = {
      아침: "속이 편하고 소화가 잘 되는 음식 위주로",
      점심: "든든하고 영양 균형이 맞는 음식 위주로",
      저녁: "맛있고 포만감 있는 음식 위주로",
      간식: "만들기 간단하고 가볍게 먹을 수 있는 음식 위주로",
    };

    const prompt = `
You are a Korean cuisine expert. Respond only in Korean language. Do not use any English, Chinese, or Japanese characters.

아래 조건에 맞는 한국인이 즐겨먹는 친숙한 한국 가정식 레시피 3가지를 추천해주세요.
모든 내용은 반드시 한국어로만 작성하세요.

재료: ${ingredients.join(", ")}
인원수: ${servings}명
식사 유형: ${mealType} (${mealTypeGuide[mealType]})

반드시 아래 JSON 형식으로만 응답해주세요. 다른 텍스트는 절대 포함하지 마세요.

{
  "recipes": [
    {
      "id": "1",
      "name": "레시피 이름",
      "ingredients": ["재료1 적정량", "재료2 적정량"],
      "steps": ["1. 조리 순서", "2. 조리 순서"],
      "estimatedTime": "약 20분"
    }
  ]
}
`;

    // Groq 스트리밍 응답 생성
    const stream = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "system",
          content:
            "You are a Korean cuisine expert. You must always respond in Korean language only. Never use English, Chinese,or Japanese characters in your response. Only output valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      stream: true,
    });

    // 스트리밍 응답을 클라이언트로 전달
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) {
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("레시피 생성 오류:", error);
    return Response.json(
      { error: "레시피 생성 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
