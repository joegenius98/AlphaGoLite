# How the Training Pipeline Works

This is the understanding to our best knowledge.

1. We initlaize the neural network parameters randomly. Then, we generate 25,000 games at each iteration.
   We send off these games to a training database queue whose maximum capacity is 500,000 games. (When we fill
   up the queue to 500,000 games, each subsequent game will be appended with the first game being removed out).

2. Asynchronously, the neural network trains with mini batches of 2,048 time steps across the previous
   500,000 games. We do this 1,000 times and compare the 1,000th checkpoint against the current best neural network,
   which is the current network userd to generate the data (so in this case, it is the randomly initalized neural network.)

3. If the win rate of this checkpoint is > 55%, then we replace the current best neural network with this checkpoint,
   and subsequently use it to generate new self-play data. We clear up all the games in the queue to start clean. If the win
   rate is any less than 55%, then we continue using the current best and keep checking every 1,000 training iterations (2,000th
   checkpoint, 3000th, etc.)

Note: the neural network stays constant while generating self-training data. We have two copies then: one neural network
that is used to generate the training data, and anotehr that is purely being trained.
