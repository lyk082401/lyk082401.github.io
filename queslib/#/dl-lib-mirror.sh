# bash "#/dl-lib-mirror.sh" https://;
wget -v -c -m -4 --no-check-certificate -P "$(if [ ! -d 'res' ]; then echo '../'; fi)res" "${@}";