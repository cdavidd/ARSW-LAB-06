apimock = (function() {
  let mockdata = [];

  mockdata["author1"] = [
    {
      author: "author1",
      points: [
        { x: 100, y: 150 },
        { x: 300, y: 0 },
        { x: 200, y: 40 },
        { x: 70, y: 80 }
      ],
      name: "blueprint1"
    },
    {
      author: "author1",
      points: [
        { x: 100, y: 120 },
        { x: 50, y: 300 },
        { x: 70, y: 100 },
        { x: 80, y: 110 },
        { x: 100, y: 120 }
      ],
      name: "blueprint2"
    }
  ];
  mockdata["author2"] = [
    {
      author: "author2",
      points: [
        { x: 200, y: 200 },
        { x: 400, y: 200 },
        { x: 300, y: 100 },
        { x: 200, y: 200 },
        { x: 200, y: 400 },
        { x: 400, y: 400 },
        { x: 400, y: 200 }
      ],
      name: "casa"
    }
  ];

  return {
    getBlueprintsByAuthor: function(name, callback) {
       callback(mockdata[name]);
    },
    getBlueprintsByNameAndAuthor: function(author, name, callback) {
       callback(
        mockdata[author].filter(obj => {
          return obj.name === name;
        })[0]
      );
    }
  };
})();
