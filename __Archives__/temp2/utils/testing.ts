
export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(() => resolve(), ms))
}

export function testAllTypes(fn: (arg: any) => any, moreArgs?: {key: string, val: any}[]) {
  const DEFAULT_ARGS = [
    'abcd', 
    123, 
    true, 
    () => {}, 
    {}, 
    {x: 1, y: 2}, 
    [], 
    ['abcd', 123, {}, [], () => {}]
  ]
  const ARGS = {
    'arg: "abcd"': 'abcd', 
    'arg: 123': 123, 
    'arg: true': true, 
    'arg: () => {}': () => {}, 
    'arg: {}': {}, 
    'arg: {x: 1, y: 2}': {x: 1, y: 2}, 
    'arg: []': [], 
    'arg: ["abcd", 123, {}, [], () => {}]': ['abcd', 123, {}, [], () => {}]
  } as const

  Object.entries(ARGS).forEach(([key, val]) => {
    console.log(`${key}`)
    console.log(`result: ${fn(val)}`)
    console.log('--------------------')
  })
  
  moreArgs?.forEach(arg => {
    console.log(`arg: ${arg.key}`)
    console.log(`value: ${fn(arg.val)}`)
    console.log('--------------------')
  })
}