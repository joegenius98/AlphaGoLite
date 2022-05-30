release: python play_go_web_app/manage.py makemigrations \
python play_go_web_app/manage.py migrate
web: sh -c 'cd ./play_go_web_app && daphne play_go_web_app.asgi:application'
