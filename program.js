export function processProgramData(data1) {
    const programs = [];
    for (let i = 1; i < data1.length; i++) {
      const programData = {
        "key": data1[i][0],
        "title": data1[i][1],
      "thumbnails": [
        {
          "url": data1[i][4],
          "type": "image/jpg",
          "width": 1920,
          "height": 1080,
          "ratio": "16_9"
        }
      ],
      "content_type": "episode",
      "series": {
        "title": data1[i][1],
        "description": data1[i][3],
        "thumbnails": [
          {
            "url": data1[i][4],
            "type": "url",
            "width": 1920,
            "height": 1080,
            "ratio": "16_9"
          }
        ],
        "season": {
          "title": data1[i][5],
          "number": parseInt(data1[i][6]),
          "episode_number": parseInt(data1[i][7])
        }
      },
      "rating": [
        {
          "source": "Program Rating",
          "value":  data1[i][2]
        }
      ],
      "description": data1[i][3]
    };
      programs.push(programData);
    }
    return programs;
  }
  
