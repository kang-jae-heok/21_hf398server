module.exports = {
  apps : [{
    name: 'Fooding_SERVER',
    script: 'app.js',

    instances: 1,
    autorestart: true,
    watch: true,
    ignore_watch: ["node_modules", ".git", "*.config", "*.json", "./public"],
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    error_file:"./error.log",
    wait_ready:true,
    listen_timeout:10000
  }],

  // deploy : {
  //   production : {
  //     user : 'node',
  //     host : 'localhost',
  //     ref  : 'origin/master',
  //     repo : 'git@github.com:repo.git',
  //     path : '/var/www/production',
  //     'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
  //   }
  // }
};