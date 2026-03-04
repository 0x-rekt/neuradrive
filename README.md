# 🧠 NeuraDrive

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1.4-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-7.3.0-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
</div>

<br />

**NeuraDrive** is an AI-powered cloud storage platform where your files don't just exist—they **evolve** through intelligent understanding. Upload documents, chat with them using Google's Gemini AI, perform semantic searches, and collaborate with role-based sharing—all in a sleek, neural-themed interface.

---

## ✨ Features

### 🤖 AI-Powered Intelligence

- **Chat with Your Files**: Ask questions about your documents and get intelligent responses powered by Google Gemini AI
- **Semantic Search**: Find files using natural language queries—search by content, not just filenames
- **Automatic Text Extraction**: Supports PDF, DOCX, TXT, and more with automatic content extraction
- **Vector Embeddings**: Files are processed into embeddings stored in Pinecone for advanced semantic search

### 📁 Smart File Management

- **Hierarchical Folders**: Organize files in nested folder structures
- **Drag & Drop Upload**: Modern uploader with progress tracking
- **File Preview**: View and download files directly from the interface
- **Real-time Status**: Track file processing status (UPLOADED → PROCESSING → READY)

### 👥 Collaboration & Sharing

- **Role-Based Access Control**: Share files/folders with VIEWER or EDITOR permissions
- **Email-Based Sharing**: Share with anyone using their email address
- **Permission Management**: Owners and editors can manage shares
- **Secure Access**: Only authorized users can view, edit, or delete content

### 🎨 Modern UI/UX

- **Fully Responsive**: Optimized for mobile, tablet, and desktop
- **Dark Mode**: Sleek void-black theme with glowing gradient effects
- **Framer Motion Animations**: Smooth transitions and interactions
- **Accessible Components**: Built with Radix UI primitives

### 🔒 Security & Authentication

- **Better Auth Integration**: Secure session management
- **Google OAuth**: Sign in with Google
- **Row-Level Security**: Prisma-enforced access controls
- **S3 Presigned URLs**: Secure file uploads and downloads

---

## 🛠 Tech Stack

