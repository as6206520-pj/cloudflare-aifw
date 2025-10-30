export default {
  async fetch(request, env, ctx) {
    const input = await request.json();

    const response = await env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct",
      {
        messages: [
          { role: "system", content: "你是一個有禮貌的助理" },
          { role: "user", content: input.prompt },
        ],
      }
    );

    return Response.json(response);
  },
};


