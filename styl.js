/**
 * Module dependencies.
 */

var rework = require('rework');
var mixin = require('rework-plugin-mixin');
var mixins = mixin(require('rework-mixins'));
var variant = require('rework-variant');
var imprt = require('rework-import');
var whitespace = require('css-whitespace');

// Load plugins.
var plugins = [
  'rework-plugin-ease',
  'rework-plugin-colors',
  'rework-plugin-references',
  'rework-plugin-at2x',
  'rework-inherit',
  'rework-shade'
].map(require);

function call(plugin) {
  return plugin();
}

/**
 * Expose `Style`.
 */

module.exports = Style;

/**
 * Initialize a new Style with the given css `str`.
 *
 * Options:
 *
 *  - `whitespace` utilize css whitespace transformations
 *  - `compress` enable output compression
 *
 * @param {String} str
 * @param {Object} options
 * @api public
 */

function Style(str, options) {
  if (!(this instanceof Style)) return new Style(str, options);
  options = options || {};
  if (options.whitespace) str = whitespace(str);
  this.path = options.path || '.';
  this.str = str;
  this.compress = options.compress;
  this.rework = rework(str);
}

/**
 * Return the compiled CSS.
 *
 * @return {String}
 * @api public
 */

Style.prototype.toPromise = function(fn, err){
  var self = this;
  var rew = self.rework;
  return rew
    .then(imprt({path: self.path, transform: whitespace}))
    .then(function() {
      rew.use(variant());
      rew.use(mixins);
      // plugins.map(call).forEach(rew.use);
      return rew.toString({ compress: self.compress });
    })
    .then(fn, err);
};
