const host = "/api/";

export async function get(path) {
  return await (await fetch(`${host}${path}`, { mode: "cors" })).json();
}

export function onLoad() {
  const circle = document.querySelector('.move-circle')
  circle.style.height = '0'
  circle.style.width = '0'
}

export async function beforeMove() {
  const circle = document.querySelector('.move-circle')
  circle.style.height = '250vh'
  circle.style.width = '250vh'
  await new Promise(resolve => setTimeout(resolve, 300))
}