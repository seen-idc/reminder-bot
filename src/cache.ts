let botCache: Record<string, any> = {}

export class BotCache {
  constructor() {}

  public async set(name: string, val: any) {
    botCache[name] = val
  }

  public async get(name: string) {
    return botCache[name]
  }

  public exist(name: string) {
    return botCache[name] ? true : false
  }
}