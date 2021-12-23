# AlphaGo Lite

This repository holds code for the A.I. model I made for playing the board game of Go. I am to develop the algorithms used to develop AlphaGo Zero, in a lite version. It also holds web application code for a Go-playing website where users can play against each other or play against the A.I.

It is still a work in progress.

# How to Run

Inside of [`play_go_web_app/play_go_web_app`](play_go_web_app/play_go_web_app), create `django_secrets.py` and create two string variables `SECRET_CODE` and `SECRET_HOST` to be used in [`settings.py`](play_go_web_app/play_go_web_app/settings.py) if deployment is your priority.

Otherwise, simply get rid of the `import .django_secrets ...` statement in [`settings.py`](play_go_web_app/play_go_web_app/settings.py) and the corresponding variables and make the secret key an empty string. `ALLOWED_HOSTS` can just be an empty list.

## Docker Way

If you plan on running `docker-compose.yml`, create an`.env` file on this project's directory and set `SECRET_HOST` to whatever you desire (e.g., a website domain for deployment).

## Local Way

`cd play_go_web_app`

### The backend:

On one terminal, perform:

`python manage.py makemigrations` (only if you made database/Django model changes)

`python manage.py migrate` (only if you made database/Django model changes)

`python manage.py runserver`

### The frontend

On a separate terminal, perform:

`cd frontend`

`npm run dev`

# Structure

| File                                                  | Description                                                                                                                                                                                   |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Frontend](play_go_web_app/frontend)                  | Frontend displaying multiplayer, real-time gameplay, with abilities for users to create their own rooms or join a room.                                                                       |
| [Backend](play_go_web_app/api)                        | Backend with an API responsible for fetching information about rooms from a database.                                                                                                         |
| [test_tf.py](test_tf.py)                              | the [TensorFlow quickstart tutorial](https://www.tensorflow.org/tutorials/quickstart/beginner) code (used for testing purposes on a Linux-based computer science machine found at my college) |
| [mcts.py](algorithms/mcts.py)                         | holds the MonteCarloTree class that is responsible for the underlying data structures and algorithms to ultimately run the big algorithm in the room: Monte Carlo Tree Search                 |
| [politer-selfplay.py](algorithms/politer-selfplay.py) | responsible for the policy iteration algorithm and executing each episode, all for the purpose of training and updating the neural network involved                                           |
| [docker-compose.yml](./docker-compose.yml)            | runs Docker images for `Django` backend and `React` frontend for deployment/compatability purposes                                                                                            |

# Sources

- [TechWithTim's Music Controller Web App Tutorial](https://github.com/techwithtim/Music-Controller-Web-App-Tutorial) helped us immensely with starting this project.
- [Django channels tutorial](https://channels.readthedocs.io/en/stable/tutorial/part_1.html) from the docs helped us build sockets for real-time communication across clients viewing or partiicpating in gameplay inside a Room.
