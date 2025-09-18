# Angular Deployment Guide

This guide will walk you through deploying an Angular application step by step.  
We’ll cover two common deployment options:
- **Vercel CLI** (fast and serverless)
- **Remote Server** (VPS, bare metal, or shared hosting)

> 📝 This guide assumes you already have an Angular project created (using Angular CLI) and that you have Node.js and npm installed on your machine.

---

## ⚙️ Setting Up Environment Files

Angular uses environment files to define different configurations for dev and production.  
These are critical when deploying, because the build system replaces `environment.ts` with `environment.prod.ts` when you run a production build.

- `src/environments/environment.ts` → for local development
- `src/environments/environment.development.ts` → for local development (`ng serve`)
- `src/environments/environment.prod.ts` → used when building for production (`ng build --configuration production`)

Example `environment.prod.ts`:
```ts
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com'
};
```

Make sure your **API URLs and keys** are properly set in `environment.prod.ts` before deploying to Vercel or a server.

---

## 🚀 Deploying with Vercel CLI

Vercel is one of the easiest ways to put a frontend app online.  
We’ll use the Vercel CLI tool to deploy an Angular app.

### Steps

1. **Open your terminal and navigate to your Angular project root**  
   Replace `my-angular-app` with your project folder name:  
   ```bash
   cd path/to/my-angular-app
   ```

2. **Install project dependencies**  
   If you just cloned the repo or haven’t installed dependencies yet:  
   ```bash
   npm install
   ```

3. **Install Vercel CLI globally**  
   ```bash
   npm i -g vercel
   ```

4. **Test a production build locally (optional but recommended)**  
   This ensures your app compiles and uses the correct environment variables.  
   ```bash
   ng build --configuration production --base-href ./
   ```
   The build will be inside `dist/<your-project-name>`.  
   You can open `index.html` locally (or use a static server like `npx serve dist/<your-project-name>`) to test before deployment.

5. **Deploy with Vercel CLI**  
   Run this command from the project root (not `dist/`):  
   ```bash
   vercel --prod
   ```
   Vercel will:
   - Detect your Angular project
   - Run the build using `ng build --configuration production`
   - Use `environment.prod.ts`
   - Host the output online

   The first time you run it, Vercel CLI will ask you to log in and link the project. After that, it will give you a live deployment URL.

6. **Optional: Add a `.vercelignore` file**  
   To prevent uploading large or unnecessary files, create a `.vercelignore` in your project root:  
   ```
   gitignore
   node_modules
   bower_components
   .angular

   npm-debug.log*
   yarn-debug.log*
   yarn-error.log*

   .vercel
   .git
   .gitignore
   ```

---

## 🌍 Deploying to a Remote Server

If you’d rather deploy to your own server (like a VPS or shared hosting), here’s how.

### Steps

1. **Navigate to your project root**  
   ```bash
   cd path/to/my-angular-app
   ```

2. **Install dependencies (if not already installed)**  
   ```bash
   npm install
   ```

3. **Build your Angular app**  
   ```bash
   ng build --configuration production --base-href ./
   ```

   This generates static files inside the `dist/<your-project-name>` folder.

4. **Upload build files to your server**  
   Use `scp`, `rsync`, or FTP to upload everything from the `dist/<your-project-name>` folder to your server.  
   Example with `scp`:  
   ```bash
   scp -r dist/<your-project-name>/* user@your-server:/var/www/html/
   ```

5. **Configure your web server**  
   - For **Nginx**, configure your site like this:  
     ```nginx
     server {
       listen 80;
       server_name yourdomain.com;

       root /var/www/html;

       index index.html;
       location / {
         try_files $uri /index.html;
       }
     }
     ```

   - For **Apache**, add a `.htaccess` file in your Angular build output:  
     ```apache
     <IfModule mod_rewrite.c>
       RewriteEngine On
       RewriteBase /
       RewriteRule ^index\.html$ - [L]
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteRule . /index.html [L]
     </IfModule>
     ```

6. **Restart your web server**  
   ```bash
   sudo systemctl restart nginx
   # or
   sudo systemctl restart apache2
   ```

Your Angular app should now be live 🎉

---

## ✅ Summary

- Set up your environment files properly (`environment.prod.ts` is critical).  
- Use **Vercel CLI** for quick, serverless deployments.  
- Use a **remote server** if you want full control over hosting and routing.  
- Always test a production build locally before deploying.  
- Make sure to navigate to your Angular project root before running commands.
