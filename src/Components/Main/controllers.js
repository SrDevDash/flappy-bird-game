

const controller = (e, bird) => {
    switch (e.key) {
        case 'w' || 'enter':
            jump(bird);
            break
        case 's':
            downFast(bird);
            break

        default:
    }
}

const jump = (bird) => {
    if (!(bird.y < 50)) {
        bird.lift = 11;
    }
}

const downFast = (bird) => {
    bird.velocity += 1;
}


module.exports = {
    controller
}