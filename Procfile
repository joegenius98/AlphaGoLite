release: sh -c 'cd play_go_web_app && python manage.py makemigrations && python manage.py migrate'
web: sh -c 'cd play_go_web_app && daphne -b 0.0.0.0 -p $PORT play_go_web_app.asgi:application'
