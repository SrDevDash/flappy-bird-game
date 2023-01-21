import ml5 from 'ml5';
import data from './../../IA/Data.json'

const options = {
    task: 'classification',
    debug: true
}

// Step 3: initialize your neural network
const nn = ml5.neuralNetwork(options);

// Step 4: add data to the neural network
data.forEach(item => {
    const inputs = {
        birdHeight: item.input.birdHeight,
        obstacleHeight: item.input.obstacleHeight,
        floorDistance: item.input.floorDistance,
        obstaclebot: item.input.obstaclebot,
        distance: item.input.distance
    };
    const output = {
        action: item.output
    };

    nn.addData(inputs, output);
});

// Step 5: normalize your data;
nn.normalizeData();
// Step 6: train your neural network
const trainingOptions = {
    epochs: 32,
    batchSize: 12
}
nn.train(trainingOptions, finishedTraining);

// Step 7: use the trained model
function finishedTraining() {
    console.log('IA READY TO BURN')
    classify({
        birdHeight: 10,
        obstacleHeight: 200,
        floorDistance: 670,
        obstaclebot: 1,
        distance: 110
    });
}

// Step 8: make a classification
export default function classify(input) {
    return nn.classify(input, handleResults);
}

// Step 9: define a function to handle the results of your classification
function handleResults(error, result) {
    if (error) {
        console.error('IA ERROR ', error);
        return;
    }
    // console.log(result); // {label: 'red', confidence: 0.8};
    return result;
}

