# baseline pseudocode obtained from: https://web.stanford.edu/~surag/posts/alphazero.html
import numpy as np

class MonteCarloTree:

    def __init__(self, game, nnet):
        self.game=game
        self.nnet=nnet
        self.__state_to_actions = {} # dictionary constructor (double-check on this)
        self.__Q_vals = {}

        self.__N_vals = {} # dependent on state and action as keys 
        self.__agg_N_vals = {} # just dependent on a state (aggregate across all children)

        self.__c_puct = 1
        self.__visited = set()
        self.__pi = np.array([])

    # "the expected reward for taking action from state i.e. the Q values"
    def __Q_val(self, state, action):
        return -1 # filler 
    
    def __N_val(self, state, action):
        return -1 # filler

    # "the initial estimate of taking an action from the state according to the policy returned by the current neural network."
    def __prior_prob(self, state, action):
        return -1
    
    def __game_ended(self, state):
        return False # filler 
    
    def __game_reward(self, state):
        return -1 # filler
    
    def __get_valid_actions(self, state):
        return [] # filler 
    
    def __get_agg_N_val(self, state):
        if state in self.__agg_N_vals:
            return self.__agg_N_vals[state]
        else:
            return -1 # calculate it (filler for now)
            # and then put it inside of the agg_N_vals dictionary 
    
    def __next_state(self, state, action):
        x, y, token = action 
        state[x, y] = token 
        return state


    def search(self, s, policy_head_net):
        if self.__game_ended(s): return self.__game_reward(s)

        if s not in self.__visited:
            self.__visited.add(s)
            predicted_probs, v = policy_head_net.predict(s)

            for prob in predicted_probs:
                print("fill in the approrpriate data structure")
            return -v
    
        max_u, best_a = -float("inf"), -1
        for a in self.__get_valid_actions(s): # for every possible action I can take from this state 
            u = self.__Q_val(s, a) + self.__c_puct * self.__prior_prob(s, a)* ( \
                 self.__get_agg_N_val(s))/(1+self.__N_val(s, a)) ** 0.5 # calculate the upper confidence bound score
            if u > max_u:
                max_u = u
                best_a = a
        
        sp = self.__next_state(s, best_a)
        v = self.search(sp, policy_head_net)

        self.__Q_vals[(s, a)] = (self.__N_vals[(s, a)]*self.__Q_vals[(s, a)] + v) \
            / (self.__N_vals[(s, a)]+1)

        self.__N_vals[(s, a)] += 1
        return -v

    # Python does not support method overwriting it seems, so instead of 
    # defining N(s) and N(s, a) methods separately, I will just define one method
    # with s, a as parameters. 