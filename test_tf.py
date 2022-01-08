import tensorflow as tf
import time

start = time.time()

# This code is from: https://www.tensorflow.org/tutorials/quickstart/beginner

print(tf.add(1, 2).numpy())
print(tf.constant("Hello, World!").numpy())

# get and load the data
mnist = tf.keras.datasets.mnist
(x_train, y_train), (x_test, y_test) = mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0


# build the model
model = tf.keras.models.Sequential([
    tf.keras.layers.Flatten(input_shape=(28, 28)),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(10)
])

# get the predictions and print them
predictions = model(x_train[:1]).numpy()
print(f'Predictions: {tf.nn.softmax(predictions).numpy()}')

'''
Note: It is possible to bake this tf.nn.softmax in as the activation function for the last layer of the network. 
While this can make the model output more directly interpretable, this approach is discouraged as it's impossible to 
provide an exact and numerically stable loss calculation for all models when using a softmax output.
'''

'''
The losses.SparseCategoricalCrossentropy loss takes a vector of logits and a True index and 
returns a scalar loss for each example.
'''
loss_fn = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)

'''
This loss is equal to the negative log probability of the true class: It is zero if the model is sure of the correct class.
This untrained model gives probabilities close to random (1/10 for each class), so the initial loss 
should be close to -tf.log(1/10) ~= 2.3.
'''

print(f'initial loss: {loss_fn(y_train[:1], predictions).numpy()}')

# Set up the Adam optimizer, loss function, and metrics into the model itself

model.compile(optimizer='adam', loss=loss_fn, metrics=['accuracy'])

# Now, the training part, finally.
model.fit(x_train, y_train, epochs=10)

print('\n')
# The Model.evaluate method checks the models performance, usually on a "Validation-set" or "Test-set".
model.evaluate(x_test,  y_test, verbose=2)

'''
The image classifier is now trained to ~98% accuracy on this dataset. To learn more, read the TensorFlow tutorials.

If you want your model to return a probability, you can wrap the trained model, and attach the softmax to it:
'''
probability_model = tf.keras.Sequential([
    model,
    tf.keras.layers.Softmax()
])

results = probability_model(x_test[:5])
print(
    f'Probability model results: {results}, type: {type(results)}\n')


results = results.numpy()
print(f"As NumPy: {results}, type: {type(results)}\n")

# print out the duration of this program
print(f'The duration of this program is: {time.time() - start} seconds.')
