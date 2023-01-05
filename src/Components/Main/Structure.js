export default class Structure {
    constructor() {
        this.velocity = 5;
        this.x = 1300;
        this.top = Math.round(Math.random());
        this.height = Math.round(Math.random()) * (250 - 100) + 150

        this.style = {
            position: "absolute",
            width: `100px`,
            height: `${this.height}px`,
            "backgroundColor": "greenyellow",
            left: this.x,
            overflow: 'hidden',
            borderRadius: '10px'
        }


        !this.top && (this.style['bottom'] = '0');

    }
}