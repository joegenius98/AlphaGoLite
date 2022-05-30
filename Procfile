release: sh -c 'cd play_go_web_app && export DJANGO_SETTINGS_MODULE=play_go_web_app.settings && python manage.py makemigrations && python manage.py migrate'
web: sh -c 'cd play_go_web_app && daphne play_go_web_app.asgi:application'
