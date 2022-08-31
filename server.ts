import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";
import { serve } from "https://deno.land/std@0.138.0/http/server.ts";
import { User } from "./user.ts";

const waitUsers: User[] = [];

console.log("Listening on http://localhost:8000");
serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  console.log(pathname);

  if (req.method === "POST" && pathname === "/api/call") {
    const requestJson = await req.json();
    const user: User = {
      userName: requestJson["user_name"],
      callId: requestJson["call_id"],
      category: requestJson["category"],
    };
    console.log(user);

    // マッチングユーザーの検索
    const sameCategoryUserIndex = waitUsers.findIndex((waitUser) =>
      waitUser.category === user.category
    );

    // レスポンス作成
    let response = { "contact_user_name": "", "contact_user_call_id": "" };
    if (sameCategoryUserIndex !== -1) {
      const user = waitUsers[sameCategoryUserIndex];
      response = {
        "contact_user_name": user.userName,
        "contact_user_call_id": user.callId,
      };
      waitUsers.splice(sameCategoryUserIndex, 1);
    } else {
      waitUsers.push(user);
    }

    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  }

  if (req.method === "GET" && pathname === "/api/categories") {
    const mockCategories = ["勉強", "筋トレ", "プログラミング"];
    return new Response(JSON.stringify(mockCategories), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  }

  if (req.method === "POST" && pathname === "/api/cancel") {
    const requestJson = await req.json();
    const callId = requestJson["call_id"];
    waitUsers.splice(
      waitUsers.findIndex((waitUser) => waitUser.callId === callId),
      1,
    );

    return new Response(JSON.stringify(waitUsers), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  }

  return serveDir(req, {
    fsRoot: "frontend",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
