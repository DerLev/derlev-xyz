const gulp = require('gulp')
const clean = require('gulp-clean')
const shell = require('gulp-shell')
const workbox = require('workbox-build')

gulp.task('clean', () => {
  return gulp.src('public', { read: false, allowEmpty: true }).pipe(clean())
})
gulp.task('vite-build', shell.task(['yarn build']))
gulp.task('hugo-build', shell.task(['hugo --gc']))
gulp.task('generate-service-worker', () => {
  return workbox.generateSW({
    sourcemap: false,
    cacheId: 'derlev',
    globDirectory: './public',
    globPatterns: ['**/*.{css,js,eot,ttf,woff,woff2,otf}', 'styling/noise.svg', 'favicons/*.png', 'favicon.ico'],
    swDest: './public/sw.js',
    modifyURLPrefix: {
      '': '/',
    },
    clientsClaim: true,
    skipWaiting: true,
    dontCacheBustURLsMatching: /./,
    maximumFileSizeToCacheInBytes: 50 * 1024 * 1024,
    runtimeCaching: [
      {
        urlPattern: /(?:\/)$/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'html',
          expiration: {
            maxAgeSeconds: 60 * 60 * 24 * 3,
          },
        },
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|gif|bmp|webp|svg|ico)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images',
          expiration: {
            maxEntries: 1000,
            maxAgeSeconds: 60 * 60 * 24 * 14,
          },
        },
      },
      {
        urlPattern: /^(https:\/\/fonts\.gstatic\.com)|(https:\/\/fonts\.googleapis\.com)/,
        handler: 'CacheFirst',
        options: {
          cacheName: "google-fonts",
          expiration: {
            maxAgeSeconds: 60 * 60 * 24 * 365,
          },
        },
      },
    ],
  })
})

gulp.task(
  'build',
  gulp.series('clean', 'vite-build', 'hugo-build', 'generate-service-worker'),
)
