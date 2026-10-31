// The coverflow rack behind <cover-flow>: the centre card faces you flat, the ones beside it swing their outer edges
// toward you. Adapted from ruixen.ui's "Coverflow Carousel" on 21st.dev (React/Tailwind) into a plain custom element.
// Markup it expects: .cf__stage > .cf__track > .cf__card (each holding one link) — the caption under the rack
// (.cf__name / .cf__sub, filled from each card's data-title / data-sub), optional .cf__at (position), and the
// .cf__btn[data-step] / .cf__play buttons. Attributes: data-start (first centred card), data-delay (ms before the
// autoplay starts), data-rtl (the next card sits to the left).
// No loop. It glides by itself one card at a time (ease-in-out, turning back at either end) and holds still on hover,
// keyboard focus, off screen, hidden tab, for a while after a manual move, and for good with the pause button or
// reduced motion. Drag, sideways swipe, clicking a side card, the buttons and the arrow keys move it; clicking the
// centre card follows its link.
// Tuning, as in the original: tilt of the first neighbour (deg), how far it recedes (× card width), how fast both
// ease off with distance, opacity lost per step, gap between cards (× card width).
const ROTATE = 44, DEPTH = 0.6, FALLOFF = 0.56, FADE = 0.12, GAP = 0.05;
const EVERY = 4200; // ms per cover when it moves by itself (glide included)
const GLIDE = 1500; // ms for one cover's glide; a few more ms for each further cover
const THROW = 650; // ms to settle after a drag or a swipe
const inOut = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2; // ease-in-out sine: starts and lands softly
const out = (t: number) => 1 - Math.pow(1 - t, 3); // ease-out cubic: keeps the speed of your hand, then lands
const IDLE = 6000; // after you move it yourself, it waits this long before carrying on
const still = matchMedia('(prefers-reduced-motion: reduce)');

class CoverFlow extends HTMLElement {
  cards: HTMLElement[] = [];
  pos = 0; // fractional index at the centre — the single source of truth
  target = 0;
  width = 0;
  sign = 1; // +1: the next cover sits to the right; -1 in Hebrew
  raf = 0;
  wheelTimer = 0;
  drag: { id: number; x: number; pos: number; v: number; t: number; moved: boolean } | null = null;
  ro?: ResizeObserver;
  io?: IntersectionObserver;
  timer = 0; // the next autoplay step
  startTimer = 0;
  userTimer = 0;
  hold = new Set<string>(); // reasons to stand still right now: hover, focus, drag, offscreen, hidden, user
  stopped = false; // the pause button
  dir = 1; // which way autoplay is heading; it turns back at either end
  shown = -1; // the cover whose name is under the rack

  connectedCallback() {
    this.cards = [...this.querySelectorAll<HTMLElement>('.cf__card')];
    this.sign = this.hasAttribute('data-rtl') ? -1 : 1;
    this.pos = this.target = Number(this.dataset.start) || 0;
    this.classList.add('is-on');
    const stage = this.querySelector<HTMLElement>('.cf__stage')!;

    // card width drives pitch and depth: measure now, then again whenever the stage changes size
    const measure = () => { this.width = this.cards[0].offsetWidth; this.paint(); };
    this.ro = new ResizeObserver(measure);
    this.ro.observe(stage);
    measure();

    stage.addEventListener('pointerdown', this.down);
    stage.addEventListener('pointermove', this.move);
    stage.addEventListener('pointerup', this.up);
    stage.addEventListener('pointercancel', this.up);
    stage.addEventListener('wheel', this.wheel, { passive: false });
    stage.addEventListener('click', this.click, true);
    this.addEventListener('keydown', this.key);
    this.addEventListener('focusin', this.focus);
    this.querySelectorAll<HTMLButtonElement>('.cf__btn[data-step]').forEach((b) => b.addEventListener('click', () => { this.touched(); this.nudge(Number(b.dataset.step)); }));
    this.querySelector('.cf__play')!.addEventListener('click', () => this.toggle());
    this.caption(this.pos, false);
    this.buttons();

    // autoplay: never with reduced motion; it stands still whenever any reason in `hold` applies
    if (still.matches) this.toggle(true);
    this.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') this.pause('hover'); });
    this.addEventListener('pointerleave', () => this.resume('hover'));
    // keyboard focus only: a mouse click also focuses the link, and that should not stop it for good
    this.addEventListener('focusin', (e) => { if ((e.target as HTMLElement).matches(':focus-visible')) this.pause('focus'); });
    this.addEventListener('focusout', (e) => { if (!this.contains(e.relatedTarget as Node)) this.resume('focus'); });
    this.pause('offscreen'); // until the observer says it is in view
    this.io = new IntersectionObserver(([e]) => (e.isIntersecting ? this.resume('offscreen') : this.pause('offscreen')), { threshold: 0.4 });
    this.io.observe(this);
    document.addEventListener('visibilitychange', this.visible);
    // several racks on one page start a little apart, so they never step in unison
    this.pause('start');
    this.startTimer = window.setTimeout(() => this.resume('start'), Number(this.dataset.delay) || 0);
  }

