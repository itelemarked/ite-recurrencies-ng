

export function groupBy<T extends Record<string, unknown>>(items: T[], fn: (item: T) => string): Record<string, T[]> {
    let result: any = {};
    items.forEach((item) => {
      if (result[fn(item)] === undefined) {
        result[fn(item)] = [];
        result[fn(item)].push(item);
      } else {
        result[fn(item)].push(item);
      }
    });
    return result;
    // return Object.entries(result);
  }