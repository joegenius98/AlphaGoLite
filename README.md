# AlphaGo Lite

This repository holds code for the A.I. model I made for playing the board game of Go. I am to develop the algorithms used to develop AlphaGo Zero, in a lite version. It also holds web application code for a Go-playing website where users can play against each other or play against the A.I.

It is still a work in progress.

# How to Run

Inside of [`play_go_web_app/play_go_web_app`](play_go_web_app/play_go_web_app), create `django_secrets.py` and create two string variables `SECRET_CODE` and `SECRET_HOST` to be used in [`settings.py`](play_go_web_app/play_go_web_app/settings.py) if deployment is your priority.

Otherwise, simply get rid of the `import .django_secrets ...` statement in [`settings.py`](play_go_web_app/play_go_web_app/settings.py) and the corresponding variables and make the secret key an empty string. `ALLOWED_HOSTS` can just be an empty list.

**Note: [`Docker`](https://www.docker.com/get-started) is needed no matter if you run the Docker way or the local way. You need Docker at least for installing `redis`, which enables socket functionality.**

## Docker Way

If you plan on running `docker-compose.yml`, create an`.env` file on this project's directory and set `SECRET_HOST` to whatever you desire (e.g., a website domain for deployment).

## Local Way

`cd play_go_web_app` on two different terminals.

### The backend:

`cd play_go_web_app` again

In `settings.py`, in `CHANNEL_LAYERS`, change `'sockets'` -> `'localhost'`

On one terminal, perform:

`python manage.py makemigrations` (also run this with every Django model change)

`python manage.py migrate` (also run this with every Django model change)

`python manage.py runserver`

### The frontend

Install [`Node.js`](https://nodejs.org/en/download/).

On a separate terminal, perform:

`cd frontend`

`npm install` (for getting `package.json` dependencies)
On the other terminal, perform:

`cd frontend`

`npm install`

`npm run dev`

### Redis

`docker run -p 6379:6379 -d redis:5 `

# Structure

| File                                       | Description                                                                                                                                                                                   |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Frontend](play_go_web_app/frontend)       | Frontend displaying multiplayer, real-time gameplay, with abilities for users to create their own rooms or join a room.                                                                       |
| [Backend](play_go_web_app/api)             | Backend with an API responsible for fetching information about rooms from a database.                                                                                                         |
| [test_tf.py](test_tf.py)                   | the [TensorFlow quickstart tutorial](https://www.tensorflow.org/tutorials/quickstart/beginner) code (used for testing purposes on a Linux-based computer science machine found at my college) |
| [docker-compose.yml](./docker-compose.yml) | runs Docker images for `Django` backend and `React` frontend for deployment/compatability purposes                                                                                            |

# Sources

- [TechWithTim's Music Controller Web App Tutorial](https://github.com/techwithtim/Music-Controller-Web-App-Tutorial) helped us immensely with starting this project.
- [Django channels tutorial](https://channels.readthedocs.io/en/stable/tutorial/part_1.html) from the docs helped us build sockets for real-time communication across clients viewing or partiicpating in gameplay inside a Room.





Path 1: implement game as we found on GitHub
- benefits: easier to do that way, and it would be faster
- downsides: less readable and might be less applicable to those in the reinforcement learning community

Path 2: implementing in Gym
- adding features like the .render() method, so that you can watch the neural net training
- provides value to the A.I. research community 



Bottlenecks:
- ...
