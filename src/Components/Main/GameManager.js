import Structure from "./Structure";

export default class GameManager {
    constructor() {
        this.life = 1;
        this.structures = [];
        this.velocity = 5;
    }


    spawnStructure() {
        const structure = new Structure();

        this.structures.push(structure);
    }

    clearStructure() {
        this.structures = this.structures.filter(structure => !(structure.x < 0))
    }

    clearAllStructure() {
        this.structures = [];
    }
}