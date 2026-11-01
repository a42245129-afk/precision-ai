export interface ComposerAdapter {
  match(url: URL): boolean;
  getComposer(): HTMLElement | null;
  getComposers(): HTMLElement[];
  getValue(element: HTMLElement): string;
  setValue(element: HTMLElement, text: string): void;
  attachButton(element: HTMLElement, button: HTMLButtonElement): boolean;
  allowGenericFallback?: boolean;
}