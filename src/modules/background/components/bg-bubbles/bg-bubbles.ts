import type { IMouseBubbleController } from './bg-bubbles.types';

/**
 * Clase responsable de manejar el movimiento de un elemento interactivo (burbuja) en respuesta a los movimientos del mouse.
 */
export class MouseBubbleController implements IMouseBubbleController {
  private curX: number = 0;
  private curY: number = 0;
  private tgX: number = 0;
  private tgY: number = 0;
  private animationFrameId: number | null = null;
  private interactiveElement: HTMLDivElement;

  /**
   * Crea una instancia de MouseBubbleController.
   * @param {MouseBubbleControllerParams} params - Los parámetros requeridos para inicializar el controlador.
   */
  constructor(params: { interactiveElement: HTMLDivElement }) {
    this.interactiveElement = params.interactiveElement;
  }

  /**
   * Maneja el evento de movimiento del mouse y actualiza las coordenadas objetivo.
   * @param {MouseEvent} event - El evento del mouse.
   */
  private handleMouseMove = (event: MouseEvent): void => {
    this.tgX = event.clientX;
    this.tgY = event.clientY;
  };

  /**
   * Mueve el elemento interactivo hacia las coordenadas objetivo.
   * Este método ajusta gradualmente la posición actual del elemento hacia las coordenadas objetivo (tgX, tgY)
   * utilizando una interpolación suave. Luego, aplica la transformación al elemento y solicita el siguiente cuadro de animación.
   */
  private move = (): void => {
    this.curX += (this.tgX - this.curX) / 20;
    this.curY += (this.tgY - this.curY) / 20;

    this.interactiveElement.style.transform = `translate(${Math.round(this.curX)}px, ${Math.round(this.curY)}px)`;
    this.animationFrameId = requestAnimationFrame(this.move);
  };

  public start(): void {
    window.addEventListener('mousemove', this.handleMouseMove);
    this.move();
  }

  public stop(): void {
    window.removeEventListener('mousemove', this.handleMouseMove);
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
