/**
 * Sprite class modified from Fabric.js examples to support 2d grid of sprite objects.
 * When exporting from Adobe Animate, turn off trimming, and if needed, add a transparent object
 * inside the object that is larger than the full bounds of the sprite through the whole animation
 * sequence (otherwise, animate will change the size of each frame).
 *
 * Example Usage:
   fabric.Sprite.fromURL('img/sprite_sheet.png', function(sprite) {
		this.anim_canvas.add(sprite);
		sprite.set({
			dirty: true
		});
		sprite.play(this.anim_canvas);
	}.bind(this), {
		width: 25,     // Width of each sprite image
		height: 75,    // Height of each sprite image
		left: 10,      // Left position of new sprite object
		top: 10,       // Top position on canvas of new sprite object
		cols: 1,       // Total number of columns in the sprite sheet
		frames: 2,     // Total number of frames in the sprite sheet (last row may be partial)
		frameTime: 100 // Time(ms) per frame in sprite.
	});
 */

fabric.Sprite = fabric.util.createClass(fabric.Image, {

  type: 'sprite',

  spriteIndex: 0,

  initialize: function(element, options = {}) {
    var defaults = {
      width: 50,
      height: 72,
      cols: 10,
      frames: 10,
      frameTime: 100,
      startIndex: 0
    };
    options = Object.assign({}, defaults, options);
      
    this.spriteWidth = options.width;
    this.spriteHeight = options.height;
    this.frameTime = options.frameTime;
    this.cols = options.cols;
    this.frames = options.frames;
    this.startIndex = options.startIndex;

    this.callSuper('initialize', element, options);

    this.createTmpCanvas();
    this.createSpriteImages();
  },

  createTmpCanvas: function() {
    this.tmpCanvasEl = fabric.util.createCanvasElement();
    this.tmpCanvasEl.width = this.spriteWidth || this.width;
    this.tmpCanvasEl.height = this.spriteHeight || this.height;
  },

  createSpriteImages: function() {
    this.spriteImages = [ ];

    //var steps = this._element.width / this.spriteWidth;
    for (var i = 0; i < this.frames; i++) {
      this.createSpriteImage(i);
    }
  },

  createSpriteImage: function(i) {
    x = i % this.cols;
    y = Math.floor(i / this.cols);
    
    var tmpCtx = this.tmpCanvasEl.getContext('2d');
    tmpCtx.clearRect(0, 0, this.tmpCanvasEl.width, this.tmpCanvasEl.height);
    tmpCtx.drawImage(this._element, -x * this.spriteWidth, -y * this.spriteHeight);

    var dataURL = this.tmpCanvasEl.toDataURL('image/png');
    var tmpImg = fabric.util.createImage();

    tmpImg.src = dataURL;

    this.spriteImages.push(tmpImg);
  },

  _render: function(ctx) {
    ctx.drawImage(
      this.spriteImages[this.spriteIndex],
      -this.width / 2,
      -this.height / 2
    );
  },

  play: function(canvas) {
    var _this = this;
    _this.spriteIndex = _this.startIndex;
    this.animInterval = setInterval(function() {
      _this.onPlay && _this.onPlay();
      _this.dirty = true;
      _this.spriteIndex++;
      if (_this.spriteIndex === _this.spriteImages.length) {
        _this.spriteIndex = 0;
      }
      canvas.requestRenderAll();
    }, this.frameTime);
  },

  stop: function() {
    clearInterval(this.animInterval);
  }
});

fabric.Sprite.fromURL = function(url, callback, imgOptions) {
  fabric.util.loadImage(url, function(img) {
    callback(new fabric.Sprite(img, imgOptions));
  });
};

fabric.Sprite.async = true;
