// In-memory store for saved items
export interface SavedItem {
  id: number;
  content: string;
  createdAt: Date;
}

class InMemoryStore {
  private items: SavedItem[] = [];
  private nextId = 1;

  addItem(content: string): SavedItem {
    const newItem: SavedItem = {
      id: this.nextId++,
      content,
      createdAt: new Date(),
    };
    this.items.push(newItem);
    return newItem;
  }

  getItems(): SavedItem[] {
    return [...this.items]; // Return a copy to prevent mutation
  }

  getItem(id: number): SavedItem | undefined {
    return this.items.find(item => item.id === id);
  }

  clearItems(): void {
    this.items = [];
  }
}

export const inMemoryStore = new InMemoryStore();
