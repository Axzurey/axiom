namespace tagService {
    export class tagger<T, R> {
        tags: Map<T, R> = new Map();
        constructor() {
            
        }
        tag(tag: T, value: R, removeAfter: number = -1) {
            this.tags.set(tag, value);
            if (removeAfter !== -1) {
                coroutine.wrap(() => {
                    task.wait(removeAfter);
                    this.tags.delete(tag);
                })()
            }
        }
        untag(tag: T) {
            this.tags.delete(tag);
        }
        getTag(tag: T) {
            return this.tags.get(tag);
        }
        getAllTags() {
            return this.tags;
        }
    }
}

export = tagService