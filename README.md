# Zomato Microservice Backend

Backend built with a microservice architecture — 6 independent services communicating through an API Gateway, with Kafka handling async event-driven updates between services.

---

## Architecture

All client requests hit the **API Gateway on port 3000**, which proxies to the right service.

```
Client
  │
  ▼
API Gateway :3000
  ├── /api/restaurant  → Restaurant Service :[3001]
  ├── /api/rider       → Rider Service      :[3002]
  ├── /api/user        → User Service       :[3003]
  ├── /api/item        → Item Service       :[3004]
  ├── /api/order       → Order Service      :[3005]
  └── /api/payment     → Payment Service    :[3006]
```

---

## Order Lifecycle

![Order Flow Sequence Diagram](https://i.ibb.co/CKHhYyT9/asdasdasd-asd-asd.png)

---

## Services

| Service | Port | Responsibility |
|---|---|---|
| Gateway | 3000 | Single entry point, proxies all requests |
| Restaurant | [3001] | Auth, restaurant profile, availability |
| Rider | [3002] | Auth, rider profile, availability |
| User | [3003] | Auth, user profile |
| Item | [3004] | Menu items per restaurant |
| Order | [3005] | Full order lifecycle management |
| Payment | [3006] | Processes payment, fires Kafka event |
| Kafka | 9092 | Event broker (runs via Docker) |

---

## Tech Stack

- **Node.js** with ES Modules (`"type": "module"`)
- **Express** — REST APIs across all services
- **MongoDB + Mongoose** — each service has its own DB connection
- **KafkaJS** — producer in Payment, consumers in Order and User
- **pnpm workspaces** — monorepo, all services managed together
- **Docker** — runs Kafka + Zookeeper

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Docker

### 1. Start Kafka

```bash
cd kafka
docker compose up -d
```

### 2. Set up environment variables

```bash
pnpm run init-env
```

This creates a `.env` in each service folder — copied from `.env.example` if it exists, otherwise creates an empty file. Already existing `.env` files are skipped.

Fill in the values:

```env
PORT=xxxx
MONGO_URI=mongodb://localhost:27017/service-name
JWT_SECRET=your_secret
```

### 3. Install dependencies

```bash
pnpm install
```

### 4. Run all services

```bash
pnpm -r --parallel run dev --stream
```

This starts all 6 services + gateway in parallel with nodemon. Logs are prefixed by service name.

---

## API Reference

All routes go through the gateway: `http://localhost:3000`

### User — `/api/user`

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register new user |
| POST | `/login` | No | Login, returns JWT |
| POST | `/logout` | No | Logout |

### Restaurant — `/api/restaurant`

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register restaurant |
| POST | `/login` | No | Login, returns JWT |
| POST | `/logout` | No | Logout |
| POST | `/toggle-availability` | Yes | Open/close restaurant |

### Rider — `/api/rider`

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register rider |
| POST | `/login` | No | Login, returns JWT |
| POST | `/logout` | No | Logout |
| POST | `/toggle-availability` | Yes | Go online/offline |

### Item — `/api/item`

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/new` | Yes (restaurant) | Add item to menu |
| GET | `/getAllItems` | No | Get all items |
| GET | `/getItem/:itemId` | No | Get single item |
| PATCH | `/:itemId/toggle-availability` | Yes | Mark item available/unavailable |
| DELETE | `/:itemId` | Yes | Delete item |

### Payment — `/api/payment`

| Method | Route | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/pay/:orderId` | No | `{ "amount": 1191.54 }` | Pay for an order |

### Order — `/api/order`

**User actions:**

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/place-order` | Yes | Place order with items + delivery address |
| POST | `/cancel-order/:orderId` | Yes | Cancel an order |

**Restaurant actions:**

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/restaurant/accept-order/:orderId` | Yes | Accept incoming order |
| POST | `/restaurant/order-ready/:orderId` | Yes | Mark order as ready for pickup |

**Rider actions:**

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/rider/accept-order/:orderId` | Yes | Accept delivery |
| POST | `/rider/pickup-order/:orderId` | Yes | Pickup from restaurant (send `pickedUpItemsRestaurantId` in body) |
| POST | `/rider/deliver-order/:orderId` | Yes | Mark as delivered |

### Auth

Protected routes need a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt>
```

---

## Postman Collection

Import `Zomato-MicroService.postman_collection.json` from the root of the repo. All routes are pre-configured with variables.

---

## Project Structure

```
zomato-microservice/
├── gateway/          # Express proxy, single entry point
├── user/             # User auth + profile
├── restaurant/       # Restaurant auth + profile
├── rider/            # Rider auth + profile
├── item/             # Menu item management
├── order/            # Order lifecycle + Kafka consumer
│   └── services/
│       ├── orderConsumer.js     # Kafka consumer
│       └── orderBulkUpdater.js  # In-memory buffer + bulkWrite
├── payment/          # Payment processing + Kafka producer
├── kafka/            # Shared producer, consumer, topics
│   ├── producer.js
│   ├── consumer.js
│   ├── topics.js
│   └── docker-compose.yml
└── pnpm-workspace.yaml
```

Each service follows the same internal structure:

```
service/
├── config/       # DB connection
├── controllers/  # Route handlers
├── middlewares/  # Auth + validation
├── models/       # Mongoose schemas
├── routes/       # Express routers
├── schemas/      # Zod validation schemas
└── utils/        # JWT, response helpers
```

---

## Key Implementation Details

**Kafka bulk updates** — consumers don't write to the DB on every event. Events are pushed to an in-memory array and flushed via `setInterval` every 5 seconds using `bulkWrite`. Reduces DB load significantly under high event volume.

**Separate consumer groups** — `order-service-group` and `user-service-group` both subscribe to `payment-events`. Kafka delivers the full event stream to each group independently, so both services get every event without competing for messages.

**Graceful shutdown** — both producer and consumer disconnect cleanly on `SIGTERM`/`SIGINT`. Without this, Kafka holds the consumer as alive for up to 10 seconds before rebalancing, causing delayed message processing on restarts.

**Shared Kafka module** — producer, consumer, and topic constants live in `/kafka` and are imported by any service that needs them. No duplication across services.