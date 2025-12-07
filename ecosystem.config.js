module.exports = {
    apps: [
        {
            script: "node_modules/.bin/next",
            args: "start -p 8003",
            watch: false,
            env: {
                APP_PORT: 8003,
                NODE_ENV: "production"
            },
            instances: "1",
            autorestart: true,
            name: "qsurv",
            max_memory_restart: "512M"
        }
    ]
};