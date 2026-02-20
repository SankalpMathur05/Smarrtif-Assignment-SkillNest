# Design Document: Backend Deployment to Render

## Overview

This design document outlines the deployment architecture for the SkillNest backend server to Render. The deployment will use Render's native YAML configuration for automated builds and deployments, with proper environment variable management and CORS configuration for production.

The deployment strategy focuses on:
- Automated builds triggered by GitHub commits
- Proper TypeScript compilation to production-ready JavaScript
- Secure environment variable management
- Production-ready CORS configuration
- Health monitoring and error handling

## Architecture

### Deployment Flow

```mermaid
graph LR
    A[Local Development] -->|git push| B[GitHub Repository]
    B -->|Webhook| C[Render Platform]
    C -->|Build| D[npm run build]
    D -->|Compile| E[TypeScript to JavaScript]
    E -->|Deploy| F[Start Server]
    F -->|Connect| G[MongoDB Atlas]
    F -->|Serve| H[Production API]
```

### Component Interaction

```mermaid
graph TD
    A[Render Service] -->|Reads| B[render.yaml]
    A -->|Executes| C[Build Command]
    C -->|Compiles| D[src/ TypeScript]
    D -->|Outputs| E[dist/ JavaScript]
    A -->|Executes| F[Start Command]
    F -->|Runs| G[dist/server.js]
    G -->|Connects| H[MongoDB]
    G -->|Serves| I[Express API]
    I -->|CORS Check| J[Client Requests]
```

## Components and Interfaces

### 1. Render Configuration File (render.yaml)

**Location:** Root directory of the repository

**Purpose:** Defines the service configuration for Render deployment

**Structure:**
```yaml
services:
  - type: web
    name: skillnest-backend
    runtime: node
    region: oregon
    plan: free
    rootDir: ./server
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        sync: false
      - key: MONGO_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: JWT_EXPIRE
        sync: false
      - key: ADMIN_SECRET
        sync: false
      - key: CLIENT_ORIGIN
        sync: false
```

**Key Configuration Elements:**
- `type: web` - Defines this as a web service
- `runtime: node` - Specifies Node.js runtime
- `region: oregon` - Deployment region (can be changed)
- `plan: free` - Uses Render's free tier
- `rootDir: ./server` - Points to the server directory in monorepo
- `buildCommand` - Installs dependencies and compiles TypeScript
- `startCommand` - Runs the compiled JavaScript
- `envVars` - Lists required environment variables (values set in dashboard)

### 2. Package.json Scripts

**Current Scripts:**
```json
{
  "start": "node dist/server.js",
  "dev": "nodemon src/server.ts",
  "build": "tsc"
}
```

**Analysis:** The existing scripts are already production-ready:
- `build` compiles TypeScript using tsconfig.json configuration
- `start` runs the compiled JavaScript from dist/
- No changes needed to package.json

### 3. TypeScript Configuration

