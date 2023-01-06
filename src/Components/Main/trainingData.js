const trainingData = [
    {
        input: { velocity: 0.1, birdHeight: 80, obstacleHeight: 150, floorDistance: 80, obstaclebot: true, distance: 110 },
        output: { jump: 1 },
    },
    {
        input: { velocity: 0.1, birdHeight: 300, obstacleHeight: 300, floorDistance: 300, obstaclebot: true, distance: 130 },
        output: { jump: 1 },
    },
    {
        input: { velocity: 0.1, birdHeight: 30, obstacleHeight: 250, obstaclebot: false, floorDistance: 670, distance: 250 },
        output: { down: 1 },
    },
    {
        input: { velocity: 0.1, birdHeight: 190, obstacleHeight: 200, floorDistance: 670, obstaclebot: false, distance: 110 },
        output: { down: 1 },
    },

];

const changeData = (data) => {
    console.log('function', data[0].output)
    let limt = data.length > 100 ? 40 : 10;
    for (let i = data.length - limt; i < data.length; i++) {
        console.log(i);
        if (data[i].output.down) {
            data[i].output.down = 0;
            data[i].output.jump = 1;
        }
        else if (data[i].output.jump) {
            data[i].output.jump = 0;
            data[i].output.down = 1;
        }

    }
    return data;
}

module.exports = {
    trainingData,
    changeData
}