# Backend Docs

This part of the multiplayer Go web app. explains the files in `api`.

1. [`consumers.py`](/consumers.py) ensures that all spectators and players in a Go match room can see all updates live (text messages and game moves).

2. [`models.py`](/models.py) is the Pythonic abstraction of the database needed to store room data, using Django models.

3. [`routing.py`](/routing.py) shares an access point to allow the frontend and backend to communicate data.

4.
