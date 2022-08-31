const Peer = window.Peer;
window.__SKYWAY_KEY__ = "6dbe3db2-b095-4e99-8707-b0b102c42066";
import { post } from "../shared/api.js";

export async function main() {
  const localVideo = document.getElementById("js-local-stream");
  const closeTrigger = document.getElementById("js-close-trigger");
  const remoteVideo = document.getElementById("js-remote-stream");
  const loading = document.getElementById("js-loading");
  const category = document.getElementById("js-category-name");
  const goTopTrigger = document.getElementById("js-go-top-trigger");
  const cancelTrigger = document.getElementById("js-cancel-trigger");

  goTopTrigger.style.display = "none";
  category.innerHTML = localStorage.getItem("search-category") + "をしよう！";
  cancelTrigger.style.display = "none";

  goTopTrigger.onclick = () => {
    location.href = "/categories";
  };

  const localStream = await navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true,
    })
    .catch(console.error);

  // Render local stream
  localVideo.muted = true;
  localVideo.srcObject = localStream;
  localVideo.playsInline = true;
  await localVideo.play().catch(console.error);

  const peer = (window.peer = new Peer({
    key: window.__SKYWAY_KEY__,
    debug: 3,
  }));

  peer.once("open", async (id) => {
    console.log(id);
    const matchData = {
      call_id: id,
      user_name: localStorage.getItem("user_name"),
      category: localStorage.getItem("search-category"),
    };

    cancelTrigger.style.display = "block";
    cancelTrigger.onclick = async () => {
      await post("cancel", matchData);
      location.href = "/categories";
    };
    const match = await post("call", matchData);

    if (!match.contact_user_name || !match.contact_user_call_id) return;

    loading.style.display = "none";
    // Note that you need to ensure the peer has connected to signaling server
    // before using methods of peer instance.
    if (!peer.open) {
      return;
    }

    const mediaConnection = peer.call(match.contact_user_call_id, localStream);

    mediaConnection.on("stream", async (stream) => {
      // Render remote stream for caller
      remoteVideo.srcObject = stream;
      remoteVideo.playsInline = true;
      await remoteVideo.play().catch(console.error);
    });

    mediaConnection.once("close", () => {
      remoteVideo.srcObject.getTracks().forEach((track) => track.stop());
      remoteVideo.srcObject = null;
      closeTrigger.style.display = "none";
      goTopTrigger.style.display = "block";
    });

    closeTrigger.addEventListener("click", () => mediaConnection.close(true));
  });

  // Register callee handler
  peer.on("call", (mediaConnection) => {
    mediaConnection.answer(localStream);
    loading.style.display = "none";

    mediaConnection.on("stream", async (stream) => {
      // Render remote stream for callee
      remoteVideo.srcObject = stream;
      remoteVideo.playsInline = true;
      await remoteVideo.play().catch(console.error);
    });

    mediaConnection.once("close", () => {
      remoteVideo.srcObject.getTracks().forEach((track) => track.stop());
      remoteVideo.srcObject = null;
      closeTrigger.style.display = "none";
      goTopTrigger.style.display = "block";
    });

    closeTrigger.addEventListener("click", () => mediaConnection.close(true));
  });

  peer.on("error", console.error);
}
