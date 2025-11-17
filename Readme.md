# Changes done for Prod deployment

1. Frontend env changed to :
   1. `VITE_BACKEND_URL=https://www.ahansworks.in`
2. Parent host nginx config:

   ```nginx
    server
    {

            server_name ahansworks.in www.ahansworks.in;

            location / {
                proxy_pass http://localhost:3000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
            }

            location /socket.io/ {
                    proxy_pass http://localhost:5000;
                    proxy_http_version 1.1;
                    proxy_set_header Upgrade $http_upgrade;
                    proxy_set_header Connection "Upgrade";
                    proxy_set_header Host $host;
            }

            location /ws/ {
                    proxy_pass http://localhost:5000;
                    proxy_http_version 1.1;
                    proxy_set_header Upgrade $http_upgrade;
                    proxy_set_header Connection "Upgrade";
                    proxy_set_header Host $host;
            }

            #location / {
            #       proxy_pass http://127.0.0.1:3000;
            #}


        listen [::]:443 ssl ipv6only=on; # managed by Certbot
        listen 443 ssl; # managed by Certbot
        ssl_certificate /etc/letsencrypt/live/www.ahansworks.in/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/www.ahansworks.in/privkey.pem; # managed by Certbot
        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot


    }
    server
    {
        if ($host = ahansworks.in) {
            return 301 https://$host$request_uri;
        } # managed by Certbot


        if ($host = www.ahansworks.in) {
            return 301 https://$host$request_uri;
        } # managed by Certbot


            listen 80;
            listen [::]:80;

            server_name ahansworks.in www.ahansworks.in;
        return 404; # managed by Certbot




    }
   ```
