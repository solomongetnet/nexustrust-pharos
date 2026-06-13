# Redis Caching Implementation

This project implements a professional Redis caching layer for the Todo API to improve read performance and reduce database load while maintaining data consistency.

## Architecture Overview

The caching layer sits between the Express controllers and the Prisma ORM. It follows the **Cache-Aside (Lazy Loading)** pattern.

### Cache Flow (Read Operations)
1. Controller receives a request.
2. Controller checks Redis for the data using a specific cache key.
3. If data exists (**Cache Hit**): Return cached data immediately.
4. If data doesn't exist (**Cache Miss**):
   - Fetch data from PostgreSQL via Prisma.
   - Store the result in Redis with a TTL (Time To Live).
   - Return data to the client.

### Cache Invalidation (Write Operations)
To ensure data consistency, the cache is invalidated whenever a mutation occurs:
- **Create**: Deletes the `todo:all` cache.
- **Update**: Deletes both `todo:all` and the specific `todo:item:{id}` cache.
- **Delete**: Deletes both `todo:all` and the specific `todo:item:{id}` cache.

## Implementation Details

### Cache Key Structure
- `todo:all`: Stores the list of all todos.
- `todo:item:{id}`: Stores a single todo item by its unique ID.

### TTL (Time To Live)
The default TTL is set to **3600 seconds (1 hour)**. This ensures that even if invalidation fails, the cache will eventually refresh.

### Resilience
The `CacheService` is designed to handle Redis failures gracefully. If the Redis server is down or a command fails, the service logs the error and returns `null` (simulating a cache miss), allowing the application to fall back to the database without crashing.

## Production Considerations

- **Memory Management**: Redis uses an LRU (Least Recently Used) eviction policy by default.
- **Performance**: Redis operations are atomic and performed in-memory, providing sub-millisecond response times for cached routes.
- **Scaling**: This architecture supports horizontal scaling. Multiple API instances can share the same Redis cluster to maintain a consistent cache across the entire system.

## Common Operations Used
- `GET`: Retrieve cached data.
- `SETEX`: Store data with an expiration time.
- `DEL`: Remove specific keys from the cache.
- `KEYS`: Find keys matching a pattern (used for bulk invalidation if needed).