  disconnectedCallback() {
    cancelAnimationFrame(this.raf);
    clearTimeout(this.wheelTimer);
    clearTimeout(this.timer);
    clearTimeout(this.startTimer);
    clearTimeout(this.userTimer);
    this.ro?.disconnect();
    this.io?.disconnect();
    document.removeEventListener('visibilitychange', this.visible);
  }

  // ---- autoplay ----
  schedule() {
    clearTimeout(this.timer);
    if (this.stopped || this.hold.size) return;
    this.timer = window.setTimeout(() => {
      const at = Math.round(this.target);
      if (at + this.dir > this.cards.length - 1 || at + this.dir < 0) this.dir *= -1;
      this.settle(at + this.dir);
      this.schedule();
    }, EVERY);
  }
  pause(why: string) { this.hold.add(why); clearTimeout(this.timer); }
  resume(why: string) { this.hold.delete(why); this.schedule(); }
  // you moved it: hold for a while, then carry on from where you left it
  touched() {
    this.pause('user');
    clearTimeout(this.userTimer); // the wait restarts with every move
    this.userTimer = window.setTimeout(() => this.resume('user'), IDLE);
  }
  toggle(off = !this.stopped) {
    this.stopped = off;
    const b = this.querySelector<HTMLButtonElement>('.cf__play')!;
    b.classList.toggle('is-stopped', off);
    b.title = (off ? b.dataset.play : b.dataset.pause)!;
    this.schedule();
  }
  visible = () => (document.hidden ? this.pause('hidden') : this.resume('hidden'));

  clamp = (p: number) => Math.max(0, Math.min(this.cards.length - 1, p));
  get pitch() { return this.width * (1 + GAP); }

  // Straight to the DOM, transform and opacity only.
  paint() {
    if (!this.width) return;
    this.cards.forEach((card, i) => {
      const offset = i - this.pos;
      const screen = offset * this.sign; // where it sits on screen: right is positive
      const d = Math.abs(offset);
      const ramp = Math.pow(d, FALLOFF);
      const tilt = Math.min(ROTATE * ramp, 82) * Math.sign(screen);
      card.style.transform = `translateX(calc(-50% + ${screen * this.pitch}px)) translateZ(${-DEPTH * this.width * ramp}px) rotateY(${-tilt}deg)`;
      card.style.opacity = String(Math.max(0.25, 1 - FADE * d));
      card.style.zIndex = String(100 - Math.round(d * 10));
      card.classList.toggle('is-active', Math.round(this.pos) === i);
    });
    const at = Math.round(this.pos);
    if (at !== this.shown) this.caption(at, this.shown >= 0);
  }

  // the caption under the rack: whichever card is at the centre right now (it changes mid-glide, as the card arrives)
  caption(i: number, fade = true) {
    this.shown = i;
    const card = this.cards[i];
    if (fade) {
      const cap = this.querySelector<HTMLElement>('.cf__cap')!;
      cap.classList.remove('is-new');
      void cap.offsetWidth;
      cap.classList.add('is-new');
    }
    this.querySelector('.cf__name')!.textContent = card.dataset.title!;
    this.querySelector('.cf__sub')!.textContent = card.dataset.sub!;
    const at = this.querySelector('.cf__at');
    if (at) at.textContent = String(i + 1).padStart(2, '0');
    this.style.setProperty('--wa', card.style.getPropertyValue('--wa'));
  }

