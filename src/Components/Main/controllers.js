

const controller = (e, bird, dataToLearn, input) => {
    switch (e.key) {
        case 'w' || 'enter':
            dataToLearn.push({ input, output: "Jump" });
            jump(bird);
            break
        case 's':
            dataToLearn.push({ input, output: "Down" });
            downFast(bird);
            break

        default:
    }
}

const jump = (bird) => {
    console.log('jump');

    if (!(bird.y < 50)) {
        bird.lift = 11;
    }
}

const downFast = (bird) => {
    console.log('down')
    bird.velocity += 1;
}


module.exports = {
    controller
}