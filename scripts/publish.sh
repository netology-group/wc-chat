#!/bin/sh -e

if [ ! ${SFTP_USER} ]; then echo "SFTP_USER isn't specified" 1>&2; exit 1; fi
if [ ! ${SFTP_PASSWORD} ]; then echo "SFTP_PASSWORD isn't specified" 1>&2; exit 1; fi
if [ ! ${PROJECT} ]; then echo "PROJECT isn't specified" 1>&2; exit 1; fi

PROJECT=${PROJECT}
BUCKET=${BUCKET:-'docs-netology-group.services'}
HOST=${HOST:-'sftp.selcdn.ru'}
SOURCE=${SOURCE:-'docs/book'}
SSL_ALLOW=${SSL_ALLOW:-''}

lftp -c "${SSL_ALLOW} open -u ${SFTP_USER},${SFTP_PASSWORD} ${HOST}; mirror --parallel=4 --no-empty-dirs --no-perms --exclude-glob .DS_Store --reverse --verbose -e ${SOURCE} ${BUCKET}/${PROJECT}"
