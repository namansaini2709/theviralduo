/*
  <media-collage> - reusable native Web Component

  Usage:

  <script type="module" src="./components/media-collage.js"></script>

  <media-collage aria-label="Campaign media collage">
    <img src="./images/picnic.jpg" alt="Picnic campaign" data-title="PICNIC" data-subtitle="next-level social picnic" data-color="#a8f275" />
    <video src="./videos/spinning.mp4" poster="./images/spinning.jpg" data-title="SPINNING" data-subtitle="who said spinning is boring?"></video>
    <img src="./images/bakery.jpg" alt="Bakery campaign" data-title="BAKERY" data-subtitle="local bakes made loud" data-color="#f495e7" />
  </media-collage>

  Optional attributes:
  - activation-threshold="0.35" (legacy fallback)
  - activation-mode="center" (default) or "threshold"
  - activation-line="0.5" (default, viewport height ratio)
  - pause-offscreen="false"
*/

(() => {
  const ELEMENT_NAME = "media-collage";

  const DEFAULT_ITEMS = [
    { title: "PICNIC", subtitle: "next-level social picnic", color: "#a8f275" },
    { title: "COFFEE", subtitle: "proof that mornings can perform", color: "#f2dc78" },
    { title: "BAKERY", subtitle: "local bakes made loud", color: "#f495e7" },
    { title: "SPINNING", subtitle: "who said spinning is boring?", color: "#8998f2" },
    { title: "PARTY", subtitle: "a room that refused to sit still", color: "#202020" },
    { title: "NEON", subtitle: "city lights at midnight", color: "#ff7455" },
    { title: "NATURE", subtitle: "finding peace in the wild", color: "#68d391" },
    { title: "OCEAN", subtitle: "deep blue serenity", color: "#4db8ff" },
    { title: "DESERT", subtitle: "golden dunes and endless skies", color: "#ffb347" },
  ];

  const escapeAttr = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  class MediaCollage extends HTMLElement {
    constructor() {
      super();

      this.attachShadow({ mode: "open" });
      this._intersectionObserver = null;
      this._mutationObserver = null;
      this._isActive = false;
      this._renderQueued = false;
      this._scrollRaf = 0;
      this._hasAutoScrolled = false;

      this._onPointerMove = this._onPointerMove.bind(this);
      this._onPointerLeave = this._onPointerLeave.bind(this);
      this._onWindowScroll = this._onWindowScroll.bind(this);
    }

    connectedCallback() {
      this.render();
      this._observeVisibility();
      this._observeSourceChanges();
      window.addEventListener("scroll", this._onWindowScroll, { passive: true });
      window.addEventListener("resize", this._onWindowScroll, { passive: true });
      this._updateCarouselSpin();
      
      const root = this.shadowRoot.querySelector('.root');
      if (root) {
        root.addEventListener("scroll", this._onHorizontalScroll.bind(this), { passive: true });
        new ResizeObserver(() => this._onWindowResize()).observe(root);
      }
    }

    _onWindowResize() {
      const root = this.shadowRoot.querySelector('.root');
      if (root) {
        this.style.setProperty('--root-half', `${root.clientWidth / 2}px`);
        this.style.setProperty('--root-w', `${root.clientWidth}px`);
        if (this._isActive) this._onHorizontalScroll({ target: root });
      }
    }

    _onHorizontalScroll(event) {
      if (this._hScrollRaf) return;
      const root = event.target || event.currentTarget;
      if (!root) return;

      this._hScrollRaf = requestAnimationFrame(() => {
        this._hScrollRaf = 0;
        if (!this._isActive) return;

        const cards = this.shadowRoot.querySelectorAll('.card');
        if (cards.length < 2) return;

        // Use pure math matching our CSS constraints to avoid mid-transition DOM reading bugs
        const vw = document.documentElement.clientWidth / 100;
        const gap = Math.min(240, Math.max(140, 16 * vw)); 
        const scrollIndex = root.scrollLeft / gap;

        cards.forEach((card, i) => {
          const offset = i - scrollIndex;
          const absOffset = Math.abs(offset);

          card.style.setProperty('--scroll-offset', offset.toFixed(3));
          card.style.setProperty('--scroll-abs-offset', absOffset.toFixed(3));
        });
        
        // Pass the raw scroll value natively up so the camera layer can track correctly 
        this.style.setProperty('--scroll-left', `${root.scrollLeft}px`);
        this.style.setProperty('--scroll-index', scrollIndex.toFixed(4));
      });
    }

    disconnectedCallback() {
      this._intersectionObserver?.disconnect();
      this._mutationObserver?.disconnect();
      window.removeEventListener("scroll", this._onWindowScroll);
      window.removeEventListener("resize", this._onWindowScroll);
      if (this._scrollRaf) {
        cancelAnimationFrame(this._scrollRaf);
      }
    }

    refresh() {
      this.render();
      this._observeVisibility();
    }

    render() {
      const items = this._readItems();
      const label = this.getAttribute("aria-label") || "Media collage";

      this.shadowRoot.innerHTML = `
        <style>
          :host {
            --media-collage-bg: #050505;
            --media-collage-text: #050505;
            --media-collage-muted: rgba(5, 5, 5, 0.58);
            --media-collage-outline: rgba(255, 255, 255, 0.08);
            --media-collage-radius: 0;
            --media-collage-media-radius: 22px;
            --media-collage-shadow: 0 24px 80px rgba(0, 0, 0, 0.34);
            --media-collage-transition-duration: 1500ms;
            display: block;
            box-sizing: border-box;
            contain: layout style;
          }

          *,
          *::before,
          *::after {
            box-sizing: border-box;
          }

          .root {
            position: relative;
            overflow: hidden;
            min-height: clamp(560px, 78vw, 860px);
            padding: clamp(20px, 4vw, 56px);
            background: var(--media-collage-bg);
            isolation: isolate;
          }

          :host([active]) .root {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .root::-webkit-scrollbar {
            height: clamp(6px, 1vw, 10px);
          }
          .root::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.03); 
            border-radius: 10px;
          }
          .root::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.15); 
            border-radius: 10px;
          }
          .root::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3); 
          }

          .root::before {
            content: "";
            position: absolute;
            inset: 0;
            z-index: 0;
            pointer-events: none;
            opacity: 0.2;
            background-image:
              radial-gradient(circle at 20% 10%, rgba(255, 255, 255, 0.08), transparent 22%),
              radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.06), transparent 28%);
          }

          .stage {
            position: relative;
            z-index: 1;
            height: min(74vh, 760px);
            min-height: 520px;
            margin: 0 auto;
          }

          :host([active]) .stage {
            /* Full container width + track length */
            width: calc(100% + (var(--total) - 1) * var(--gap) + 4vw); 
          }

          .camera {
            position: absolute;
            left: 0;
            top: 0;
            width: var(--root-w, 100vw);
            height: 100%;
            perspective: 1600px;
            perspective-origin: 50% 50%;
            transform-style: preserve-3d;
          }

          :host([active]) .camera {
            /* Counters horizontal scrolling so the camera remains visually stationary */
            transform: translate3d(var(--scroll-left, 0px), 0, 0);
          }

          .carousel {
            position: absolute;
            inset: 0;
            transform-style: preserve-3d;
            transition: transform 900ms cubic-bezier(0.18, 0.95, 0.2, 1);
          }

          :host([active]) .carousel {
            /* Entire rigid wheel pulls backward into the screen and spins! */
            /* Using a static 18 degree rotation step mapped to scroll index */
            transform: translateZ(calc(var(--radius, 1400px) * -1)) rotateY(calc(var(--scroll-index, 0) * 18deg * -1)) rotateX(calc(var(--media-collage-scroll-spin, 0deg) * 0.1));
          }

          .card {
            --tilt-x: 0deg;
            --tilt-y: 0deg;
            --lift: 0px;
            position: absolute;
            left: var(--x);
            top: var(--y);
            z-index: var(--z);
            width: min(var(--w), calc(100% - 24px));
            min-width: 220px;
            aspect-ratio: var(--ratio);
            display: block;
            padding: 0;
            overflow: hidden;
            background: #050505;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: clamp(24px, 3.5vw, 42px);
            box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6);
            transform:
              translate3d(var(--idle-x), var(--idle-y), 0)
              translateY(calc(var(--lift) * -1))
              rotate(var(--rotate))
              rotateX(calc(var(--idle-rotate-x, -360deg) + var(--tilt-x)))
              rotateY(var(--tilt-y))
              scale(0.94);
            transform-style: preserve-3d;
            transform-origin: center;
            transition:
              transform var(--media-collage-transition-duration) cubic-bezier(0.16, 0.84, 0.18, 1),
              left var(--media-collage-transition-duration) cubic-bezier(0.16, 0.84, 0.18, 1),
              top var(--media-collage-transition-duration) cubic-bezier(0.16, 0.84, 0.18, 1),
              width var(--media-collage-transition-duration) cubic-bezier(0.16, 0.84, 0.18, 1),
              filter 800ms ease,
              opacity 800ms ease,
              box-shadow 800ms ease;
            will-change: transform;
          }

          :host([active]) .card {
            opacity: calc(max(0.4, calc(1 - var(--scroll-abs-offset, 0) * 0.35)) * (1 - var(--exit-progress, 0)));
            /* Dim cards as they rotate away across the wheel, and add a "glow" blur during exit */
            filter: brightness(calc(1 - var(--scroll-abs-offset, 0) * 0.25)) blur(calc(var(--exit-progress, 0) * 20px));
            left: 50%;
            top: 50%;
            width: min(var(--active-w), calc(100% - 24px));
            min-width: 0;
            aspect-ratio: 0.65;
            /* Snap statically onto the rigid 3D cylinder rim and dynamically scale the immediate focused card */
            /* During exit, we apply randomized scatter translations and rotations */
            transform:
              translate3d(
                calc(-50% + var(--exit-progress, 0) * var(--exit-x, 0px)), 
                calc(-50% + var(--exit-progress, 0) * var(--exit-y, -200px)), 
                0
              )
              translateY(calc(var(--lift) * -1))
              rotateY(var(--fixed-rotate-y))
              rotate(calc(var(--exit-progress, 0) * var(--exit-rotate, 0deg)))
              translateZ(var(--radius))
              scale(calc((0.8 + max(0, 1 - var(--scroll-abs-offset, 0)) * 0.45) * (1 + var(--exit-progress, 0) * 1.5)));
            transition:
              transform 900ms cubic-bezier(0.18, 0.95, 0.2, 1),
              left 1200ms cubic-bezier(0.16, 0.84, 0.18, 1),
              top 1200ms cubic-bezier(0.16, 0.84, 0.18, 1),
              width 1200ms cubic-bezier(0.16, 0.84, 0.18, 1),
              filter 400ms ease,
              opacity 400ms ease;
          }

          .card:hover {
            --lift: 14px;
            z-index: 20;
            box-shadow: 0 34px 90px rgba(0, 0, 0, 0.5);
          }

          .media {
            position: absolute;
            inset: 0;
            overflow: hidden;
            background: #061017;
            border-radius: 0;
          }

          .media::after {
            content: "";
            position: absolute;
            inset: 0;
            pointer-events: none;
            opacity: 1;
            background: linear-gradient(180deg, transparent 40%, rgba(0, 0, 0, 0.3) 65%, rgba(0, 0, 0, 0.95) 100%);
            mix-blend-mode: normal;
          }

          img,
          video {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: saturate(0.8) brightness(0.9);
            transform: scale(1.04);
            transition:
              filter 640ms ease,
              transform 900ms cubic-bezier(0.18, 0.95, 0.2, 1);
          }

          :host([active]) img,
          :host([active]) video,
          .card:hover img,
          .card:hover video {
            filter: saturate(1.1) brightness(1);
            transform: scale(1);
          }

          .placeholder {
            width: 100%;
            height: 100%;
            display: grid;
            place-items: center;
            color: rgba(255, 255, 255, 0.84);
            font: 800 clamp(28px, 4vw, 72px) / 0.9 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            text-align: center;
            background:
              linear-gradient(135deg, rgba(255, 255, 255, 0.12), transparent 32%),
              linear-gradient(315deg, rgba(90, 110, 255, 0.24), transparent 38%),
              #081018;
          }

          .copy {
            position: absolute;
            z-index: 10;
            bottom: clamp(24px, 3vw, 42px);
            left: clamp(24px, 3vw, 42px);
            right: clamp(24px, 3vw, 42px);
            text-align: left;
            transform: translateZ(34px);
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .title {
            margin: 0;
            max-width: 100%;
            overflow-wrap: anywhere;
            color: #fff;
            font: 400 clamp(24px, 3.2vw, 46px) / 1.05 ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
            letter-spacing: -0.02em;
            text-transform: none;
          }

          .subtitle {
            margin: 0;
            max-width: 96%;
            color: rgba(255, 255, 255, 0.8);
            font: 400 clamp(14px, 1.5vw, 20px) / 1.3 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            letter-spacing: 0;
          }

          slot {
            display: none;
          }

          @media (prefers-reduced-motion: reduce) {
            .card,
            img,
            video {
              transition: none;
            }

            .card,
            :host([active]) .card {
              left: auto;
              top: auto;
              width: 100%;
              transform: rotate(var(--active-rotate));
            }
          }

          @media (max-width: 760px) {
            .root {
              min-height: auto;
              padding: 18px;
            }

            .stage {
              height: auto;
              min-height: 0;
              display: grid;
              gap: 16px;
              perspective: none;
            }

            .card {
              position: relative;
              left: auto;
              top: auto;
              width: 100%;
              min-width: 0;
              aspect-ratio: 0.84;
              transform: rotate(var(--rotate));
            }

            :host([active]) .card {
              transform: rotate(var(--active-rotate));
            }
          }
        </style>

        <section class="root" part="root" aria-label="${escapeAttr(label)}">
          <div class="stage" part="stage" style="--total: ${items.length}; --gap: clamp(160px, 18vw, 250px);">
            <div class="camera">
              <div class="carousel">
                ${items.map((item, index) => this._cardTemplate(item, index)).join("")}
              </div>
            </div>
          </div>
        </section>
        <slot aria-hidden="true"></slot>
      `;

      this._bindCardMotion();
      this._syncVideos();
      this._setActive(this._isActive);
    }

    _cardTemplate(item, index) {
      const items = this._readItems();
      const total = items.length;
      
      const title = item.title || DEFAULT_ITEMS[index % DEFAULT_ITEMS.length].title;
      const subtitle = item.subtitle || DEFAULT_ITEMS[index % DEFAULT_ITEMS.length].subtitle;
      const color = item.color || DEFAULT_ITEMS[index % DEFAULT_ITEMS.length].color;

      // Deterministic layout for idle state (pile)
      const seed = ((index * 137) % 100) / 100;
      const rx = 10 + (seed * 50); // 10% to 60%
      const ry = 10 + (((index * 47) % 100) / 100 * 40); // 10% to 50%
      
      const x = `${rx}%`; 
      const y = `${ry}%`;
      const w = `${30 + (index % 5)}%`;
      const ratio = (0.76 + (seed * 0.12)).toFixed(2);
      const rotate = `${-15 + (seed * 30)}deg`;
      const z = index + 1;
      const shiftX = `${-20 + (seed * 40)}px`;
      const shiftY = `${-15 + (((index * 73) % 100) / 100 * 30)}px`;
      const idleRotateX = "-360deg"; 

      // Active state layout - Rigid 3D wheel physics
      const activeW = "clamp(160px, 20vw, 320px)";
      const gap = "clamp(140px, 16vw, 240px)"; 
      
      const theta = 18; // degrees
      const radius = 1400; // cylinder push
      const fixedRotateY = `${index * theta}deg`;
      
      // Deterministic exit seeds
      const exitX = `${((index * 149) % 800) - 400}px`;
      const exitY = `${-600 - ((index * 223) % 800)}px`;
      const exitRotate = `${((index * 331) % 360) - 180}deg`;

      return `
        <article
          class="card"
          part="card"
          style="
            --x: ${x};
            --y: ${y};
            --w: ${w};
            --active-w: ${activeW};
            --ratio: ${ratio};
            --rotate: ${rotate};
            --idle-rotate-x: ${idleRotateX};
            --fixed-rotate-y: ${fixedRotateY};
            --radius: ${radius}px;
            --exit-x: ${exitX};
            --exit-y: ${exitY};
            --exit-rotate: ${exitRotate};
            --z: ${z};
            --idle-x: ${shiftX};
            --idle-y: ${shiftY};
            --card-bg: ${escapeAttr(color)};
          "
        >
          <div class="media" part="media">
            ${this._mediaTemplate(item, title)}
          </div>
          <div class="copy" part="copy">
            <h3 class="title" part="title">${escapeAttr(title)}</h3>
            <p class="subtitle" part="subtitle">${escapeAttr(subtitle)}</p>
          </div>
        </article>
      `;
    }

    _mediaTemplate(item, fallbackTitle) {
      if (!item.src && !item.sources?.length) {
        return `<div class="placeholder">${escapeAttr(fallbackTitle)}</div>`;
      }

      if (item.type === "video") {
        const sourceTags = item.sources
          ?.map(
            (source) =>
              `<source src="${escapeAttr(source.src)}"${
                source.type ? ` type="${escapeAttr(source.type)}"` : ""
              }>`
          )
          .join("");

        return `
          <video
            ${item.src ? `src="${escapeAttr(item.src)}"` : ""}
            ${item.poster ? `poster="${escapeAttr(item.poster)}"` : ""}
            ${item.controls ? "controls" : ""}
            ${item.loop ? "loop" : ""}
            muted
            playsinline
            preload="metadata"
            aria-label="${escapeAttr(item.alt || fallbackTitle)}"
          >${sourceTags || ""}</video>
        `;
      }

      return `
        <img
          src="${escapeAttr(item.src)}"
          alt="${escapeAttr(item.alt || fallbackTitle)}"
          loading="lazy"
          decoding="async"
        >
      `;
    }

    _readItems() {
      const sourceElements = Array.from(this.children).filter((child) =>
        ["IMG", "VIDEO", "MEDIA-COLLAGE-ITEM"].includes(child.tagName)
      );

      if (!sourceElements.length) {
        return DEFAULT_ITEMS;
      }

      return sourceElements.map((element, index) => {
        const isVideo = element.tagName === "VIDEO" || element.dataset.type === "video";
        const nestedSources = isVideo
          ? Array.from(element.querySelectorAll("source"))
              .map((source) => ({
                src: source.getAttribute("src") || "",
                type: source.getAttribute("type") || "",
              }))
              .filter((source) => source.src)
          : [];

        return {
          type: isVideo ? "video" : "image",
          src:
            element.dataset.src ||
            element.getAttribute("src") ||
            element.getAttribute("href") ||
            "",
          sources: nestedSources,
          poster: element.dataset.poster || element.getAttribute("poster") || "",
          title:
            element.dataset.title ||
            element.getAttribute("title") ||
            element.getAttribute("alt") ||
            DEFAULT_ITEMS[index % DEFAULT_ITEMS.length].title,
          subtitle:
            element.dataset.subtitle ||
            element.getAttribute("aria-label") ||
            DEFAULT_ITEMS[index % DEFAULT_ITEMS.length].subtitle,
          alt:
            element.getAttribute("alt") ||
            element.dataset.alt ||
            element.dataset.title ||
            DEFAULT_ITEMS[index % DEFAULT_ITEMS.length].title,
          color: element.dataset.color || element.dataset.bg || DEFAULT_ITEMS[index % DEFAULT_ITEMS.length].color,
          controls: element.hasAttribute("controls") || element.dataset.controls === "true",
          loop: element.dataset.loop !== "false",
        };
      });
    }

    _observeVisibility() {
      this._intersectionObserver?.disconnect();

      if (!("IntersectionObserver" in window)) {
        this._setActive(true);
        return;
      }

      const threshold = Number.parseFloat(this.getAttribute("activation-threshold") || "0.35");
      const activationMode = this.getAttribute("activation-mode") || "center";

      this._intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          const isActive =
            activationMode === "threshold"
              ? entry.isIntersecting && entry.intersectionRatio >= clamp(threshold, 0, 1)
              : this._isViewportCenterInside();

          this._setActive(isActive);
        },
        {
          threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        }
      );

      this._intersectionObserver.observe(this);

      if (activationMode !== "threshold") {
        this._setActive(this._isViewportCenterInside());
      }
    }

    _isViewportCenterInside() {
      const rect = this.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      const activationRatio = Number.parseFloat(this.getAttribute("activation-line") || "0.5");
      const activationLine = viewportHeight * clamp(activationRatio, 0.05, 0.95);

      return rect.top <= activationLine && rect.bottom >= activationLine;
    }

    _observeSourceChanges() {
      this._mutationObserver?.disconnect();

      this._mutationObserver = new MutationObserver(() => {
        if (this._renderQueued) return;

        this._renderQueued = true;
        queueMicrotask(() => {
          this._renderQueued = false;
          this.render();
        });
      });

      this._mutationObserver.observe(this, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: [
          "src",
          "poster",
          "alt",
          "title",
          "aria-label",
          "data-title",
          "data-subtitle",
          "data-color",
          "data-bg",
          "data-src",
          "data-poster",
          "data-type",
          "data-controls",
          "data-loop",
        ],
      });
    }

    _onWindowScroll() {
      if (this._scrollRaf) return;

      this._scrollRaf = requestAnimationFrame(() => {
        this._scrollRaf = 0;

        if ((this.getAttribute("activation-mode") || "center") !== "threshold") {
          this._setActive(this._isViewportCenterInside());
        }

        this._updateCarouselSpin();
      });
    }

    _updateCarouselSpin() {
      const rect = this.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      const progress = clamp(
        (viewportHeight - rect.top) / (viewportHeight + Math.max(rect.height, 1)),
        0,
        1
      );
      
      const spin = (progress - 0.5) * 110;
      this.style.setProperty("--media-collage-scroll-spin", `${spin.toFixed(2)}deg`);

      // Exit Scatter phase: kicks in after the component passes the center (progress > 0.5)
      const exitProgress = clamp((progress - 0.5) * 2.5, 0, 1);
      this.style.setProperty("--exit-progress", exitProgress.toFixed(4));
    }

    _bindCardMotion() {
      this.shadowRoot.querySelectorAll(".card").forEach((card) => {
        card.addEventListener("pointermove", this._onPointerMove);
        card.addEventListener("pointerleave", this._onPointerLeave);
      });
    }

    _onPointerMove(event) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const card = event.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      card.style.setProperty("--tilt-x", `${clamp(y * -9, -8, 8)}deg`);
      card.style.setProperty("--tilt-y", `${clamp(x * 10, -9, 9)}deg`);
    }

    _onPointerLeave(event) {
      const card = event.currentTarget;
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    }

    _setActive(isActive) {
      this._isActive = isActive;
      this.toggleAttribute("active", isActive);
      this._syncVideos();
      
      if (isActive) {
        // Kick off layout and scroll math immediately
        this._onWindowResize();

        // Natively scroll explicitly to the dead center of the layout array on first entrance
        if (!this._hasAutoScrolled) {
          this._hasAutoScrolled = true;
          const root = this.shadowRoot.querySelector('.root');
          if (root) {
            const vw = document.documentElement.clientWidth / 100;
            const gap = Math.min(240, Math.max(140, 16 * vw));
            const targetIndex = Math.floor(this._readItems().length / 2);
            root.scrollLeft = targetIndex * gap;
          }
        }
      }
    }

    _syncVideos() {
      const videos = Array.from(this.shadowRoot.querySelectorAll("video"));
      const shouldPauseOffscreen = this.getAttribute("pause-offscreen") !== "false";
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      videos.forEach((video) => {
        if (this._isActive && !reduceMotion) {
          video.play().catch(() => {});
        } else if (shouldPauseOffscreen) {
          video.pause();
        }
      });
    }
  }

  if (!customElements.get(ELEMENT_NAME)) {
    customElements.define(ELEMENT_NAME, MediaCollage);
  }
})();
