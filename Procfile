release: python play_go_web_app/manage.py migrate
web: gunicorn --chdir play_go_web_app play_go_web_app.wsgi --log-file -
