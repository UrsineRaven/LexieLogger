class Event {
  constructor(id, date, time, type) {
    this.id = id,
    this.date = date,
    this.time = time
    this.type = type
  }
}

module.exports = {
  Event: Event
};
