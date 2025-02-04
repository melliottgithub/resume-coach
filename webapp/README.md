# Resume Coach Web Application

**Resume Coach** is a single-page web application.

## Tooling

- **Framework:** Built using React for a dynamic and interactive user interface.
- **CSS Framework:** Styled with TailwindCSS for utility-first and responsive design.
- **Build Tool:** Uses Vite for fast development and optimized builds.
- **Key Dependencies:** 
  - `dayjs` for date manipulation
  - `react-router-dom` for routing
  - `swr` for data fetching

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

Install dependencies:

   ```bash
   npm install
   ```

### Running the Application

To start the development server:

```bash
npm run dev
```
### Building for Production

To build the application for production:

```bash
npm run build
```

The optimized build will be output to the `dist` directory.

### Preview the Build

To preview the production build locally:

```bash
npm run preview
```

## Environment Variables

The application uses the following environment variable, which should be defined in a `.env` file in the root directory:

- **`VITE_API_ENDPOINT`**: The base URL for API endpoints.

Example `.env` file:

```
VITE_API_ENDPOINT=<url-for-backend-services>
```

> Note: URL for backend is the AWS Lambda Function URL