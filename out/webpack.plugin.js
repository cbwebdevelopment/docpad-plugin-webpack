// Generated by CoffeeScript 1.8.0
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = function(BasePlugin) {
    var WebpackPlugin;
    return WebpackPlugin = (function(_super) {
      __extends(WebpackPlugin, _super);

      function WebpackPlugin() {
        return WebpackPlugin.__super__.constructor.apply(this, arguments);
      }

      WebpackPlugin.prototype.name = 'webpack';

      WebpackPlugin.prototype.config = {
        optimize: {
          minimize: false
        },
        verbose: false
      };

      WebpackPlugin.prototype.writeAfter = function(opts, next) {
        var TaskGroup, config, docpad, fs, path, tasks, webpack;
        webpack = require('webpack');
        TaskGroup = require('taskgroup').TaskGroup;
        path = require('path');
        fs = require('fs');
        config = this.getConfig();
        docpad = this.docpad;
        tasks = new TaskGroup({
          concurrency: 0,
          next: next
        });
        opts.collection.findAll({
          webpack: {
            $exists: true
          }
        }).each(function(file) {
          if (file.get('webpack') === false) {
            return;
          }
          return tasks.addTask(function(complete) {
            var compiler, key, value, webpackOpts;
            webpackOpts = file.get('webpack');
            if (typeof webpackOpts === 'boolean') {
              webpackOpts = {};
            }
            webpackOpts.entry = './' + file.get('relativeOutPath');
            webpackOpts.context = file.get('outDirPath');
            webpackOpts.output = {
              path: file.get('outDirPath'),
              filename: file.get('relativeOutPath')
            };
            for (key in config) {
              if (!__hasProp.call(config, key)) continue;
              value = config[key];
              if (webpackOpts[key] == null) {
                webpackOpts[key] = value;
              }
            }
            compiler = webpack(webpackOpts);
            return compiler.run(function(err, stats) {
              var output;
              if (err) {
                return complete(err);
              }
              if (!config.verbose) {
                output = stats.toString({
                  colors: true,
                  hash: false,
                  timings: false,
                  assets: true,
                  chunks: false,
                  chunkModules: false,
                  modules: false,
                  children: true
                });
              } else {
                output = stats.toString({
                  colors: true
                });
              }
              docpad.log('info', output);
              return fs.readFile(file.get('outPath'), function(err, data) {
                if (err) {
                  return complete(err);
                }
                file.set({
                  contentRendered: data,
                  contentRenderedWithoutLayouts: data
                });
                return complete();
              });
            });
          });
        });
        tasks.run();
        return this;
      };

      return WebpackPlugin;

    })(BasePlugin);
  };

}).call(this);