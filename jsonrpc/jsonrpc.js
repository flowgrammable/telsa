var _   = require('underscore');

function State() {
  // Collecdtion of well formed chunks
  this.chunks = [];

  // Current chunk buffer and position
  this.chunk = '';
  this.pos   = 0;

  // Current nesting level
  this.level = 0;
}

State.prototype.read = function(data) {
  // Append the latest data to the chunk buffer
  this.chunk += data.toString('utf8');

  while(this.pos < this.chunk.length) {
    if(this.chunk[this.pos] === '{') {
      this.level++;
    } else if(this.chunk[this.pos] === '}') {
      if(this.level > 0) {
        this.level--;
      } else {
        throw 'Bad Stream';
      }
      if(this.level === 0) {
        this.chunks.push(this.chunk.substring(0, this.pos+1).trim());
        this.chunk = this.chunk.slice(this.pos+1);
        this.pos = -1;
      }
    }
    this.pos++;
  }
  return _(this.chunks).map(function(chunk) {
    return JSON.parse(chunk);
  });
};

State.prototype.print = function() {
  console.log('level: '+this.level);
  console.log(this.chunks);
};

exports.State = State;

