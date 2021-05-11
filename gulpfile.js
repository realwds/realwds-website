//  LOAD PACKAGES
const gulp = require('gulp'),
    del = require('del'),
    browserSync = require('browser-sync'),
    pkg = require('./package.json'),
    banner = require('gulp-banner'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
    rename = require('gulp-rename'),
    pug = require('gulp-pug'),
    babel = require('gulp-babel'),
    stylus = require('gulp-stylus'),
    koutoSwiss = require('kouto-swiss'),

    //  DIRECTORIES
    root = 'application',
    dest = 'release',
    assets = 'includes',
    file = 'yahiarefaiea',
    min = 'lite',
    css = 'stylesheets',
    js = 'javascripts',
    img = 'images'

    //  BANNER COMMENT
    comment =
      '/*\n'+
      ' *  <%= pkg.name %> <%= pkg.version %>\n'+
      ' *  \n'+
      ' *  <%= pkg.description %>\n'+
      ' *  <%= pkg.url %>\n'+
      ' *  <%= pkg.author.email %>\n'+
      ' *  \n'+
      ' *  Last update on: <%= new Date().getUTCFullYear() %>/'+
      '<%= new Date().getUTCMonth()+1 %>/<%= new Date().getUTCDate() %>\n'+
      ' *  ©<%= new Date().getFullYear() %> <%= pkg.author.name %>. all rights reserved.\n'+
      ' */\n\n';


//  DELETE
gulp.task('del', done=> {
  del.sync(dest)
  done()
})

//  BROWSER SYNC
gulp.task('browserSync', function() {
  browserSync({server: {baseDir: dest}});
})

//  PUG
gulp.task('pug', function() {
  return gulp.src(root+'/pug/public/*.pug')
    .pipe(pug({
      pretty: true
     }))
    .pipe(gulp.dest(dest));
})

//  BABEL
var babelSrc = require('./'+root+'/babel/babelSrc.json');
gulp.task('babel', function() {
  return gulp.src(babelSrc)
    .pipe(babel())
    .pipe(concat(file+'.js'))
    .pipe(banner(comment, {pkg:pkg}))
    .pipe(gulp.dest(dest+'/'+assets+'/'+js))

    .pipe(uglify())
    .pipe(banner(comment, {pkg:pkg}))
    .pipe(rename({extname:'.'+min+'.js'}))
    .pipe(gulp.dest(dest+'/'+assets+'/'+js));
})

//  STYLUS
gulp.task('stylus', function() {
  return gulp.src(root+'/stylus/app.styl')
    .pipe(stylus({'use': koutoSwiss()}))
    .pipe(banner(comment, {pkg:pkg}))
    .pipe(rename(file+'.css'))
    .pipe(gulp.dest(dest+'/'+assets+'/'+css))

    .pipe(uglifycss())
    .pipe(banner(comment, {pkg:pkg}))
    .pipe(rename({extname:'.'+min+'.css'}))
    .pipe(gulp.dest(dest+'/'+assets+'/'+css));
})

//  IMAGES
gulp.task('img', function() {
  return gulp.src(root+'/img/**/*')
    .pipe(gulp.dest(dest+'/'+assets+'/'+img));
})

//  WATCH
gulp.task('watch', function() {
  gulp.watch(root+'/pug/**/*', gulp.series(['pug', browserSync.reload]))
  gulp.watch(root+'/babel/**/*', gulp.series(['babel', browserSync.reload]))
  gulp.watch(root+'/stylus/**/*', gulp.series(['stylus', browserSync.reload]))
  gulp.watch(root+'/img/**/*', gulp.series(['img', browserSync.reload]))
});

// DEFAULT
gulp.task('default', gulp.parallel(
  'del', 'pug', 'babel', 'stylus', 'img'
))

//  RELEASE
gulp.task('dev', gulp.parallel(
  'del', 'pug', 'babel', 'stylus', 'img', 'browserSync', 'watch'
))
