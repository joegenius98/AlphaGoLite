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

    print("go_env.render('terminal'):\n")
    go_env.render('terminal')
    # initial_state_copy = go_env.state()

    # # visual representation of board
    # print(gogame.str(initial_state_copy))

    actions = ((18, 18), (0, 0), (0, 2), (2, 17))

    for action in actions:
        # the state is a class of instance go game. We can use
        # this state to perform mcts and evaluation.
        (state, past_states_w_player), reward, done, info = go_env.step(action)
        assert (go_env.past_states_with_player == past_states_w_player).all()
        print(f"Action taken: {action}")
        go_env.render('terminal')

        print("past_states_w_player:\n")
        print(past_states_w_player, past_states_w_player.shape)

        print('\nvalid moves:\n')
        print(go_env.valid_moves(), go_env.valid_moves().shape)

        print(f"It is {go_env.turn()}'s turn\n")

    # valid_moves = go_env.valid_moves()[:-1].reshape((19, 19))

    # assert valid_moves[18, 18] == 0.
