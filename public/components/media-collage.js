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
    { title: "PICNIC", subtitle: "next-level social picnic", color: "#a8f275", stars: "5", image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800" },
    { title: "COFFEE", subtitle: "proof that mornings can perform", color: "#f2dc78", stars: "5", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800" },
    { title: "BAKERY", subtitle: "local bakes made loud", color: "#f495e7", stars: "5", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800" },
    { title: "SPINNING", subtitle: "who said spinning is boring?", color: "#8998f2", stars: "5", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800" },
    { title: "PARTY", subtitle: "a room that refused to sit still", color: "#202020", stars: "5", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800" },
    { title: "NEON", subtitle: "city lights at midnight", color: "#ff7455", stars: "5", image: "https://images.unsplash.com/photo-1514525253344-f814d8742985?auto=format&fit=crop&q=80&w=800" },
    { title: "NATURE", subtitle: "finding peace in the wild", color: "#68d391", stars: "5", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800" },
    { title: "OCEAN", subtitle: "deep blue serenity", color: "#4db8ff", stars: "5", image: "https://images.unsplash.com/photo-1439405326854-014607f694d7?auto=format&fit=crop&q=80&w=800" },
    { title: "DESERT", subtitle: "golden dunes and endless skies", color: "#ffb347", stars: "5", image: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&q=80&w=800" },
  ];

  const escapeAttr = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const AUTO_FLIP_ENTER_OFFSET = 0.16;
  const AUTO_FLIP_EXIT_OFFSET = 0.34;

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

      this._onWindowScroll = this._onWindowScroll.bind(this);
      this._autoScrollLoop = this._autoScrollLoop.bind(this);
      
      this._autoScrollRaf = 0;
      this._isUserInteracting = false;
      this._currentScrollIndex = 0;
      this._targetScrollIndex = 0;
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
        root.addEventListener("pointerdown", () => { this._isUserInteracting = true; });
        root.addEventListener("pointerup", () => { this._isUserInteracting = false; });
        root.addEventListener("touchstart", () => { this._isUserInteracting = true; }, { passive: true });
        root.addEventListener("touchend", () => { this._isUserInteracting = false; }, { passive: true });
        
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

        const vw = document.documentElement.clientWidth / 100;
        const gap = Math.min(240, Math.max(140, 16 * vw)); 
        this._targetScrollIndex = root.scrollLeft / gap;
        
        // Pass the raw scroll value natively up so the camera layer can track correctly 
        this.style.setProperty('--scroll-left', `${root.scrollLeft}px`);
      });
    }

    _autoScrollLoop() {
      if (!this._isActive || !this.hasAttribute('auto-scroll')) {
        this._autoScrollRaf = 0;
        return;
      }

      const root = this.shadowRoot.querySelector('.root');
      if (root) {
        const vw = document.documentElement.clientWidth / 100;
        const gap = Math.min(240, Math.max(140, 16 * vw));
        
        if (!this._isUserInteracting) {
          const speed = parseFloat(this.getAttribute('scroll-speed')) || 0.45;
          root.scrollLeft += speed;
        }
        
        this._targetScrollIndex = root.scrollLeft / gap;

        // Seamless Looping logic
        const jumpWidth = 20 * gap;
        if (root.scrollLeft > jumpWidth * 1.8) {
           root.scrollLeft -= jumpWidth;
           this._targetScrollIndex -= 20;
           this._currentScrollIndex -= 20;
        }
      }

      // Smooth Lerping Logic
      const lerpFactor = 0.25;
      this._currentScrollIndex += (this._targetScrollIndex - this._currentScrollIndex) * lerpFactor;
      
      if (Math.abs(this._targetScrollIndex - this._currentScrollIndex) > 0.0001) {
        this.style.setProperty('--scroll-index', this._currentScrollIndex.toFixed(4));
        
        const cards = this.shadowRoot.querySelectorAll('.card');
        cards.forEach((card, i) => {
          const offset = i - this._currentScrollIndex;
          const absOffset = Math.abs(offset);
          card.style.setProperty('--scroll-offset', offset.toFixed(3));
          card.style.setProperty('--scroll-abs-offset', absOffset.toFixed(3));
        });
      }

      this._autoScrollRaf = requestAnimationFrame(this._autoScrollLoop);
    }

    disconnectedCallback() {
      this._intersectionObserver?.disconnect();
      this._mutationObserver?.disconnect();
      window.removeEventListener("scroll", this._onWindowScroll);
      window.removeEventListener("resize", this._onWindowScroll);
      if (this._scrollRaf) {
        cancelAnimationFrame(this._scrollRaf);
      }
      if (this._autoScrollRaf) {
        cancelAnimationFrame(this._autoScrollRaf);
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
            min-height: clamp(300px, 45vw, 550px);
            padding: clamp(8px, 1.5vw, 15px);
            background: var(--media-collage-bg);
            isolation: isolate;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE and Edge */
          }

          :host([active]) .root {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .root::-webkit-scrollbar {
            display: none;
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
            height: min(60vh, 550px);
            min-height: 400px;
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
            transition: none; /* Handled by JS lerp for maximum responsiveness */
            transform: 
              translateZ(calc(var(--radius, 1400px) * -1)) 
              rotateY(calc(var(--scroll-index, 0) * 18deg * -1));
          }

          :host([active]) .carousel {
            /* Active state specific overrides if any, currently handled by CSS variables */
          }

          .card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
            transform-style: preserve-3d;
            transform: translateZ(0) rotateY(0deg);
            border-radius: clamp(24px, 3.5vw, 42px);
            will-change: transform;
          }

          .card-content {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            border-radius: inherit;
            overflow: hidden;
            background: linear-gradient(135deg, #080808, #121212);
            padding: 0;
            display: flex;
            flex-direction: row;
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6);
            transform: translateZ(0.01px);
          }

          .card-content::before {
            content: "";
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 0% 0%, var(--card-bg, #fff) 0%, transparent 70%);
            opacity: 0.15;
            pointer-events: none;
            z-index: 1;
          }

          .card-part-left {
            width: 35%;
            height: 100%;
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 1.5rem;
            border-right: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 2;
          }



          .feedbacker-image {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: grayscale(1) brightness(0.6);
            transition: filter 0.6s ease, transform 0.6s ease;
            z-index: 1;
          }

          .card:hover .feedbacker-image {
            filter: grayscale(0) brightness(0.8);
            transform: scale(1.05);
          }

          .stars-container {
            position: absolute;
            bottom: 1.2rem;
            left: 1.2rem;
            z-index: 20;
            display: flex;
            gap: 4px;
          }

          .star-box {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 3px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(4px);
          }

          .star {
            width: 10px;
            height: 10px;
            fill: currentColor;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
          }

          .card-part-right {
            width: 65%;
            height: 100%;
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            background: rgba(255, 255, 255, 0.01);
            z-index: 2;
          }

          .feedback-text {
            color: #fff;
            font: 400 0.95rem/1.6 ui-serif, Georgia, serif;
            font-style: italic;
            margin-bottom: 1rem;
            opacity: 0.95;
            position: relative;
          }

          .feedback-text::before {
            content: '"';
            position: absolute;
            top: -1rem;
            left: -1rem;
            font-size: 3rem;
            opacity: 0.2;
            font-family: serif;
          }

          .key-points {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .point {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--card-bg, #fff);
            font-size: 0.65rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            padding: 0.4rem 0.8rem;
            border-radius: 4px;
          }

          .author {
            position: absolute;
            bottom: 1.5rem;
            right: 1.5rem;
            z-index: 20;
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.6rem;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            font-weight: 800;
          }

          .card {
            --tilt-x: 0deg;
            --tilt-y: 0deg;
            --lift: 0px;
            --flip: 0deg;
            position: absolute;
            left: 50%;
            top: 50%;
            width: min(var(--active-w), calc(100% - 24px));
            aspect-ratio: 1.5;
            z-index: calc(100 - var(--scroll-abs-offset, 0));
            display: block;
            padding: 0;
            perspective: 1000px;
            cursor: pointer;
            opacity: calc(1 - clamp(0, (var(--scroll-abs-offset, 0) - 6), 4) / 4);
            transform-style: preserve-3d;
            transform-origin: center;
            transform:
              translate3d(-50%, -50%, 0)
              translateY(calc(var(--lift) * -1))
              rotateY(var(--fixed-rotate-y))
              translateZ(var(--radius))
              rotateX(var(--tilt-x, 0deg))
              rotateY(var(--tilt-y, 0deg))
              scale(calc(1.1 - clamp(0, var(--scroll-abs-offset, 10), 1) * 0.1));
            transition:
              transform 0.4s cubic-bezier(0.23, 1, 0.32, 1),
              opacity 0.4s ease;
            will-change: transform, opacity;
          }

          :host([active]) .card {
            pointer-events: auto;
          }

          .card:hover {
            --lift: 14px;
            z-index: 999 !important;
          }

          .media {
            position: absolute;
            inset: 0;
            overflow: hidden;
            background: #061017;
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
          <div class="stage" part="stage" style="--total: ${items.length}; --gap: clamp(250px, 25vw, 400px);">
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
      const title = item.title || DEFAULT_ITEMS[index % DEFAULT_ITEMS.length].title;
      const subtitle = item.subtitle || DEFAULT_ITEMS[index % DEFAULT_ITEMS.length].subtitle;
      const color = item.color || DEFAULT_ITEMS[index % DEFAULT_ITEMS.length].color;

      // Active state layout - Rigid 3D wheel physics
      const activeW = "clamp(280px, 30vw, 420px)";
      const theta = 18; // degrees
      const radius = 1800; // cylinder push
      const fixedRotateY = `${index * theta}deg`;

      const stars = parseInt(item.stars || "5");
      const starsHtml = Array(5).fill(0).map((_, i) => {
        const isFilled = i < stars;
        return `
          <div class="star-box" style="opacity: 1">
            <svg class="star" style="color: ${isFilled ? '#FFD700' : '#ff3b3b'}" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          </div>
        `;
      }).join('');

      return `
        <article
          class="card"
          part="card"
          style="
            --active-w: ${activeW};
            --fixed-rotate-y: ${fixedRotateY};
            --radius: ${radius}px;
            --scroll-abs-offset: 100;
            --card-bg: ${escapeAttr(color)};
          "
        >
          <div class="card-inner">
            <div class="card-content">
              <div class="card-part-left">
                <img src="${escapeAttr(item.image || item.src)}" class="feedbacker-image" alt="${escapeAttr(title)}" />
                <div class="stars-container">${starsHtml}</div>

              </div>
              <div class="card-part-right">
                <div class="feedback-text">${escapeAttr(item.feedback || "Exceptional performance and cinematic vision. The Viral Duo transformed our digital presence.")}</div>
                <div class="key-points">
                  ${(item.points || "Growth, Viral, Strategy").split(',').map(p => `<span class="point">${escapeAttr(p.trim())}</span>`).join('')}
                </div>
              </div>
              <div class="author" part="author">FEEDBACK BY ${escapeAttr(title)}</div>
            </div>
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
          image: element.dataset.image || element.getAttribute("src") || "",
          stars: element.dataset.stars || "5",
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
          feedback: element.dataset.feedback || "",
          points: element.dataset.points || "",
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
    }

    _bindCardMotion() {
      this.shadowRoot.querySelectorAll(".card").forEach((card) => {
        card.addEventListener("mouseenter", () => {
          card.setAttribute('data-hovered', 'true');
        });
        card.addEventListener("mouseleave", () => {
          card.removeAttribute('data-hovered');
        });
      });
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
            const gap = Math.min(400, Math.max(250, 25 * vw));
            const targetIndex = Math.floor(this._readItems().length / 2);
            root.scrollLeft = targetIndex * gap;
          }
        }
        
        if (this.hasAttribute('auto-scroll') && !this._autoScrollRaf) {
          this._autoScrollRaf = requestAnimationFrame(this._autoScrollLoop);
        }
      } else {
        if (this._autoScrollRaf) {
          cancelAnimationFrame(this._autoScrollRaf);
          this._autoScrollRaf = 0;
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
