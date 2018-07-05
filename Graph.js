 var fs = require('fs')
 var dijkstra = require('./algorithm').dijkstra;

class VertNode {
    constructor(name) {
        this.name = name
        this.firstEdge = null
    }

    traversalDestination(callback){
        var cur = this.firstEdge
        var before = null
        while(cur){
            let result
            if(result = callback(cur, before))
                return result
            before = cur
            cur = cur.next
        }
    }

    deleteDestination(vertName){
        this.traversalDestination((cur, before)=>{
            if(cur.name == vertName){
                if(before == null)
                    vertNode.firstEdge = cur.next
                else
                    before.next = cur.next
            }
        })
    }
}

class EdgeNode {
    constructor(name, length) {
        this.name = name
        this.length = length
        this.next = null
    }
}

class Graph {
    constructor(fileName) {
        this.verts = []
        var data = fs.readFileSync(fileName)
        this.initGraph(data.toString())
    }

    findVert(vertName){
        for(var item of this.verts)
            if(item.name == vertName) 
                return item    
        return null       
    }

    findPath(from, to, Floyd){
        var result
        if(Floyd)
            ;
        else
            result = dijkstra(this, from)
        for(let item of result){
            if(item.name == to){
                item.path.unshift(from)
                item.path.push(to)
                return {
                    distance: item.distance,
                    path: item.path    
                }
            }
        }
    }

    addVert(vertName, firstEdgeName, length){
        var vert = new VertNode(vertName)
        vert.firstEdge = new EdgeNode(firstEdgeName, length)
        this.verts.push(vert)
    }

    addAloneVert(vertName){
        this.verts.push(new VertNode(vertName))
    }

    deleteVert(vertName){
        var index = this.verts.findIndex(ele => {
            return ele.name==vertName
        })
        if(index != -1){
            this.verts.splice(index, 1)
            this.verts.forEach(vertNode =>
                vertNode.deleteDistination(vertName)
            )
        }   
        return false
    }

    initGraph(str){
        var arr = str.split('\n')
        for(var item of arr){
            var site = item.split(' ')
            var vertName = site[0]
            var edgeName = site[1]
            var edgeLength = parseInt(site[2])
            this.addEdgeOrNewVert(vertName, edgeName, edgeLength)
            this.addEdgeOrNewVert(edgeName, vertName, edgeLength)
        }
    }

    addEdgeOrNewVert(vertName, edgeName, edgeLength){
        console.log(vertName, edgeName, edgeLength)
        var foundVert = this.findVert(vertName)
        if(foundVert){
            if(!foundVert.firstEdge){
                foundVert.firstEdge = new EdgeNode(edgeName, edgeLength)
            }
            var curEdge = foundVert.firstEdge
            while(curEdge.next){
                curEdge = curEdge.next
            }
            curEdge.next = new EdgeNode(edgeName, edgeLength)
        }else{
            this.addVert(vertName, edgeName, edgeLength)
        }
    }

    delEdge(from, to){
        var foundVert = this.findVert(from)
        foundVert.deleteDistination(to)
        foundVert = this.findVert(to)
        foundVert.deleteDistination(from)
    }

    getDistance(from, to){
        var vertNode = this.findVert(from)
        if(!vertNode) return null
        if(from == to) return 0
        let result = vertNode.traversalDestination(node => {
            if(node.name == to)
                return node.length
        })
        if(result) return result
        return 32767
    }

    paddingAfterSite(str){
        if(str.length == 2)
            str +=  '  '
        return str
    }

    paddingBeforeNum(num){
        var numStr = num + ''
        var spaces = '  '
        for(var i = 0; i < 5 - numStr.length; i++)
            spaces += ' '
        numStr = spaces + numStr
        return numStr
    }

    print(){
        var line = '        '
        for(var item of this.verts){
            line += this.paddingAfterSite(item.name) + ' '
        }
        console.log(line)
        for(var from of this.verts){
            line = this.paddingAfterSite(from.name)
            for(var to of this.verts){
                var distance  = this.getDistance(from.name, to.name)
                line += this.paddingBeforeNum(distance)
            }
            console.log(line)
        }
    }

    printTable(){
        var table = {}
        for(var from of this.verts){
            table[from.name] = {}
            for(var to of this.verts){
                var distance  = this.getDistance(from.name, to.name)
                table[from.name][to.name] = distance
            }
        }
        console.table(table)
    }
}

var graph = new Graph('./data.dat')

module.exports = graph