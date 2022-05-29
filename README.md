# AlphaGo Lite

This repository holds code for the A.I. model we made for playing the board game of Go. We are developing the algorithms used to develop AlphaGo Zero, as a lite version. It also holds web application code for a Go-playing website where users can play against each other or play against the A.I.

It is still a work in progress.

# Heroku-Specific Deployment

## Modifying Frontend Structure

I needed to bring [`.babelrc`](https://github.com/joegenius98/AlphaGoLite/blob/main/.babelrc), [`package.json`](https://github.com/joegenius98/AlphaGoLite/blob/main/package.json), and [`webpack.config.js`](https://github.com/joegenius98/AlphaGoLite/blob/main/webpack.config.js) to get the frontend set up. Apparently, Heroku cannot process my frontend files without doing this.

## Adding New Files

* [`Procfile`](https://github.com/joegenius98/AlphaGoLite/blob/main/Procfile) categorizes and lists the main commands to be run.
* [`requirements.txt`](https://github.com/joegenius98/AlphaGoLite/blob/main/requirements.txt) sets the Heroku `pip` to install the necessary packages. (I had to get `tensorflow-cpu` due to memory constraints of the slug size. Even the current slug size is not optimal, since it is over the soft limit, which affects booting time. Knoweldge of this came from the Heroku app build logs.)
* [`runtime.txt`](https://github.com/joegenius98/AlphaGoLite/blob/main/runtime.txt) specifies the version of Python to run.

## Modifying [`settings.py`](https://github.com/joegenius98/AlphaGoLite/blob/main/play_go_web_app/play_go_web_app/settings.py) 
Heroku has some environmental variables set up. I distinguish between local variables and deployment variables in that file.





# Local Development

## How to Run

Inside of [`play_go_web_app/play_go_web_app`](play_go_web_app/play_go_web_app), create `django_secrets.py` and create two string variables `SECRET_CODE` and `SECRET_HOST` to be used in [`settings.py`](play_go_web_app/play_go_web_app/settings.py) if deployment is your priority.

Otherwise, simply get rid of the `import .django_secrets ...` statement in [`settings.py`](play_go_web_app/play_go_web_app/settings.py) and the corresponding variables and make the secret key an empty string. `ALLOWED_HOSTS` can just be an empty list.

**Note: [`Docker`](https://www.docker.com/get-started) is needed no matter if you run the Docker way or the local way. You need Docker at least for installing `redis`, which enables web socket functionality.**

### Docker Way

If you plan on running `docker-compose.yml`, create an`.env` file on this project's directory and set `SECRET_HOST` to whatever you desire (e.g., a website domain for deployment).

### Local Way

Navigate to the [`environment file location`](./env_setup/environment.yml) on your terminal.

`conda env create -f environment.yml`

`conda activate alphagolite`

#### The backend:

`cd play_go_web_app` again

In `settings.py`, in `CHANNEL_LAYERS`, change `'sockets'` -> `'localhost'`

On one terminal, perform:

`python manage.py makemigrations` (also run this with every Django model change)

`python manage.py migrate` (also run this with every Django model change)

`python manage.py runserver`

#### The frontend

Install [`Node.js`](https://nodejs.org/en/download/).

On a separate terminal, perform:

`cd frontend`

`npm install` (for getting `package.json` dependencies)
On the other terminal, perform:

`cd frontend`

`npm install`

`npm run dev`

#### Redis

`docker run -p 6379:6379 -d redis:5 `

# Structure

| File                                       | Description                                                                                                                                                                                   |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Frontend](play_go_web_app/frontend)       | Frontend displaying multiplayer, real-time gameplay, with abilities for users to create their own rooms or join a room.                                                                       |
| [Backend](play_go_web_app/api)             | Backend with an API responsible for fetching information about rooms from a database.                                                                                                         |
| [test_tf.py](test_tf.py)                   | the [TensorFlow quickstart tutorial](https://www.tensorflow.org/tutorials/quickstart/beginner) code (used for testing purposes on a Linux-based computer science machine found at my college) |
| [docker-compose.yml](./docker-compose.yml) | runs Docker images for `Django` backend and `React` frontend for deployment/compatability purposes                                                                                            |

# Sources

- [TechWithTim's Music Controller Web App Tutorial](https://github.com/techwithtim/Music-Controller-Web-App-Tutorial) helped us immensely with starting this project's web app. His tutorial is on [YouTube](https://youtube.com/playlist?list=PLzMcBGfZo4-kCLWnGmK0jUBmGLaJxvi4j).
- [Django Channels Tutorial](https://channels.readthedocs.io/en/stable/tutorial/part_1.html) from the docs helped us build sockets for real-time communication across clients viewing or partiicpating in gameplay inside a Room.
- [GymGo](https://github.com/aigagror/GymGo.git) helped us with setting up the Go board game environment, taking care of implementation details such as valid moves, generating board symmetries, playing moves, and rendering board states.

- [Beginner’s Guide to Custom Environments in OpenAI’s Gym](https://towardsdatascience.com/beginners-guide-to-custom-environments-in-openai-s-gym-989371673952) helped us integrate the [`GymGo`](https://github.com/aigagror/GymGo.git) repository into our [`algorithms`](./algorithms) folder.

[Django-React App Deployment Tutorial](https://towardsdev.com/django-react-app-from-scratch-to-deployment-part-1-8a2fa9a97f1)
