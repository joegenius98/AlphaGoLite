release: sh -c 'cd play_go_web_app && python manage.py makemigrations && python manage.py migrate && export DJANGO_SETTINGS_MODULE=play_go_web_app.settings'
web: sh -c 'cd play_go_web_app && daphne play_go_web_app.asgi:application'
