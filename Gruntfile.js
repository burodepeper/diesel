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
            'src/core/Entity.coffee',
            'src/core/Pane.coffee',
            'src/core/Particle.coffee',
            'src/core/Timer.coffee',
            'src/core/Tween.coffee',
            'src/core/Storage.coffee'
          ]
        }
      },
      examples: {
        files: {
          'examples/01-bounce/js/app.js': ['examples/01-bounce/js/src/*.coffee']
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['coffee']);

};
