import gym
import gogame
from utils import *
from neuralnet import *

# we can change these args as we go
args = dotdict({
    'numIters': 1000,
    'numEps': 100,              # Number of complete self-play games to simulate during a new iteration.
    'tempThreshold': 15,        #
    'updateThreshold': 0.6,     # During arena playoff, new neural net will be accepted if threshold or more of games are won.
    'maxlenOfQueue': 200000,    # Number of game examples to train the neural networks.
    'numMCTSSims': 25,          # Number of games moves for MCTS to simulate.
    'arenaCompare': 40,         # Number of games to play during arena play to determine if new net will be accepted.
    'cpuct': 1,

    'checkpoint': './temp/',
    'load_model': False,
    'load_folder_file': ('/dev/models/8x100x50','best.pth.tar'),
    'numItersForTrainExamplesHistory': 20,

})


if __name__=="__main__":
    go_env = gym.make('gym_go:go-v0', size=19, komi=0, reward_method='real')
    go_env.reset() #this is necessary

    nnet = AlphaGoLite_Network()

    print(go_env.state().invalid_moves())


"""    
    initial_state_copy=go_env.state()

    print(gogame.str(initial_state_copy))

    first_action = (2,5)
    second_action = (5,2)

    # the state is a class of instance go game. We can use 
    # this state to perform mcts and evaluation.
    state, reward, done, info = go_env.step(first_action)
    state, reward, done, info = go_env.step(second_action)

    go_env.state_=initial_state_copy

    print(go_env.state_)
    
    go_env.render('terminal')
"""