const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// backend address (replace with Render URL if deployed)
const BASE_URL = "http://localhost:10000";

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

function addMessage(text, sender = "bot") {
  const msg = document.createElement("div");
  msg.className = `msg ${sender}`;
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  userInput.value = "";
  addMessage("⏳ TinyLlama is typing...", "typing");

  try {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();
    document.querySelector(".typing").remove();
    addMessage(data.reply || "⚠️ No reply", "bot");
  } catch (err) {
    document.querySelector(".typing").remove();
    addMessage("❌ Error: " + err.message, "bot");
  }
}