  // the prev / next buttons follow where the rack is heading
  buttons() {
    const i = Math.round(this.target);
    const [prev, next] = this.querySelectorAll<HTMLButtonElement>('.cf__btn[data-step]');
    prev.disabled = i === 0;
    next.disabled = i === this.cards.length - 1;
  }

  // Glide to a cover over a fixed time: a soft ease-in-out for steps (autoplay, buttons, keys, clicks), a quicker
  // ease-out after a drag or swipe so the rack carries on from your hand instead of starting over.
  settle(to: number, thrown = false) {
    cancelAnimationFrame(this.raf);
    this.target = this.clamp(Math.round(to));
    this.buttons();
    const from = this.pos;
    const span = this.target - from;
    if (still.matches || Math.abs(span) < 0.0004) { this.pos = this.target; this.paint(); return; }
    const ms = thrown ? THROW : GLIDE + 350 * (Math.abs(span) - 1);
    const ease = thrown ? out : inOut;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / ms);
      this.pos = from + span * ease(t);
      this.paint();
      if (t < 1) this.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  }

  nudge(by: number) { this.settle(this.target + by); }

  down = (e: PointerEvent) => {
    if (e.button !== 0) return;
    cancelAnimationFrame(this.raf);
    this.pause('drag');
    this.drag = { id: e.pointerId, x: e.clientX, pos: this.pos, v: 0, t: performance.now(), moved: false };
  };

  move = (e: PointerEvent) => {
    const d = this.drag;
    if (!d || d.id !== e.pointerId || !this.pitch) return;
    const dx = e.clientX - d.x;
    if (!d.moved) {
      if (Math.abs(dx) < 6) return;
      // only now take the pointer — a plain click must still reach the link underneath
      d.moved = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      this.classList.add('is-dragging');
    }
    const now = performance.now();
    const before = this.pos;
    this.pos = this.clamp(d.pos - (dx / this.pitch) * this.sign);
    d.v = ((this.pos - before) / Math.max(now - d.t, 1)) * 1000; // covers per second, for the throw
    d.t = now;
    this.paint();
  };

  up = (e: PointerEvent) => {
    const d = this.drag;
    if (!d || d.id !== e.pointerId) return;
    this.classList.remove('is-dragging');
    if (d.moved) this.touched();
    this.resume('drag');
    if (d.moved) {
      this.settle(this.pos + Math.max(-2, Math.min(2, d.v * 0.18)), true); // a flick carries, two covers at most
      setTimeout(() => { this.drag = null; }); // still set while the click that follows a drag fires
    } else this.drag = null;
  };

  // After a drag, swallow the click. A side cover comes to the centre instead of opening.
  click = (e: MouseEvent) => {
    if (this.drag?.moved) { e.preventDefault(); e.stopPropagation(); return; }
    const card = (e.target as HTMLElement).closest<HTMLElement>('.cf__card');
    if (!card) return;
    const i = this.cards.indexOf(card);
    if (i !== Math.round(this.target)) { e.preventDefault(); this.touched(); this.settle(i); }
  };

  // Sideways trackpad swipes (and shift + wheel) move the rack; a plain vertical wheel keeps scrolling the page.
  wheel = (e: WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || !this.pitch) return;
    e.preventDefault();
    cancelAnimationFrame(this.raf);
    this.touched();
    this.pos = this.clamp(this.pos + (e.deltaX / this.pitch) * this.sign);
    this.paint();
    clearTimeout(this.wheelTimer);
    this.wheelTimer = window.setTimeout(() => this.settle(this.pos, true), 120);
  };

  key = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    this.touched();
    const right = e.key === 'ArrowRight' ? 1 : -1;
    this.nudge(right * this.sign);
    this.cards[Math.round(this.target)].querySelector('a')!.focus({ preventScroll: true });
  };

  // Keyboard focus brings the cover to the centre (a mouse press is handled by `click`).
  focus = (e: FocusEvent) => {
    const link = e.target as HTMLElement;
    if (!link.matches(':focus-visible')) return;
    const i = this.cards.findIndex((c) => c.contains(link));
    if (i >= 0 && i !== Math.round(this.target)) this.settle(i);
  };
}

if (!customElements.get('cover-flow')) customElements.define('cover-flow', CoverFlow);
