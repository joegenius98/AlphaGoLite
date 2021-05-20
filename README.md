# AlphaGo Lite

This repository holds code for the A.I. model I made for playing the board game of Go. I am to develop the algorithms used to develop AlphaGo Zero, in a lite version. It also holds web application code for a Go-playing website where users can play against each other or play against the A.I.

# Files

| File                                                  | Description                                                                                                                                                                                   |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [test_tf.py](test_tf.py)                              | the [TensorFlow quickstart tutorial](https://www.tensorflow.org/tutorials/quickstart/beginner) code (used for testing purposes on a Linux-based computer science machine found at my college) |
| [mcts.py](algorithms/mcts.py)                         | holds the MonteCarloTree class that is responsible for the underlying data structures and algorithms to ultimately run the big algorithm in the room: Monte Carlo Tree Search                 |
| [politer-selfplay.py](algorithms/politer-selfplay.py) | responsible for the policy iteration algorithm and executing each episode, all for the purpose of training and updating the neural network involved                                           |
