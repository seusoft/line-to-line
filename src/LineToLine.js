import readline from 'readline';
import { EventEmitter } from 'events';
import Stream from 'stream';

export class LineToLine extends EventEmitter {
  constructor(stream) {
    super();
    if(!stream) {  throw new Error('Constructor parameter is mandatory'); }
    if(!(stream instanceof Stream.Readable)) { throw new Error('Constructor parameter must be a stream'); }
    this._input = stream;
    this._initialize();
  }

  _initialize() {
    this._lineCount = 0;
    this._byteCount = 0;

    let rl = this._createReadline();

    rl.on('open',  fd   => this._open(fd));
    rl.on('line',  line => this._line(line));
    rl.on('error', err  => this._error(err));
    rl.on('close', ()   => this._close());
  }

  _createReadline() {
    return readline.createInterface({
        input: this._input,
        terminal: false
    });
  }

  _open(fd) {
    this.emit('open', fd);
  }

  _line(line) {
    this._byteCount += line.length;
    this.emit('line', line, this._lineCount, this._byteCount);
    this._lineCount++;
  }

  _error(err) {
    this.emit('error', err);
  }

  _close() {
    this.emit('close');
  }
}
