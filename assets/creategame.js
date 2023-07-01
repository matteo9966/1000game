const fs = require('fs');
const goals = {
  age: [
    ['birth', 20],
    ['10 years', 10],
    ['18 years', 20],
    ['20 years', 10],
    ['30 years', 10],
    ['40 years', 10],
    ['50 years', 20],
    ['55 years', 5], //till 110
    ['60 years', 5], //till 110
    ['65 years', 5], //till 110
    ['70 years', 5], //till 110
    ['75 years', 5], //till 110
    ['80 years', 5], //till 110
    ['85 years', 5], //till 110
    ['90 years', 5], //till 110
    ['95 years', 5], //till 110
    ['100 years', 5], //till 110
    ['105 years', 5], //till 110
    ['110 years', 5], //till 110
  ],
  grouth: [
    ['first comunion', 10],
    ['confirmation', 10],
    ['diploma', 20],
    ["bachelor's degree", 30],
    ["master's degree", 40],
    ['stable job contract', 50],
  ],
  relations: [
    ['first kiss', 10],
    ['first entercourse', 20],
    ['first girlfriend', 30],
    ['first marriage', 100],
    ['first child', 50],
    ['second or morechildren', 30],
    ['devorce', 20],
  ],
  materialistic: [
    ['first car', 20],
    ['first house', 30],
    ['first pet', 10],
    ['first trip in italy', 10],
    ['first trip in europe', 30],
    ['first trip outside of europe', 50],
  ],
  misc: [
    ['play a soccer game'],
    ['play a basket game'],
    ['play a volley game'],
    ['play a padel game'],
    ['100kg bench press'],
    ['rissa?'],
    ['threesome'],
    ['homosexual exprience'],
    ['entercourse with older woman'],
    ['hangover'],
    ['doping/trt'],
    ['first time in an hospital'],
    ['first visit by a psychologist'],
    ['buy crypto'],
    ['10k in a bank account'],
    ['20k in a bank account'],
    ['30k in a bank account'],
    ['40k in a bank account'],
    ['50k in a bank account'],
    ['car crash'],
    ['first tattoo'],
    ['finished reading One piece'],
    ['finished playing Sekiro'],
    ['dive from more then five 5meters'],
    ['first time at the stadium'],
    ['esperienza fuorisede'],
    ['first cigarette'],
    ['first joint'],
    ['first psychedelic'],
    ['heavy drug'],
    ['firt time to a prostitute'],
    ['getting a fine'],
    ['denuncia'],
    ['first time in prison'],
    ['played videogames for more than 10 hours straight'],
    ['finished watching a complete TV series'],
    ['first time at a concert'],
    ['learned to play an hinstrument'],
  ],
};

function createGame() {
  let goalList = [];
  for (let key in goals) {
    const entries = goals[key];
    for (let entry of entries) {
      const game = {
        name: entry[0],
        description: '',
        id: Math.random().toString(16).slice(2),
        points: entry[1] ? entry[1] : 2,
        categories: [key],
      };
      goalList.push(game);
    }
  }
  return goalList;
}

const data = JSON.stringify(createGame())
fs.writeFileSync('./goals.json',data);
// console.log(JSON.stringify(createGame()))