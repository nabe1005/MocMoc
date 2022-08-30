import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";
import { serve } from "https://deno.land/std@0.138.0/http/server.ts";
import { User } from "./user.ts";

// TODO: 本実装に使用するため、消さずに残す
// deno-lint-ignore prefer-const
let waitUsers: User[] = [];

console.log("Listening on http://localhost:8000");
serve((req) => {
  const pathname = new URL(req.url).pathname;
  console.log(pathname);

  if (req.method === "POST" && pathname === "/call") {
    const mockResult = { "contact_user_name": "", "contact_user_call_id": "" };
    return new Response(JSON.stringify(mockResult), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Controll-Allow-Origin": "*",
      },
    });
  }

  if (req.method === "GET" && pathname === "/categories") {
    const mockCategories = ["勉強", "筋トレ", "雑談"];
    return new Response(JSON.stringify(mockCategories), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Controll-Allow-Origin": "*",
      },
    });
  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
