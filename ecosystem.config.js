module.exports = {
  apps: [
    {
      name: 'imperial-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_API_URL: 'https://api.your-domain.com', // Update with your actual API URL
        ADMIN_GATE_SECRET: 'post-n0-bill'
      }
    },
    {
      name: 'imperial-backend',
      cwd: './backend',
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        ADMIN_GATE_SECRET: 'post-n0-bill',
        DATABASE_URL: 'postgresql://user:password@localhost:5432/dbname' // Update with your actual DB URL
      }
    }
  ]
};
