import { prisma } from "../src/config/prisma.config.js";
import { cacheService } from "../src/services/cache.service.js";

async function seedTodos() {
  console.log("🌱 Starting manual seed for Todos...");

  const todosData = [
    { title: "Buy groceries", completed: false },
    { title: "Finish project proposal", completed: true },
    { title: "Call mom", completed: false },
    { title: "Workout for 30 mins", completed: false },
    { title: "Read a book", completed: true },
    { title: "Clean the kitchen", completed: false },
    { title: "Pay utility bills", completed: true },
    { title: "Walk the dog", completed: false },
    { title: "Prepare lunch", completed: false },
    { title: "Write a blog post", completed: false },
  ];

  try {
    await prisma.todo.deleteMany();
    console.log("🗑️ Cleared existing todos.");

    for (const data of todosData) {
      const todo = await prisma.todo.create({
        data,
      });
      console.log(`✅ Created Todo: ${todo.title} (ID: ${todo.id})`);
    }

    cacheService.delByPattern("todos:*");
    console.log("✨ Manual seed completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedTodos();
