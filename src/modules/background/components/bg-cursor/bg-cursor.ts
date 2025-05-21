interface CustomDivElement extends HTMLDivElement {
  x: number;
  y: number;
}

export class SmoothCursor {
  private coords = { x: 0, y: 0 };
  private circles: NodeListOf<CustomDivElement>;
  private cursor: HTMLDivElement;
  private animationFrame: number | null = null;

  constructor() {
    this.circles = document.querySelectorAll('.circle') as NodeListOf<CustomDivElement>;
    this.cursor = document.querySelector('.cursor') as HTMLDivElement;
    this.init();
  }

  private init() {
    this.setupCircles();
    this.setupListeners();
    this.startAnimation();
  }

  private setupCircles() {
    this.circles.forEach((circle) => {
      circle.x = 0;
      circle.y = 0;
      circle.style.backgroundColor = 'white';
    });
  }

  private setupListeners() {
    window.addEventListener('mousemove', (e) => {
      this.coords.x = e.clientX;
      this.coords.y = e.clientY;
    });
  }

  private startAnimation() {
    const animate = () => {
      let x = this.coords.x;
      let y = this.coords.y;

      this.circles.forEach((circle, index) => {
        const offset = 24;
        circle.style.left = `${x - offset}px`;
        circle.style.top = `${y - offset}px`;
        circle.style.scale = `${(this.circles.length - index) / this.circles.length}`;

        circle.x = x;
        circle.y = y;

        const nextCircle = this.circles[index + 1] || this.circles[0];
        x += (nextCircle.x - x) * 0.3;
        y += (nextCircle.y - y) * 0.3;
      });

      this.animationFrame = requestAnimationFrame(animate);
    };

    animate();
  }

  public destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}
