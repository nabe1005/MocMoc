const host = "/api/";

export async function get(path) {
  return await (await fetch(`${host}${path}`, { mode: "cors" })).json();
}

export async function post(path, data) {
  const method = "POST";
  const body = JSON.stringify(data);
  const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
  };
  return await (await fetch(`${host}${path}`, { method, headers, body }))
    .json();
}
