import { Component, Input } from '@angular/core';
import * as _ from 'underscore';
import { MovieDBServiceProvider } from '../../providers/movie-db-service/movie-db-service';
import { SocialServiceProvider } from '../../providers/social-service/social-service';
import { Loading, LoadingController, NavController } from 'ionic-angular';
import { UserPage } from '../../pages/user/user';

@Component({
  selector: 'also-like',
  templateUrl: 'also-like.html'
})
export class AlsoLikeComponent {
  @Input() lang: string;
  numberOfElements = 5;
  loadedElements = 0;
  loadedTVElements = 0;
  movies: Array<any> = [];
  tvshows: Array<any> = [];
  isLoadingMovies: boolean = true;
  isLoadingTVShows: boolean = true;
  config: any;
  width: 50;
  loadingWindow: Loading;

  constructor(private socialService: SocialServiceProvider, private movieDBService: MovieDBServiceProvider, private loading: LoadingController,
  private navCtrl: NavController) { }

  ngOnInit() {
      this.loadingWindow = this.loading.create();
      this.loadingWindow.present();
      this.movieDBService.getMovieDBConfiguration().subscribe(response => {
          this.config = response;
          for (var i = 1; i <= this.numberOfElements; i++) {
              this.socialService.getUsersThatAlsoLiked().subscribe(data => {
                  if (data) {
                      data = data;
                      if (!_.find(this.movies, function (m) { return m.users[0].movieDBId == data[0].movieDBId })) {
                          this.movies.push({ users: data });
                      }
                  }
                  this.loadedElements++;
                  if (this.loadedElements >= this.numberOfElements) {
                      // Load the movies
                      var movieDBIds = [];
                      _.each(_.map(this.movies, 'users'), function (array) {
                          movieDBIds.push(array[0].movieDBId);
                      });
                      if (movieDBIds.length < 1) {
                          this.isLoadingMovies = false;
                          this.checkLoading();
                      }
                      else {
                          this.movieDBService.getMovies(movieDBIds, this.lang).subscribe(data => {
                              if (data) {
                                  data = data;
                                  _.each(this.movies, function (m) {
                                      m.movie = _.find(data, function (d) { return d.id == m.users[0].movieDBId; })
                                  })
                                  this.isLoadingMovies = false;
                                  this.checkLoading();
                              }
                              else throw new Error('I am a bug...');
                          },
                              error => {
                                throw new Error(error);
                              });
                      }
                  }
              },
                  error => {
                    throw new Error(error);
                  });
          }
          for (var j = 1; j <= this.numberOfElements; j++) {
              this.socialService.getUsersThatAlsoTVLiked().subscribe(data => {
                  if (data) {
                      data = data;
                      if (!_.find(this.tvshows, function (m) { return m.users[0].movieDBId == data[0].movieDBId })) {
                          this.tvshows.push({ users: data });
                      }
                  }
                  this.loadedTVElements++;
                  if (this.loadedTVElements >= this.numberOfElements) {
                      // Load the movies
                      var movieDBIds = [];
                      _.each(_.map(this.tvshows, 'users'), function (array) {
                          movieDBIds.push(array[0].movieDBId);
                      });
                      if (movieDBIds.length < 1) {
                          this.isLoadingTVShows = false;
                          this.checkLoading();
                      }
                      else {
                          this.movieDBService.getTVShows(movieDBIds, this.lang).subscribe(data => {
                              if (data) {
                                  data = data;
                                  _.each(this.tvshows, function (m) {
                                      m.tvshow = _.find(data, function (d) { return d.id == m.users[0].movieDBId; })
                                  })
                                  this.isLoadingTVShows = false;
                                  this.checkLoading();
                              }
                              else throw new Error('error');
                          },
                              error => {
                                throw new Error(error);
                              });
                      }
                  }
              },
                  error => {
                    throw new Error(error);
                  });
          }
      },
          error => {
            throw new Error(error);
          });
  }

  checkLoading() {
    if(!this.isLoadingMovies && !this.isLoadingTVShows) {
      this.loadingWindow.dismiss();
    }
  }

  goToUser(id: any) {
    this.navCtrl.push(UserPage, { id: id });
  }
}
