
function main () {
    return polyhedron({
      points: [ 
          [0,8,0],
          [4,0,0],
          [0,-8,0],
          [-4,0,0],
          [0,0,4]
        ],
      triangles: [
          [0,1,4],
          [1,2,4],
          [2,3,4],
          [3,0,4],
          [1,0,3],
          [2,1,3]
        ]
    });
}
  