
export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(() => resolve(), ms))
}

export function generatedUid(): string {
  return 'uid-' + Math.round(Math.random() * 1000000000).toString()
}