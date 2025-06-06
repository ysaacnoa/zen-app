/**
 * Class for creating a smooth mouse trail animation on a canvas element
 */
export class CanvasMouseAnimation {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrame: number | null = null;
  private pointer = { x: 0, y: 0 };
  private mouseMoved = false;
  private trail: { x: number; y: number; dx: number; dy: number }[] = [];

  /**
   * Animation parameters
   * @property {number} pointsNumber - Number of points in the trail
   * @property {number} widthFactor - Width multiplier for the trail
   * @property {number} mouseThreshold - Sensitivity threshold for mouse movement
   * @property {number} spring - Spring constant for trail movement
   * @property {number} friction - Friction constant for trail movement
   */
  private params = {
    pointsNumber: 40,
    widthFactor: 10,
    mouseThreshold: 0.5,
    spring: 0.25,
    friction: 0.5,
  };

  /**
   * Creates an instance of CanvasMouseAnimation
   * @param {HTMLCanvasElement} canvas - The canvas element to draw on
   */
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.init();
  }

  /**
   * Initializes the animation by setting up canvas, trail, and event listeners
   */
  private init() {
    this.setupCanvas();
    this.initTrail();
    this.setupEventListeners();
    this.update(0);
  }

  /**
   * Sets up canvas dimensions to match window size
   */
  private setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /**
   * Initializes the trail points with default positions
   */
  private initTrail() {
    for (let i = 0; i < this.params.pointsNumber; i++) {
      this.trail[i] = {
        x: this.pointer.x,
        y: this.pointer.y,
        dx: 0,
        dy: 0,
      };
    }
  }

  /**
   * Sets up event listeners for mouse and touch interactions
   */
  private setupEventListeners() {
    window.addEventListener('click', (e) => this.updateMousePosition(e.pageX, e.pageY));
    window.addEventListener('mousemove', (e) => {
      this.mouseMoved = true;
      this.updateMousePosition(e.pageX, e.pageY);
    });
    window.addEventListener('touchmove', (e) => {
      this.mouseMoved = true;
      this.updateMousePosition(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
    });
    window.addEventListener('resize', () => this.setupCanvas());
  }

  /**
   * Updates the pointer position
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  private updateMousePosition(x: number, y: number) {
    this.pointer.x = x;
    this.pointer.y = y;
  }

  /**
   * Main animation loop that updates and draws the trail
   * @param {number} t - Timestamp for animation frame
   */
  private update(t: number) {
    if (!this.mouseMoved) {
      this.pointer.x = (0.5 + 0.3 * Math.cos(0.002 * t) * Math.sin(0.005 * t)) * window.innerWidth;
      this.pointer.y =
        (0.5 + 0.2 * Math.sin(0.005 * t) + 0.1 * Math.cos(0.01 * t)) * window.innerHeight;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.updateTrail();
    this.drawTrail();

    this.animationFrame = window.requestAnimationFrame((t) => this.update(t));
  }

  /**
   * Updates the positions of trail points using spring physics
   */
  private updateTrail() {
    this.trail.forEach((p, pIdx) => {
      const prev = pIdx === 0 ? this.pointer : this.trail[pIdx - 1];
      const spring = pIdx === 0 ? 0.4 + this.params.spring : this.params.spring;
      p.dx += (prev.x - p.x) * spring;
      p.dy += (prev.y - p.y) * spring;
      p.dx *= this.params.friction;
      p.dy *= this.params.friction;
      p.x += p.dx;
      p.y += p.dy;
    });
  }

  /**
   * Draws the trail on the canvas with a gradient stroke
   */
  private drawTrail() {
    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    gradient.addColorStop(0, getComputedStyle(document.documentElement)
      .getPropertyValue('--bg-mouse-start').trim());
    gradient.addColorStop(1, getComputedStyle(document.documentElement)
      .getPropertyValue('--bg-mouse-end').trim());

    this.ctx.strokeStyle = gradient;
    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(this.trail[0].x, this.trail[0].y);

    for (let i = 0; i < this.trail.length - 1; i++) {
      const xc = 0.5 * (this.trail[i].x + this.trail[i + 1].x);
      const yc = 0.5 * (this.trail[i].y + this.trail[i + 1].y);
      this.ctx.quadraticCurveTo(this.trail[i].x, this.trail[i].y, xc, yc);
      this.ctx.lineWidth = this.params.widthFactor * (this.params.pointsNumber - i);
      this.ctx.stroke();
    }
  }

  /**
   * Stops the animation and cleans up resources
   */
  public destroy() {
    if (this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame);
    }
  }
}
