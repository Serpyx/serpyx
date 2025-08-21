module.exports = {
  apps: [
    {
      name: 'serpyx-backend',
      script: 'server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
        env_file: './env.production'
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024',
      watch: false,
      ignore_watch: ['node_modules', 'logs', '*.log'],
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    },
    {
      name: 'serpyx-frontend',
      script: 'start-frontend.js',
      cwd: '../client',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      error_file: '../client/logs/err.log',
      out_file: '../client/logs/out.log',
      log_file: '../client/logs/combined.log',
      time: true,
      watch: false,
      ignore_watch: ['node_modules', 'logs', '*.log'],
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ],

  deploy: {
    production: {
      user: 'serpyx',
      host: 'serpyx.com',
      ref: 'origin/main',
      repo: 'https://github.com/serpyx/serpyx-backend.git',
      path: '/var/www/serpyx',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};

    {
      name: 'serpyx-backend',
      script: 'server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
        env_file: './env.production'
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024',
      watch: false,
      ignore_watch: ['node_modules', 'logs', '*.log'],
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    },
    {
      name: 'serpyx-frontend',
      script: 'start-frontend.js',
      cwd: '../client',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      error_file: '../client/logs/err.log',
      out_file: '../client/logs/out.log',
      log_file: '../client/logs/combined.log',
      time: true,
      watch: false,
      ignore_watch: ['node_modules', 'logs', '*.log'],
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ],

  deploy: {
    production: {
      user: 'serpyx',
      host: 'serpyx.com',
      ref: 'origin/main',
      repo: 'https://github.com/serpyx/serpyx-backend.git',
      path: '/var/www/serpyx',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};






















