# 📋 Application Service

Backend service for managing interviews, messages, resources, FAQs, and support tickets in the Noafarin platform.

## 🚀 Features

- **Interview Management**: Schedule, manage, and track interviews
- **Messaging System**: Internal messaging with conversation threading
- **Resource Library**: Educational resources, tutorials, and documents
- **FAQ System**: Frequently asked questions with feedback
- **Support Tickets**: Complete ticketing system with assignment and tracking

## 📁 Project Structure

```
application-service/
├── src/
│   ├── models/           # Mongoose schemas
│   │   ├── Interview.ts
│   │   ├── Message.ts
│   │   ├── Conversation.ts
│   │   ├── Resource.ts
│   │   ├── FAQ.ts
│   │   └── SupportTicket.ts
│   ├── services/         # Business logic
│   │   ├── interview.service.ts
│   │   ├── message.service.ts
│   │   ├── resource.service.ts
│   │   ├── faq.service.ts
│   │   └── support.service.ts
│   ├── controllers/      # Request handlers
│   │   ├── interview.controller.ts
│   │   ├── message.controller.ts
│   │   ├── resource.controller.ts
│   │   ├── faq.controller.ts
│   │   └── support.controller.ts
│   ├── routes/          # API routes
│   │   ├── interview.routes.ts
│   │   ├── message.routes.ts
│   │   ├── resource.routes.ts
│   │   ├── faq.routes.ts
│   │   └── support.routes.ts
│   ├── app.ts           # Express app setup
│   └── index.ts         # Entry point
├── dist/                # Compiled JavaScript
├── package.json
├── tsconfig.json
└── .env.example
```

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
```

## ⚙️ Environment Variables

```env
PORT=3008
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/noafarin_application
JWT_SECRET=your_jwt_secret_key_here
CORS_ORIGIN=http://localhost:5173
API_GATEWAY_URL=http://localhost:3000
```

## 🏃 Running the Service

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
# Build TypeScript
npm run build

# Start server
npm start
```

## 📡 API Endpoints

### Interview Endpoints (14)
- `GET /api/applicants/:id/interviews` - Get all interviews for applicant
- `GET /api/applicants/:id/interviews/upcoming` - Get upcoming interviews
- `GET /api/applicants/:id/interviews/past` - Get past interviews
- `GET /api/applicants/:id/interviews/next` - Get next interview
- `GET /api/applicants/:id/interviews/statistics` - Get statistics
- `GET /api/applications/:id/interviews` - Get interviews by application
- `GET /api/applications/:id/interviews/schedule` - Get interview schedule
- `GET /api/interviews/:id` - Get interview by ID
- `POST /api/interviews` - Create interview (Admin)
- `PUT /api/interviews/:id` - Update interview (Admin)
- `DELETE /api/interviews/:id` - Delete interview (Admin)
- `PATCH /api/interviews/:id/complete` - Mark as completed (Admin)
- `PATCH /api/interviews/:id/cancel` - Cancel interview (Admin)
- `POST /api/interviews/:id/feedback` - Add feedback (Admin)

### Message Endpoints (13)
- `POST /api/messages` - Send message
- `GET /api/messages` - Get all messages
- `GET /api/messages/inbox` - Get inbox
- `GET /api/messages/sent` - Get sent messages
- `GET /api/messages/unread` - Get unread messages
- `GET /api/messages/unread/count` - Get unread count
- `GET /api/messages/search` - Search messages
- `GET /api/messages/:id` - Get message by ID
- `PATCH /api/messages/:id/read` - Mark as read
- `PATCH /api/messages/read-all` - Mark all as read
- `DELETE /api/messages/:id` - Delete message
- `GET /api/conversations` - Get conversations
- `GET /api/conversations/:id/messages` - Get conversation messages

### Resource Endpoints (16)
- `GET /api/resources` - Get all resources
- `GET /api/resources/featured` - Get featured resources
- `GET /api/resources/popular` - Get popular resources
- `GET /api/resources/search` - Search resources
- `GET /api/resources/statistics` - Get statistics
- `GET /api/resources/type/:type` - Get by type
- `GET /api/resources/category/:category` - Get by category
- `GET /api/resources/tags/:tags` - Get by tags
- `GET /api/resources/:id` - Get resource by ID
- `GET /api/resources/:id/related` - Get related resources
- `POST /api/resources/:id/view` - Track view
- `POST /api/resources/:id/download` - Track download
- `POST /api/resources` - Create resource (Admin)
- `PUT /api/resources/:id` - Update resource (Admin)
- `DELETE /api/resources/:id` - Delete resource (Admin)

### FAQ Endpoints (14)
- `GET /api/faqs` - Get all FAQs
- `GET /api/faqs/popular` - Get popular FAQs
- `GET /api/faqs/helpful` - Get helpful FAQs
- `GET /api/faqs/search` - Search FAQs
- `GET /api/faqs/statistics` - Get statistics
- `GET /api/faqs/category/:category` - Get by category
- `GET /api/faqs/:id` - Get FAQ by ID
- `POST /api/faqs/:id/view` - Track view
- `POST /api/faqs/:id/helpful` - Mark as helpful
- `POST /api/faqs/:id/not-helpful` - Mark as not helpful
- `POST /api/faqs` - Create FAQ (Admin)
- `PUT /api/faqs/:id` - Update FAQ (Admin)
- `DELETE /api/faqs/:id` - Delete FAQ (Admin)

### Support Endpoints (16)
- `POST /api/support/tickets` - Create ticket
- `GET /api/support/tickets` - Get all tickets (Admin)
- `GET /api/support/tickets/user/:userId` - Get user tickets
- `GET /api/support/tickets/number/:ticketNumber` - Get by ticket number
- `GET /api/support/tickets/status/:status` - Get by status
- `GET /api/support/tickets/assigned/:assignedTo` - Get assigned tickets
- `GET /api/support/tickets/:id` - Get ticket by ID
- `GET /api/support/statistics` - Get statistics
- `POST /api/support/tickets/:id/messages` - Add message
- `POST /api/support/tickets/:id/assign` - Assign ticket (Admin)
- `PUT /api/support/tickets/:id` - Update ticket
- `PATCH /api/support/tickets/:id/priority` - Update priority (Admin)
- `PATCH /api/support/tickets/:id/resolve` - Resolve ticket
- `PATCH /api/support/tickets/:id/close` - Close ticket
- `PATCH /api/support/tickets/:id/reopen` - Reopen ticket
- `DELETE /api/support/tickets/:id` - Delete ticket (Admin)

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📦 Technologies

- **TypeScript** - Type-safe JavaScript
- **Express** - Web framework
- **Mongoose** - MongoDB ODM
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

## 🔒 TypeScript Configuration

Strict mode enabled with:
- `strictNullChecks`
- `noImplicitAny`
- `noImplicitThis`
- `noUnusedLocals`
- `noUnusedParameters`
- `noImplicitReturns`

## 📝 Code Quality

- ✅ Zero TypeScript errors
- ✅ No unused variables
- ✅ No unused imports
- ✅ Strict type checking
- ✅ Professional error handling

## 🤝 Contributing

1. Write clean, type-safe TypeScript
2. Follow existing code structure
3. Add proper error handling
4. Write tests for new features
5. Update documentation

## 📄 License

MIT

## 👥 Authors

Noafarin Development Team

---

**Built with ❤️ for the Noafarin Platform**
