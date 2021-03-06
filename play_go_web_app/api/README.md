# Backend Docs

This part of the multiplayer Go web app. explains the files in `api`.

1. [`consumers.py`](./consumers.py) ensures that all spectators and players in a Go match room can see all updates live (text messages and game moves).

2. [`models.py`](./models.py) is the Pythonic abstraction of the database needed to store room data, using Django models.

3. [`routing.py`](./routing.py) shares an access point to allow the frontend and backend to communicate data with sockets.

4. [`serializers.py`](./serializers.py) helps send/receive/convert `JSON` data (`React.js`) <--> dictionary data (`Django`) so that data is readable across frontend and backend languages.

5. [`views.py`](./views.py) provides a view of the data from `POST` and `GET` requests to ensure that the `API` is working properly (Django provides an already-built, separate frontend to view our data through viewing the URLs from 6. in a web browser.) This file uses serializers from 4. to give the database operations needed to create, (re)join, update, and leave rooms. 

6. [`urls.py`](./urls.py) provide the gateways to the database operations in 5. 

The difference between [`urls.py`](./urls.py) and [`routing.py`](./routing.py) is that sockets handle real-time communication for a Go match while this file stores the changes in the database so that if a completely new user joins the room, that user can see what is going on. If I just did sockets, I would have no persistent storage to fetch room details for newcomers. If I just had a database, there would be many `API` calls happening at once, potentially not allowing real-time communication.
