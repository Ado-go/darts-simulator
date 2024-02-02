class Player{
    constructor(name, points, legs, sets, bot){
        this.name = name
        this.points = points
        this.pointsTurnStart = points
        this.legs = legs
        this.sets = sets
        this.darts = 3
        this.totalDartsThrown = 0
        this.turnThrow = []
        this.throws = []
        this.bot = bot
        this.finishDarts = 0
        this.finishSuccess = 0
    }

    getAverage(){
        if(this.throws.length == 0){
            return 0
        }

        let total = 0
        for(let i=0; i<this.throws.length; i++){
            total += this.throws[i]
        }
        return (total / this.throws.length).toFixed(2)
    }

    getFinishAverage(){
        if(this.finishDarts == 0){
            return 0.00
        }
        return ((this.finishSuccess / this.finishDarts) * 100).toFixed(2)
    }

    pointsReset(){
        this.points = this.pointsTurnStart
    }

    getName(){
        return this.name
    }

    getPoints(){
        return this.points
    }

    getLegs(){
        return this.legs
    }

    getSets(){
        return this.sets
    }

    getDarts(){
        return this.darts
    }

    getThrows(){
        return this.throws
    }
}