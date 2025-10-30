export default {
  async fetch(request, env) {
    // 只接受 POST
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "請使用 POST 請求並附上 JSON body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    try {
      const input = await request.json();

      if (!input.prompt) {
        return new Response(
          JSON.stringify({ error: "缺少 prompt 欄位" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // 確認 env.AI 已設定
      if (!env.AI) {
        return new Response(
          JSON.stringify({ error: "AI binding 尚未設定" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      const response = await env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct",
        {
          messages: [
            { role: "system", content: "你是一個有禮貌的助理" },
            { role: "user", content: input.prompt },
          ],
        }
      );

      return new Response(JSON.stringify(response), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