### Frontend

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - Latest React with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first styling
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Lucide React](https://lucide.dev/)** - Modern icon library

### Backend & Database

- **[Prisma](https://www.prisma.io/)** - Type-safe ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Primary database
- **[Better Auth](https://www.better-auth.com/)** - Authentication system

### AI & ML

- **[Google Gemini AI](https://ai.google.dev/)** - Chat and embeddings (`gemini-1.5-flash`, `gemini-embedding-001`)
- **[Pinecone](https://www.pinecone.io/)** - Vector database for semantic search
- **[Vercel AI SDK](https://sdk.vercel.ai/)** - Streaming AI responses

### Storage & Processing

- **[AWS S3](https://aws.amazon.com/s3/)** - File storage
- **[Inngest](https://www.inngest.com/)** - Background job processing
- **[LangChain](https://js.langchain.com/)** - Document processing and chunking

### File Processing

- **[pdf-parse](https://www.npmjs.com/package/pdf-parse)** - PDF text extraction
- **[mammoth](https://www.npmjs.com/package/mammoth)** - DOCX to text conversion
- **[file-type](https://www.npmjs.com/package/file-type)** - MIME type detection

---

## 📋 Prerequisites

Before setting up NeuraDrive, ensure you have:

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **Bun** or **npm** package manager
- **PostgreSQL** database (local or [Neon](https://neon.tech/), [Supabase](https://supabase.com/))
- **AWS Account** with S3 bucket
- **Google Cloud Account** with Gemini API access
- **Pinecone Account** with vector index
- **Inngest Account** (for background jobs)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/0x-rekt/neuradrive.git
cd neuradrive
```

### 2. Install Dependencies

```bash
# Using bun (recommended)
bun install

# Or using npm
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/neuradrive"

# Better Auth
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your-super-secret-key-min-32-chars"

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Google Gemini AI (Get from Google AI Studio)
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"

# AWS S3
AWS_REGION="us-east-1"  # or your preferred region
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_S3_BUCKET_NAME="your-bucket-name"

# Pinecone (Get from Pinecone Console)
PINECONE_API_KEY="your-pinecone-api-key"
PINECONE_INDEX="neuradrive"  # or your index name

# Inngest (Get from Inngest Dashboard)
INNGEST_EVENT_KEY="your-inngest-event-key"
INNGEST_SIGNING_KEY="your-inngest-signing-key"
```

### 4. Configure AWS S3

Ensure your S3 bucket has the following IAM policy attached:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

**Enable CORS** on your S3 bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### 5. Set Up Pinecone Index

Create a Pinecone index with these specifications:

- **Dimensions**: 768
- **Metric**: Cosine
- **Cloud**: AWS (or your preference)
- **Region**: Same as your application region

```bash
# Using Pinecone CLI or Dashboard
pinecone create-index neuradrive --dimensions 768 --metric cosine
```

### 6. Set Up Database

Run Prisma migrations to create database tables:

```bash
# Generate Prisma Client
bun prisma generate

# Run migrations
bun prisma migrate deploy

# Or for development with migration creation
bun prisma migrate dev
```

### 7. Start Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
neuradrive/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/             # Authentication endpoints
│   │   ├── chat/             # AI chat with files
│   │   ├── create-folder/    # Folder creation
│   │   ├── delete/           # Delete files/folders
│   │   ├── file/[id]/        # File download
│   │   ├── inngest/          # Inngest webhook
│   │   ├── save/             # File save/edit
│   │   ├── search/           # Semantic search
│   │   ├── share/            # Sharing management
│   │   └── upload/           # File upload
│   ├── chat/[fileId]/        # Chat interface
│   ├── drive/                # Main drive interface
│   ├── upload/               # Upload page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   └── globals.css           # Global styles
│
├── components/               # React components
│   ├── ui/                   # Reusable UI components
│   ├── ChatInterface.tsx     # AI chat component
│   ├── Drive.tsx             # File/folder grid
│   ├── Features.tsx          # Feature showcase
│   ├── Hero.tsx              # Landing hero section
│   ├── HowItWorks.tsx        # How it works section
│   ├── Navbar.tsx            # Navigation bar
│   ├── SignInBtn.tsx         # Sign in button
│   └── Uploader.tsx          # File uploader
│
├── lib/                      # Utility libraries
│   ├── auth.ts               # Better Auth config
│   ├── auth-client.ts        # Client-side auth
│   ├── prisma.ts             # Prisma client
│   ├── s3.ts                 # S3 client
│   └── utils.ts              # Helper functions
│
├── utils/                    # Utility functions
│   ├── chunk.ts              # Text chunking
│   ├── embeddings.ts         # Pinecone operations
│   ├── extract.ts            # File text extraction
│   └── getFile.ts            # File retrieval
│
├── inngest/                  # Background jobs
│   ├── client.ts             # Inngest client
│   └── functions.ts          # Job definitions
│
├── prisma/                   # Database
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Migration history
│
├── generated/                # Generated files
│   └── prisma/               # Generated Prisma types
│
└── public/                   # Static assets
```

---

## 🔑 API Documentation

### Authentication

All API routes require authentication via Better Auth session cookies.

### Endpoints

#### `POST /api/upload`

Upload a file to S3 and create database record.

**Request Body:**

```json
{
  "fileName": "document.pdf",
  "fileType": "application/pdf",
  "fileSize": 1024000,
  "folderId": "optional-folder-id"
}
```

**Response:**

```json
{
  "uploadUrl": "https://s3.amazonaws.com/...",
  "fileId": "clxxxxx"
}
```

#### `POST /api/chat`

Chat with a file using AI.

**Request Body:**

```json
{
  "messages": [{ "role": "user", "content": "What is this document about?" }],
  "fileId": "clxxxxx"
}
```

**Response:** Streaming AI response

#### `POST /api/search`

Semantic search across all files.

**Request Body:**

```json
{
  "query": "machine learning research papers"
}
```

**Response:**

```json
{
  "results": [
    {
      "fileId": "clxxxxx",
      "fileName": "ml-research.pdf",
      "score": 0.89,
      "text": "relevant excerpt..."
    }
  ]
}
```

#### `POST /api/share`

Share a file or folder with another user.

**Request Body:**

```json
{
  "fileId": "clxxxxx", // or folderId
  "email": "user@example.com",
  "role": "VIEWER" // or "EDITOR"
}
```

#### `DELETE /api/delete`

Delete a file or folder (with permissions check).

**Query Parameters:**

- `id` - File or folder ID
- `type` - `"file"` or `"folder"`

---

## 🎯 Key Features Explained

### AI Chat

NeuraDrive uses RAG (Retrieval-Augmented Generation) to enable conversations with your documents:

1. **Text Extraction**: Files are processed to extract text content
2. **Chunking**: Content is split into manageable chunks (500 tokens with 100 token overlap)
3. **Embedding**: Each chunk is converted to a 768-dimensional vector using Gemini
4. **Storage**: Vectors are stored in Pinecone with file metadata
5. **Query**: User questions are embedded and similar chunks are retrieved
6. **Response**: Gemini generates answers based on relevant context

### Semantic Search

Unlike traditional keyword search, semantic search understands meaning:

- Search: "AI research papers" → Finds documents about machine learning, neural networks, etc.
- Works across all file types with extracted text
- Results ranked by cosine similarity
- Returns relevant excerpts with context

### Role-Based Sharing

Two permission levels:

- **VIEWER**: Can view and download files
- **EDITOR**: Can view, download, edit, delete, and share with others

Cascade permissions:

- Sharing a folder shares all contents
- Deleting a folder deletes all contents and shares

---

## 🧪 Background Jobs (Inngest)

NeuraDrive uses Inngest for asynchronous file processing:

### `file-uploaded`

Triggered when a file is uploaded:

1. Downloads file from S3
2. Extracts text content
3. Chunks text into optimal sizes
4. Generates embeddings
5. Stores in Pinecone
6. Updates file status to READY

Configure Inngest webhook URL in your Inngest dashboard:

```
https://yourdomain.com/api/inngest
```

---

## 🔧 Development

### Run Development Server

```bash
bun dev
```

### Run Prisma Studio (Database GUI)

```bash
bun prisma studio
```

### Type Checking

```bash
bun run build
```

### Linting

```bash
bun run lint
```

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables
4. Deploy

**Important**: Set `DATABASE_URL` to use connection pooling for serverless:

```env
DATABASE_URL="postgresql://user:pass@host/db?pgbouncer=true"
```

### Docker (Coming Soon)

---

## 📝 Environment Variables Reference

| Variable                       | Description                  | Required | Example                          |
| ------------------------------ | ---------------------------- | -------- | -------------------------------- |
| `DATABASE_URL`                 | PostgreSQL connection string | ✅       | `postgresql://...`               |
| `BETTER_AUTH_URL`              | Base URL of your app         | ✅       | `http://localhost:3000`          |
| `BETTER_AUTH_SECRET`           | Random 32+ character secret  | ✅       | `abc123...`                      |
| `GOOGLE_CLIENT_ID`             | Google OAuth client ID       | ✅       | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET`         | Google OAuth secret          | ✅       | `GOCSPX-...`                     |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini API key               | ✅       | `AIza...`                        |
| `AWS_REGION`                   | S3 bucket region             | ✅       | `us-east-1`                      |
| `AWS_ACCESS_KEY_ID`            | AWS access key               | ✅       | `AKIA...`                        |
| `AWS_SECRET_ACCESS_KEY`        | AWS secret key               | ✅       | `xyz...`                         |
| `AWS_S3_BUCKET_NAME`           | S3 bucket name               | ✅       | `neuradrive-uploads`             |
| `PINECONE_API_KEY`             | Pinecone API key             | ✅       | `abc-123...`                     |
| `PINECONE_INDEX`               | Pinecone index name          | ✅       | `neuradrive`                     |
| `INNGEST_EVENT_KEY`            | Inngest event key            | ✅       | `evt_...`                        |
| `INNGEST_SIGNING_KEY`          | Inngest signing key          | ✅       | `signkey-...`                    |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🙏 Acknowledgments

- **Google Gemini** for powerful AI capabilities
- **Vercel** for Next.js and deployment platform
- **Prisma** for excellent database tooling
- **Pinecone** for vector database
- **Better Auth** for authentication
- **Inngest** for background job processing

---

## 📧 Support

For questions or issues:

- Open an [issue](https://github.com/yourusername/neuradrive/issues)
- Email: support@neuradrive.com
- Documentation: [docs.neuradrive.com](https://docs.neuradrive.com)

---

<div align="center">
  <p>Built with 🧠 and ⚡ by the NeuraDrive Team</p>
  <p>Storage with A Higher Mind.</p>
</div>
