/**
 * Clase que maneja la generación de un gradiente animado en un canvas.
 */
export class CanvasGradientController {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private t: number = 0;

  /**
   * Crea una instancia de CanvasGradient.
   * @param {HTMLCanvasElement} canvas - El elemento canvas donde se dibujará el gradiente.
   */
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  /**
   * Dibuja un píxel en la posición (x, y) con el color especificado.
   * @param {number} x - La coordenada x del píxel.
   * @param {number} y - La coordenada y del píxel.
   * @param {number} r - El valor de rojo (0-255).
   * @param {number} g - El valor de verde (0-255).
   * @param {number} b - El valor de azul (0-255).
   */
  private col(x: number, y: number, r: number, g: number, b: number): void {
    this.context.fillStyle = `rgb(${r},${g},${b})`;
    this.context.fillRect(x, y, 1, 1);
  }

  /**
   * Calcula el valor de rojo para un píxel en la posición (x, y) en el tiempo t.
   * @param {number} x - La coordenada x del píxel.
   * @param {number} y - La coordenada y del píxel.
   * @param {number} t - El tiempo actual.
   * @returns {number} El valor de rojo (0-255).
   */
  private R(x: number, y: number, t: number): number {
    return Math.floor(192 + 64 * Math.cos((x * x - y * y) / 300 + t));
  }

  /**
   * Calcula el valor de verde para un píxel en la posición (x, y) en el tiempo t.
   * @param {number} x - La coordenada x del píxel.
   * @param {number} y - La coordenada y del píxel.
   * @param {number} t - El tiempo actual.
   * @returns {number} El valor de verde (0-255).
   */
  private G(x: number, y: number, t: number): number {
    return Math.floor(
      192 + 64 * Math.sin((x * x * Math.cos(t / 4) + y * y * Math.sin(t / 3)) / 300),
    );
  }

  /**
   * Calcula el valor de azul para un píxel en la posición (x, y) en el tiempo t.
   * @param {number} x - La coordenada x del píxel.
   * @param {number} y - La coordenada y del píxel.
   * @param {number} t - El tiempo actual.
   * @returns {number} El valor de azul (0-255).
   */
  private B(x: number, y: number, t: number): number {
    return Math.floor(
      192 +
        64 * Math.sin(5 * Math.sin(t / 9) + ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100),
    );
  }

  /**
   * Ejecuta la animación del gradiente.
   */
  private run(): void {
    for (let x = 0; x <= 35; x++) {
      for (let y = 0; y <= 35; y++) {
        this.col(x, y, this.R(x, y, this.t), this.G(x, y, this.t), this.B(x, y, this.t));
      }
    }
    this.t += 0.05;
    window.requestAnimationFrame(() => this.run());
  }

  /**
   * Inicia la animación del gradiente.
   */
  public start(): void {
    this.run();
  }
}
