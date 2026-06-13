class InMemoryStore {
    items = [];
    nextId = 1;
    addItem(content) {
        const newItem = {
            id: this.nextId++,
            content,
            createdAt: new Date(),
        };
        this.items.push(newItem);
        return newItem;
    }
    getItems() {
        return [...this.items]; // Return a copy to prevent mutation
    }
    getItem(id) {
        return this.items.find(item => item.id === id);
    }
    clearItems() {
        this.items = [];
    }
}
export const inMemoryStore = new InMemoryStore();
