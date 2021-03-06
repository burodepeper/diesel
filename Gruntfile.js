module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    watch: {
      engine: {
        files: ['src/**/*.coffee'],
        tasks: ['coffee:engine']
      },
      examples: {
        files: ['examples/**/*.coffee'],
        tasks: ['coffee:examples']
      }
    },

    coffee: {
      options: {
        bare: true,
        join: true
      },
      engine: {
        files: {
          'dist/engine.js': [
            'src/lib/functions.coffee',
            'src/lib/helpers.coffee',

            'src/core/Engine.coffee',
            'src/core/Entity.coffee',
            'src/core/Color.coffee',
            'src/core/Controller.coffee',
            'src/core/Point.coffee',
            'src/core/VisualEntity.coffee',
            'src/core/Pane.coffee',
            'src/core/Particle.coffee',
            'src/core/Timer.coffee',
            // 'src/core/Storage.coffee',

            'src/extended/Circle.coffee',
            'src/extended/Font.coffee',
            'src/extended/Line.coffee',
            'src/extended/Path.coffee',
            'src/extended/Polygon.coffee',
            'src/extended/Rectangle.coffee',
            'src/extended/Sprite.coffee',
            // 'src/extended/Square.coffee',
            'src/extended/Text.coffee',
            'src/extended/Tween.coffee',

            'src/extended/EngineDebugPane.coffee',

            'src/fonts/9px.coffee'
          ]
        }
      },
      examples: {
        files: {
          'examples/basics/js/app.js': ['examples/basics/js/src/*.coffee'],
          'examples/text/js/app.js': ['examples/text/js/src/*.coffee'],
          'examples/stars/js/app.js': ['examples/stars/js/src/*.coffee'],
          'examples/01-bounce/js/app.js': ['examples/01-bounce/js/src/*.coffee'],
          'examples/02-bounce/js/app.js': ['examples/02-bounce/js/src/*.coffee'],
          'examples/03-stars/js/app.js': ['examples/03-stars/js/src/*.coffee'],
          'examples/04-lines/js/app.js': ['examples/04-lines/js/src/*.coffee'],
          'examples/05-dashboard/js/app.js': ['examples/05-dashboard/js/src/*.coffee']
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['coffee']);

};
