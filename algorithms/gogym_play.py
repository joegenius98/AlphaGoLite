import gym
from gym_go import gogame
from utils import *
# from neuralnet import *

# we can change these args as we go
args = dotdict({
    'numIters': 1000,
    # Number of complete self-play games to simulate during a new iteration.
    'numEps': 100,
    'tempThreshold': 15,        #
    # During arena playoff, new neural net will be accepted if threshold or more of games are won.
    'updateThreshold': 0.6,
    # Number of game examples to train the neural networks.
    'maxlenOfQueue': 200000,
    'numMCTSSims': 25,          # Number of games moves for MCTS to simulate.
    # Number of games to play during arena play to determine if new net will be accepted.
    'arenaCompare': 40,
    'cpuct': 1,

    'checkpoint': './temp/',
    'load_model': False,
    'load_folder_file': ('/dev/models/8x100x50', 'best.pth.tar'),
    'numItersForTrainExamplesHistory': 20,

})


if __name__ == "__main__":
    go_env = gym.make('gym_go:go-v0', size=19, komi=0, reward_method='real')
    # print(go_env)
    # initialize the environment
    go_env.reset()  # this is necessary

    # nnet = AlphaGoLite_Network()

    # print(go_env.state_)
    # prints an array, 1 being valid, 0 being occupied
    print("\nValid moves: \n")
    print(go_env.valid_moves(),
          f"{type(go_env.valid_moves())} {go_env.valid_moves().shape}\n")

    # initial_state_copy = go_env.state()

    # # visual representation of board
    # print(gogame.str(initial_state_copy))

    first_action = (18, 18)
    second_action = (0, 0)

    # the state is a class of instance go game. We can use
    # this state to perform mcts and evaluation.
    state, reward, done, info = go_env.step(first_action)
    print("go_env.render('terminal'):\n")

    go_env.render('terminal')
    print('\nvalid moves:\n')
    print(go_env.valid_moves())

    print(f"gogame turn: {gogame.turn(state)}")

    # print(
    #     f"state 1:\n{state}\nreward:\n{reward}\ndone:\n{done}\ninfo:\n{info}\n")

    valid_moves = go_env.valid_moves()[:-1].reshape((19, 19))

    state, reward, done, info = go_env.step(second_action)

    print("\nRender board after second move:\n")
    go_env.render('terminal')
    print('\nvalid moves\n')
    print(go_env.valid_moves())

    print(f"gogame turn: {gogame.turn(state)}")
    # print(
    #     f"state 2:\n{state}\nreward:\n{reward}\ndone:\n{done}\ninfo:\n{info}\n")

    assert valid_moves[18, 18] == 0.
