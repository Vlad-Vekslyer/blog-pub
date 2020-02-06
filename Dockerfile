FROM richarvey/nginx-php-fpm

# COPY conf/nginx-prod.conf /opt/docker/etc/nginx/vhost.common.d
# COPY ./entrypoint.sh /opt/docker/bin/entrypoint.sh

ENV WEBROOT=/var/www/html/public/api
ENV PHP_ENV=PROD
ENV GIT_EMAIL=vladi00345@gmail.com
ENV GIT_NAME=Vlad
ENV GIT_USERNAME=Vlad-Vekslyer
ENV GIT_REPO=github.com/Vlad-Vekslyer/blog-pub.git
