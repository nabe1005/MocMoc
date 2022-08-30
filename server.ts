import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";
import { serve } from "https://deno.land/std@0.138.0/http/server.ts";
import { User } from "./user.ts";

// TODO: 本実装に使用するため、消さずに残す
// deno-lint-ignore prefer-const
let waitUsers: User[] = [];

console.log("Listening on http://localhost:8000");
serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  console.log(pathname);

  if (req.method === "POST" && pathname === "/api/call") {
    const requestJson = await req.json();
    const user: User = {
      userName: requestJson.userName,
      callId: requestJson.callId,
      category: requestJson.category,
    };
    waitUsers.push(user);

    let response = { "contact_user_name": "", "contact_user_call_id": "" };
    if (waitUsers.length !== 0) {
      const user = waitUsers[0];
      response = {
        "contact_user_name": user.userName,
        "contact_user_call_id": user.callId,
      };
    }

    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  if (req.method === "GET" && pathname === "/api/categories") {
    const mockCategories = ["勉強", "筋トレ", "雑談"];
    return new Response(JSON.stringify(mockCategories), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Controll-Allow-Origin": "*",
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
