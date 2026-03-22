export interface AIProvider {
  name: string;
  call(prompt: string, timeout: number): Promise<string>;
}
