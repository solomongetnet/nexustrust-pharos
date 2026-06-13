import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  saveItemInputSchema,
  getItemInputSchema,
  clearItemsInputSchema,
} from "../validators/index.js";
import { inMemoryStore } from "../store/index.js";

export function registerInMemoryTools(server: McpServer) {
  // Save an item
  server.registerTool(
    "saveItem",
    {
      description: "Save content to an in-memory array",
      inputSchema: saveItemInputSchema,
    },
    async ({ content }) => {
      const savedItem = inMemoryStore.addItem(content);
      return {
        content: [
          {
            type: "text",
            text: `Successfully saved item! ID: ${savedItem.id}, Content: "${savedItem.content}", Created At: ${savedItem.createdAt.toISOString()}`,
          },
        ],
      };
    }
  );

  // Get all items
  server.registerTool(
    "getItems",
    {
      description: "Get all items from the in-memory array",
      inputSchema: {},
    },
    async () => {
      const items = inMemoryStore.getItems();
      if (items.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No items saved in memory yet.",
            },
          ],
        };
      }
      const itemsList = items
        .map(
          (item) =>
            `ID: ${item.id}, Content: "${item.content}", Created At: ${item.createdAt.toISOString()}`
        )
        .join("\n- ");
      return {
        content: [
          {
            type: "text",
            text: `Saved items:\n- ${itemsList}`,
          },
        ],
      };
    }
  );

  // Get single item by ID
  server.registerTool(
    "getItem",
    {
      description: "Get a single item from the in-memory array by ID",
      inputSchema: getItemInputSchema,
    },
    async ({ id }) => {
      const item = inMemoryStore.getItem(id);
      if (!item) {
        return {
          content: [
            {
              type: "text",
              text: `Item with ID ${id} not found.`,
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text",
            text: `Found item:\nID: ${item.id}, Content: "${item.content}", Created At: ${item.createdAt.toISOString()}`,
          },
        ],
      };
    }
  );

  // Clear all items
  server.registerTool(
    "clearItems",
    {
      description: "Clear all items from the in-memory array",
      inputSchema: clearItemsInputSchema,
    },
    async () => {
      inMemoryStore.clearItems();
      return {
        content: [
          {
            type: "text",
            text: "All items cleared from memory.",
          },
        ],
      };
    }
  );
}
