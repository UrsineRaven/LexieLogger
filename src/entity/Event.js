const EntitySchema = require("typeorm").EntitySchema;
const Event = require("../model/Event").Event;

module.exports = new EntitySchema({
  name: "Event",
  target: Event,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    date: {
      type: "varchar",
      length: 10
    },
    time: {
      type: "varchar",
      length: 8
    }
  },
  relations: {
    type: {
      target: "EventType",
      type: "many-to-one",
      eager: true
    }
  }
});
