

const controller = (e, bird) => {
    switch (e.key) {
        case 's' || 'enter':
            jump(bird);
            break

        default:
    }
}

const jump = (bird) => {
    if (!(bird.y < 50)) {
        bird.lift = 11;
    }
}


module.exports = {
    controller
}