FROM webdevops/php-nginx

COPY . ./app
COPY conf/nginx-prod.conf /opt/docker/etc/nginx/vhost.common.d

ENV WEB_DOCUMENT_ROOT=/app/public/api
ENV PHP_ENV=PROD
