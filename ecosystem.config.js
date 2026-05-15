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
        NEXT_PUBLIC_API_URL: 'https://api.imperialacademy.edu.gh',
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
        FRONTEND_URL: 'https://imperialacademy.edu.gh',
        API_URL: 'https://imperialacademy.edu.gh',
        ADMIN_GATE_SECRET: 'post-n0-bill',
        DATABASE_URL:'postgresql://imperial_admin:ImperialAcademies%40@localhost:5432/imperial_academy?schema=public'
      }
    }
  ]
};
