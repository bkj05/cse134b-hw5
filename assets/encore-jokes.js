(() => {
  const samples = [
    { text: "Why did the guitarist bring a pencil to rehearsal? In case there was a note to take.", credit: "From the practice set · Guitar" },
    { text: "My keyboard and I agreed to take a break. It said it needed a little space bar.", credit: "From the practice set · Keys" }
  ];
  const endpoint = "https://icanhazdadjoke.com/";
  const preferenceKey = "hw5-encore-jokes-view";

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  class EncoreJokes extends HTMLElement {
    static get observedAttributes() { return ["compact"]; }

    connectedCallback() {
      if (this.card) return; // Reattaching the element must not duplicate controls.
      this.sampleIndex = 0;
      this.liveCount = 0;
      this.card = element("div", "", "joke-card");
      const heading = element("h3", "On the music stand");
      this.item = element("p", "", "joke-text");
      this.detail = element("p", "", "joke-detail");
      const actions = element("div", "", "joke-actions");
      this.liveButton = element("button", "Get a guest joke");
      this.sampleButton = element("button", "Next music pun", "joke-sample-button");
      this.liveButton.type = this.sampleButton.type = "button";
      this.status = element("p", "", "joke-status");
      this.status.setAttribute("role", "status");
      this.status.setAttribute("aria-atomic", "true");

      this.liveButton.addEventListener("click", () => this.requestJoke());
      this.sampleButton.addEventListener("click", () => {
        if (this.pending) return;
        this.sampleIndex = (this.sampleIndex + 1) % samples.length;
        this.showSample();
      });
      actions.append(this.liveButton, this.sampleButton);
      this.card.append(heading, this.item, this.detail, actions, this.status);
      this.replaceChildren(this.card);
      this.showSample();
      this.updateView();
    }

    attributeChangedCallback() { this.updateView(); }

    updateView() {
      if (this.detail) this.detail.hidden = this.hasAttribute("compact");
    }

    showSample() {
      const sample = samples[this.sampleIndex];
      this.item.textContent = sample.text;
      this.detail.textContent = sample.credit;
      this.liveButton.textContent = "Get a guest joke";
      this.setStatus("ready", "Music pun " + (this.sampleIndex + 1) + " of " + samples.length + ".");
    }

    setStatus(state, message) {
      this.status.dataset.state = state;
      this.status.textContent = message;
    }

    async requestJoke() {
      if (this.pending) return;
      this.pending = true;
      // Keep the active button focusable while preventing duplicate requests.
      for (const button of [this.liveButton, this.sampleButton]) button.setAttribute("aria-disabled", "true");
      this.setStatus("loading", "Loading a guest joke…");
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      try {
        const response = await fetch(endpoint, {
          headers: { Accept: "application/json" }, cache: "no-store", signal: controller.signal
        });
        if (!response.ok) throw new Error("HTTP " + response.status);
        const data = await response.json();
        if (typeof data?.joke !== "string" || !data.joke.trim()) throw new Error("Missing joke text");
        this.item.textContent = data.joke.trim();
        this.detail.textContent = "Guest set · icanhazdadjoke.com";
        this.liveCount += 1;
        this.liveButton.textContent = "Get another guest joke";
        this.setStatus("success", "Guest joke " + this.liveCount + " loaded.");
      } catch {
        // Leave the last readable joke on the stand, including the first sample.
        this.liveButton.textContent = "Retry guest joke";
        this.setStatus("error", "Couldn’t load a guest joke. Retry, or choose the next music pun.");
      } finally {
        clearTimeout(timeout);
        this.pending = false;
        for (const button of [this.liveButton, this.sampleButton]) button.removeAttribute("aria-disabled");
      }
    }
  }

  customElements.define("encore-jokes", EncoreJokes);
  const panel = document.querySelector("#break-jokes");
  const control = document.querySelector("#joke-view"); // Outside the custom element.
  if (!panel || !control) return;

  function applyView(mode) {
    const compact = mode === "compact";
    panel.toggleAttribute("compact", compact);
    control.setAttribute("aria-pressed", String(compact));
  }

  let initial = "expanded";
  try {
    const saved = localStorage.getItem(preferenceKey);
    if (saved === "compact" || saved === "expanded") initial = saved;
  } catch { /* Use the default when storage cannot be read. */ }
  applyView(initial);
  control.addEventListener("click", () => {
    const mode = panel.hasAttribute("compact") ? "expanded" : "compact";
    applyView(mode);
    try { localStorage.setItem(preferenceKey, mode); }
    catch { /* The change already applies for the current page. */ }
  });
  control.hidden = false;
})();
