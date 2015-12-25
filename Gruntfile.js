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
            'src/core/Engine.coffee',
            'src/core/Entity.coffee',
            'src/core/Controller.coffee',
            'src/core/Pane.coffee',
            'src/core/Particle.coffee',
            'src/core/Point.coffee',
            'src/core/Timer.coffee',
            'src/core/Tween.coffee',
            'src/core/Storage.coffee',
            'src/extended/BoundingBox.coffee',
            'src/extended/Line.coffee'
          ]
        }
      },
      examples: {
        files: {
          'examples/01-bounce/js/app.js': ['examples/01-bounce/js/src/*.coffee'],
          'examples/02-bounce/js/app.js': ['examples/02-bounce/js/src/*.coffee'],
          'examples/03-stars/js/app.js': ['examples/03-stars/js/src/*.coffee']
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['coffee']);

};
