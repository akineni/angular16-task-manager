/**
 * Environment Setup Instructions
 *
 * This file is just an example template.
 * When setting up the project, create the following files based on this one:
 *
 * - src/environments/environment.ts                → for local development
 * - src/environments/environment.development.ts    → for local development (builds on development server; ng serve)
 * - src/environments/environment.prod.ts           → for production builds
 *
 * Copy the content of environment.example.ts into each file,
 * then update the values as needed (API URLs, provider IDs, etc).
 */
export const environment = {
    production: false,
    backend_root: 'http://localhost:8000/api/',
    local_storage_access_token_key: 'access_token',
    GOOGLE_PROVIDER_ID: '',
    FACEBOOK_PROVIDER_ID: ''
};
