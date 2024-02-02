class DartBoard{
    constructor(ctx, regionSize){
        this.ctx = ctx
        this.regionSize = regionSize
        this.numbers = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5]
    }

    degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    radiansToDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    drawBoard(){
        for(let i=0; i<20; i++){
            this.drawSlice(this.numbers[i], i)
        }
        this.drawBullsEye()
    }

    isDouble(x, y){
        let distance = Math.sqrt(x ** 2 + y ** 2)
        return (25 >= distance || 280 >= distance && 250 < distance)
    }

    boardHit(x, y){
        let distance = Math.sqrt(x ** 2 + y ** 2)
        let multiplier = 0
        let number = 0
        if(50 >= distance && distance > 25){
         //   console.log("Hit: " + 25 )
            return 25
        }
        if(25 >= distance){
          //  console.log("Hit: " + 50 )
            return 50
        }

        if(280 >= distance && 250 < distance){
            multiplier = 2
        }

        if(250>= distance && 200 < distance){
            multiplier = 1
        }

        if(200>= distance && 170 < distance){
            multiplier = 3
        }

        if(170>= distance && 50 < distance){
            multiplier = 1
        }
        let offSetDegree = this.degree(x, distance)
        number = this.getNumber(offSetDegree, y)
        return number * multiplier
      //  console.log("Hit: " + number + " Multi: " + multiplier + " Total: " + (number * multiplier))
        

    }

    getNumber(degree, y){
        if(y > 0){
            if(-90 <= degree && degree <= -81){
                return 11
            }
            if(-81 <= degree && degree <= -63){
                return 14
            }
            if(-63 <= degree && degree <= -45){
                return 9
            }
            
            if(-45 <= degree && degree <= -27){
                return 12
            }
            if(-27 <= degree && degree <= -9){
                return 5
            }
            if(-9 <= degree && degree <= 9){
                return 20
            }
            if(9 <= degree && degree <= 27){
                return 1
            }
            if(27 <= degree && degree <= 45){
                return 18
            }
            if(45 <= degree && degree <= 63){
                return 4
            }
            if(63 <= degree && degree <= 81){
                return 13
            }
            if(81 <= degree && degree <= 90){
                return 6
            }
        }
        else{
            if(-90 <= degree && degree <= -81){
                return 11
            }
            if(-81 <= degree && degree <= -63){
                return 8
            }
            if(-63 <= degree && degree <= -45){
                return 16
            }
            
            if(-45 <= degree && degree <= -27){
                return 7
            }
            if(-27 <= degree && degree <= -9){
                return 19
            }
            if(-9 <= degree && degree <= 9){
                return 3
            }
            if(9 <= degree && degree <= 27){
                return 17
            }
            if(27 <= degree && degree <= 45){
                return 2
            }
            if(45 <= degree && degree <= 63){
                return 15
            }
            if(63 <= degree && degree <= 81){
                return 10
            }
            if(81 <= degree && degree <= 90){
                return 6
            }
        }
    }

    degree(x, distance){
        let sinX = x / distance
        let rad = Math.asin(sinX)
        return this.radiansToDegrees(rad)

    }

    /*
    20 is first segment, 1 second and so on.
    */
    drawSlice(sliceNumber, segment){
        let colorSingle = segment % 2 == 0 ? 'black' : 'white'
        let colorMultiple = segment % 2 == 0 ? 'red' : 'green'

        this.drawDoubles(colorMultiple, segment)
        this.drawUpperSingle(colorSingle, segment)
        this.drawTriple(colorMultiple, segment)
        this.drawLowerSingle(colorSingle, segment)
        this.drawNumber(sliceNumber, segment)

    }

    drawNumber(number, segment){
        this.ctx.fillStyle = 'black'
        ctx.font = '20px Arial'
        let position = new Vector(280, 40)
        position.rotate(-101)
        position.rotate(segment * 18.2)
        this.ctx.fillText(number,position.x + 290, position.y + 300)
    }

    drawDoubles(color, segment){
        this.ctx.strokeStyle = color
        this.ctx.beginPath()
        this.ctx.arc(300, 300, 280, this.degreesToRadians(261 + 18 * segment), this.degreesToRadians(279 + 18 * segment))
        this.ctx.arc(300, 300, 250, this.degreesToRadians(279 + 18 * segment), this.degreesToRadians(261 + 18 * segment), 1)
        this.ctx.closePath()
        this.ctx.stroke()
        this.ctx.fillStyle = color
        this.ctx.fill()
    }


    drawUpperSingle(color, segment){
        this.ctx.strokeStyle = color
        this.ctx.beginPath()
        this.ctx.arc(300, 300, 250, this.degreesToRadians(261 + 18 * segment), this.degreesToRadians(279 + 18 * segment))
        this.ctx.arc(300, 300, 200, this.degreesToRadians(279 + 18 * segment), this.degreesToRadians(261 + 18 * segment), 1)
        this.ctx.closePath()
        this.ctx.stroke()
        this.ctx.fillStyle = color
        this.ctx.fill()
    }


    drawTriple(color, segment){
        this.ctx.strokeStyle = color
        this.ctx.beginPath()
        this.ctx.arc(300, 300, 200, this.degreesToRadians(261 + 18 * segment), this.degreesToRadians(279 + 18 * segment))
        this.ctx.arc(300, 300, 170, this.degreesToRadians(279 + 18 * segment), this.degreesToRadians(261 + 18 * segment), 1)
        this.ctx.closePath()
        this.ctx.stroke()
        this.ctx.fillStyle = color
        this.ctx.fill()
    }

    drawLowerSingle(color, segment){
        this.ctx.strokeStyle = color
        this.ctx.beginPath()
        this.ctx.arc(300, 300, 170, this.degreesToRadians(261 + 18 * segment), this.degreesToRadians(279 + 18 * segment))
        this.ctx.arc(300, 300, 50, this.degreesToRadians(279 + 18 * segment), this.degreesToRadians(261 + 18 * segment), 1)
        this.ctx.closePath()
        this.ctx.stroke()
        this.ctx.fillStyle = color
        this.ctx.fill()
    }


    drawBullsEye(){
        this.ctx.fillStyle = 'red'
        this.ctx.beginPath()
        this.ctx.ellipse(300, 300,50, 50, 0, 0, 2 * Math.PI)
        this.ctx.fill()

        this.ctx.fillStyle = 'green'
        this.ctx.beginPath()
        this.ctx.ellipse(300, 300, 25, 25, 0, 0, 2 * Math.PI)
        this.ctx.fill()
    }


}