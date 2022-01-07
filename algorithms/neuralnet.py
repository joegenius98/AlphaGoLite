from tensorflow.keras import Input, Model
from keras.layers import Input, Add, Dense, Activation, ZeroPadding2D, BatchNormalization, Flatten, Conv2D, AveragePooling2D, MaxPooling2D, GlobalMaxPooling2D
from keras.initializers import glorot_uniform
import numpy as np
from keras.optimizers import *
import random

def residual_layer(X, filter_size):
    
    # Save the input value. You'll need this later to add back to the main path.
    X_skip_connection = X

    # First component
    X = Conv2D(filters=256, kernel_size=filter_size, strides=(1, 1),  kernel_initializer=glorot_uniform(seed=0))(X)
    X = BatchNormalization(axis=3)(X)
    X = Activation('relu')(X)

     # Second component of main path same as first
    X = Conv2D(filters=256, kernel_size=filter_size, strides=(1, 1),  kernel_initializer=glorot_uniform(seed=0))(X)
    X = BatchNormalization(axis=3)(X)
    X = Activation('relu')(X)

    X_skip_connection = Conv2D(filters=256, kernel_size=filter_size, strides=(1, 1),  kernel_initializer=glorot_uniform(seed=0))(X_skip_connection)
    X_skip_connection = Conv2D(filters=256, kernel_size=filter_size, strides=(1, 1),  kernel_initializer=glorot_uniform(seed=0))(X_skip_connection)
    # Final step: Add skip_connection value to main path, and pass it through a RELU activation
    X = Add()([X, X_skip_connection])
    X = Activation('relu')(X)
    
    return X


def convolutional_layer(X):
    # First component
    X = Conv2D(filters=256, kernel_size=(1, 1), strides=(1, 1),  kernel_initializer=glorot_uniform(seed=0))(X)
    X = BatchNormalization(axis=3)(X)
    X = Activation('relu')(X)
    return X

def value_head(X):
    X = Conv2D(filters=1, kernel_size=(1,1), strides=(1, 1),  kernel_initializer=glorot_uniform(seed=0))(X)
    X = BatchNormalization(axis=3)(X)
    X = Activation('relu')(X)
    X = Dense(256)(X)
    X = Activation('relu')(X)
    X = Dense(1)(X)
    X = Activation('tanh')(X)
    return X

def policy_head(X):
    X = Conv2D(filters=1, kernel_size=(1, 1), strides=(1, 1),  kernel_initializer=glorot_uniform(seed=0))(X)
    X = Conv2D(filters=1, kernel_size=(1, 1), strides=(1, 1),  kernel_initializer=glorot_uniform(seed=0))(X)
    X = BatchNormalization(axis=3)(X)
    X = Activation('relu')(X)
    
    #19x19+1 -> all possible moves + pass
    X = Dense(362)(X)
    return X


def AlphaGoLite_Network():
  inputs = Input(shape=(19,19,17))
  # 1 convolutional layer
  X = convolutional_layer(inputs)
  
  # 5 residual layers instead of 40 
    
  X=residual_layer(X, (3,3))
  X=residual_layer(X, (3,3))
  X=residual_layer(X, (3,3))
  X=residual_layer(X, (3,3))
  X=residual_layer(X, (2,2))
  #value head
  value_head_output = value_head(X)

  #policy head
  policy_head_output = policy_head(X)

  X = Model(inputs=inputs, outputs=[value_head_output, policy_head_output])
  
  return X

#tester code with fake input
if __name__ =="__main__":
    nn= AlphaGo_Zero_Network()
    rsmprop = RMSprop(clipvalue=0.5)
    nn.compile(loss=['binary_crossentropy', 'categorical_crossentropy'], optimizer='rmsprop')
    x=[[[[random.choice([1,0]) for x in range(17)] for j in range(19)] for k in range(19)] for t in range(20)]
    x = np.array(x, dtype="float32")
    y=[[random.choice([1,0])] for x in range(20)]
    y = np.array(y, dtype="float32")
    z=[[[[random.choice([1,0]) for i in range(362)]]] for x in range(20)]
    z = np.array(z, dtype="float32")
    # model.predict(x)
    history = nn.fit(x, [y, z], epochs=1, batch_size=1)