**Current Configuration (tsconfig.json):**
```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

**Analysis:** Configuration is production-ready:
- Outputs to `./dist` directory
- Uses CommonJS modules (compatible with Node.js)
- Strict type checking enabled
- No changes needed

### 4. CORS Configuration

**Current Implementation (app.ts):**
```typescript
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.CLIENT_ORIGIN,
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
```

**Analysis:** CORS configuration is production-ready:
- Allows localhost origins for development
- Respects `CLIENT_ORIGIN` environment variable for production
- In non-production mode, allows all origins
- In production mode, strictly enforces allowed origins
- Enables credentials for cookie-based authentication
- No code changes needed, only environment variable configuration

### 5. Environment Variables

**Required Variables:**

| Variable | Description | Example Value | Required |
|----------|-------------|---------------|----------|
| PORT | Server port (auto-set by Render) | 10000 | Yes |
| MONGO_URI | MongoDB connection string | mongodb+srv://user:pass@cluster.mongodb.net/db | Yes |
| JWT_SECRET | Secret key for JWT signing | your-secret-key-here | Yes |
| JWT_EXPIRE | JWT expiration time | 30d | Yes |
| NODE_ENV | Environment mode | production | Yes |
| ADMIN_SECRET | Admin authentication secret | admin-secret-key | Yes |
| CLIENT_ORIGIN | Frontend URL for CORS | https://your-frontend.vercel.app | Yes |

**Configuration Method:**
- Set in Render dashboard under "Environment" tab
- Values are encrypted and secure
- Can be updated without redeployment

### 6. Health Check Endpoint

**Current Implementation:**
```typescript
app.get('/', (req: Request, res: Response) => {
    res.send('SkillNest API is running...');
});
```

**Analysis:** 
- Root endpoint returns success message
- Render will use this for health checks
- Returns HTTP 200 when server is healthy
- No changes needed

### 7. Database Connection

**Current Implementation (server.ts):**
```typescript
const startServer = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('MongoDB Connected Successfully');

        const server = app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });

        process.on('unhandledRejection', (err: any) => {
            console.error(`Error: ${err.message}`);
            server.close(() => process.exit(1));
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};
```

**Analysis:** Database connection is production-ready:
- Validates MONGO_URI before attempting connection
- Uses 5-second timeout for connection attempts
- Logs connection status
- Handles connection errors gracefully
- Exits with error code on failure
- No changes needed

## Data Models

### Render Service Configuration

```typescript
interface RenderService {
  type: 'web';
  name: string;
  runtime: 'node';
  region: string;
  plan: 'free' | 'starter' | 'standard' | 'pro';
  rootDir: string;
  buildCommand: string;
  startCommand: string;
  envVars: EnvironmentVariable[];
}

interface EnvironmentVariable {
  key: string;
  value?: string;
  sync: boolean;
}
```

### Deployment Documentation Structure

```typescript
interface DeploymentGuide {
  prerequisites: string[];
  steps: DeploymentStep[];
  environmentVariables: EnvironmentVariableDoc[];
  troubleshooting: TroubleshootingItem[];
}

interface DeploymentStep {
  stepNumber: number;
  title: string;
  description: string;
  commands?: string[];
  screenshots?: string[];
}

interface EnvironmentVariableDoc {
  name: string;
  description: string;
  required: boolean;
  exampleValue?: string;
}

interface TroubleshootingItem {
  issue: string;
  solution: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Environment Variable Validation

*For any* required environment variable (PORT, MONGO_URI, JWT_SECRET, JWT_EXPIRE, NODE_ENV, ADMIN_SECRET, CLIENT_ORIGIN), if it is missing or undefined, the Backend_Server should fail to start with a descriptive error message indicating which variable is missing.

**Validates: Requirements 2.1, 2.2**

### Property 2: CORS Origin Enforcement in Production

*For any* HTTP request origin, when NODE_ENV is set to production, the Backend_Server should only accept requests from origins in the allowedOrigins array (localhost:3000, 127.0.0.1:3000, CLIENT_ORIGIN), and reject all other origins with a CORS error.

**Validates: Requirements 4.1, 4.4, 7.4**

### Property 3: Log Sanitization

*For any* error or log message generated by the Backend_Server, the message should never contain sensitive values such as JWT_SECRET, ADMIN_SECRET, or password portions of MONGO_URI.

**Validates: Requirements 7.2**

## Error Handling

### Build Errors

**TypeScript Compilation Errors:**
- If TypeScript compilation fails, the build process will exit with a non-zero code
- Render will display the compilation errors in the deployment logs
- Deployment will not proceed until errors are fixed

**Dependency Installation Errors:**
- If npm install fails, the build will fail
- Common causes: network issues, incompatible package versions
- Solution: Check package.json for version conflicts

### Runtime Errors

**MongoDB Connection Failures:**
```typescript
// Current implementation handles this correctly
try {
    await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
    });
} catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
}
```

**Handling:**
- Server logs the error
- Exits with code 1
- Render will attempt to restart the service
- Check MONGO_URI is correct and MongoDB Atlas allows Render's IP addresses

**Missing Environment Variables:**
```typescript
// Current implementation validates MONGO_URI
if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables');
}
```

**Handling:**
- Server throws descriptive error
- Exits before attempting connections
- Check all required environment variables are set in Render dashboard

**CORS Errors:**
```typescript
// Current implementation rejects unauthorized origins
if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
    callback(null, true);
} else {
    callback(new Error('Not allowed by CORS'));
}
```

**Handling:**
- Returns CORS error to client
- Logs the rejected origin
- Verify CLIENT_ORIGIN is set correctly in environment variables

**Unhandled Promise Rejections:**
```typescript
// Current implementation handles this
process.on('unhandledRejection', (err: any) => {
    console.error(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});
```

**Handling:**
- Logs the error
- Gracefully closes server
- Exits with code 1
- Render will restart the service

## Testing Strategy

### Unit Tests

Unit tests will focus on specific examples and edge cases:

**Configuration File Validation:**
- Test that render.yaml exists and is valid YAML
- Test that all required fields are present
- Test that build and start commands are correct
- Test that environment variables are listed

**CORS Configuration:**
- Test that localhost origins are in allowedOrigins
- Test that CLIENT_ORIGIN is included when set
- Test that credentials are enabled
- Test development mode allows all origins
- Test production mode enforces restrictions

**Health Check Endpoint:**
- Test GET / returns 200 status
- Test response contains success message
- Test endpoint is accessible before MongoDB connection

**MongoDB Connection:**
- Test connection with valid MONGO_URI
- Test error handling with invalid MONGO_URI
- Test timeout configuration is 5 seconds
- Test success logging
- Test error logging and exit code

**Environment Variable Handling:**
- Test server fails when MONGO_URI is missing
- Test server fails when JWT_SECRET is missing
- Test error messages are descriptive

**Security:**
- Test no hardcoded secrets in code
- Test error messages don't expose sensitive values
- Test unhandled rejection handler works

### Property-Based Tests

Property-based tests will verify universal properties across many inputs:

**Property Test 1: Environment Variable Validation**
- Generate random combinations of missing environment variables
- For each combination, verify server fails to start
- Verify error message indicates which variable is missing
- Run 100+ iterations with different missing variables
- **Tag: Feature: backend-deployment, Property 1: Environment Variable Validation**

**Property Test 2: CORS Origin Enforcement**
- Generate random origin strings (valid URLs, invalid URLs, localhost variants)
- For each origin, make a request with NODE_ENV=production
- Verify only allowedOrigins are accepted
- Verify all other origins are rejected with CORS error
- Run 100+ iterations with different origins
- **Tag: Feature: backend-deployment, Property 2: CORS Origin Enforcement in Production**

**Property Test 3: Log Sanitization**
- Generate random error scenarios (connection failures, validation errors, etc.)
- For each error, capture log output
- Verify logs don't contain JWT_SECRET, ADMIN_SECRET, or password from MONGO_URI
- Run 100+ iterations with different error types
- **Tag: Feature: backend-deployment, Property 3: Log Sanitization**

### Integration Tests

Integration tests will verify end-to-end workflows:

**Deployment Workflow:**
- Test complete build process (npm install && npm run build)
- Verify dist/ directory is created with compiled files
- Test start command runs compiled server
- Verify server starts and connects to MongoDB
- Test health check endpoint is accessible

**Production Configuration:**
- Test with all environment variables set
- Verify NODE_ENV=production enforces CORS
- Test CLIENT_ORIGIN is respected
- Verify MongoDB connection works
- Test API endpoints are accessible

### Testing Configuration

**Property-Based Testing Library:**
- For Node.js/TypeScript: Use `fast-check` library
- Install: `npm install --save-dev fast-check @types/fast-check`
- Each property test must run minimum 100 iterations
- Each test must reference its design document property in comments

**Unit Testing Library:**
- Use Jest or Mocha for unit tests
- Install: `npm install --save-dev jest @types/jest ts-jest`
- Configure for TypeScript support

**Test Coverage Goals:**
- All acceptance criteria covered by tests
- All correctness properties implemented as property tests
- Edge cases and error conditions covered by unit tests
- Integration tests verify complete workflows
