import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { SocialServiceProvider } from '../../providers/social-service/social-service';
import { MovieDBServiceProvider } from '../../providers/movie-db-service/movie-db-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { CountriesServiceProvider } from '../../providers/countries-service/countries-service';
import * as _ from 'underscore';
import { MoviePage } from '../movie/movie';
import { TvShowPage } from '../tv-show/tv-show';

/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {
  id: number;
  currentUserId: number;
  username: string;
  isLoading: boolean;
  user: any;
  averageDistance: number;
  isPendingFriend: boolean;
  isFriend: boolean;
  friendship: any;
  isCurrentUser: boolean;
  likeMovieIds: Array<any>;
  dislikeMovieIds: Array<any>;
  likeTVShowIds: Array<any>;
  dislikeTVShowIds: Array<any>;
  config: any;
  lang: string;
  userCountry: string;
  photoData: any;
  isPendingFriendForMe: boolean;
  loadingWindow: Loading;

  constructor(private authService: AuthServiceProvider, private navCtrl: NavController, private socialService: SocialServiceProvider,
    private movieDBService: MovieDBServiceProvider, private userService: UserServiceProvider, public navParams: NavParams,
    private countriesService: CountriesServiceProvider, private loading: LoadingController) { }

  ngOnInit() {
    this.isLoading = true;
    this.loadingWindow = this.loading.create();
    this.loadingWindow.present();
    let currentUser = this.authService.getCurrentUser();
    this.currentUserId = currentUser.id;
    this.lang = currentUser.lang;

    this.movieDBService.getMovieDBConfiguration().subscribe(response => {
      this.config = response;
      // Load the asked user profile
      this.id = this.navParams.get('id');
      this.isCurrentUser = this.currentUserId == this.id;
      this.socialService.getUserProfile(this.id).subscribe(data => {
        if (data) {
          var response = data;
          this.user = response.user;
          this.likeMovieIds = _.map(_.filter(response.questionnaires, function (q) { return q.rating >= 4; }), 'movieDBId');
          this.dislikeMovieIds = _.map(_.filter(response.questionnaires, function (q) { return q.rating < 4; }), 'movieDBId');
          this.likeTVShowIds = _.map(_.filter(response.tvQuestionnaires, function (q) { return q.rating >= 4; }), 'movieDBId');
          this.dislikeTVShowIds = _.map(_.filter(response.tvQuestionnaires, function (q) { return q.rating < 4; }), 'movieDBId');
          this.countriesService.getAll().subscribe(response => {
            let countriesList = response.countries;
            let profileUser = this.user;
            this.userCountry = _.find(countriesList, function (c) { return c.code == profileUser.country; });
            this.updateFriendStatus();
          },
            error => {
              console.log(error);
            });
        }
        else console.log('error!!');
      },
        error => {
          console.log(error);
        }
      );
      if (!this.isCurrentUser) {
        this.socialService.getUserDistance(this.id).subscribe(data => {
          if (data) {
            this.updateDistance(data);
          }
          else console.log('error!!');
        },
          error => {
            console.log(error);
          }
        );
      }
    },
      error => {
        console.log(error);
      });

  }

  updatePhoto() {
    this.userService.getAvatar(this.user.id, 'big').subscribe(res => {
      var data = res
      if (data && data.success) {
        this.photoData = data.data;
      }
      else this.photoData = null;
      this.isLoading = false;
    },
      error => {
        console.log(error);
      }
    );
  }

  updateDistance(distance: any) {
    this.averageDistance = 100 - distance.averageDistance;
  }

  updateFriendStatus() {
    this.isLoading = true;
    this.socialService.getPendingFriend(this.id).subscribe(data => {
      if (data) {
        if (data.length > 0) {
          let pendingFriendships = data;
          let currentUserId = this.currentUserId;
          if (_.find(pendingFriendships, function (p) { return p.toUserId == currentUserId; })) this.isPendingFriendForMe = true;
          this.isPendingFriend = true;
          this.friendship = null;
          this.isFriend = false;
          this.updatePhoto();
        }
        else {
          this.socialService.getFriend(this.id).subscribe(data => {
            if (data) {
              this.friendship = data;
              this.isFriend = this.friendship != undefined;
              this.isPendingFriend = false;
              this.isPendingFriendForMe = false;
              this.updatePhoto();
            }
            else console.log('error!!');
          },
            error => {
              console.log(error);
            })
        }
      }
      else console.log('error!!');
    },
      error => {
        console.log(error);
      });
  }

  requestFriend() {
    this.isLoading = true;
    this.socialService.addToFriend(this.id).subscribe(data => {
      if (data) {
        this.updateFriendStatus();
      }
      else console.log('error!!');
    },
      error => {
        console.log(error);
      });
  }

  follow() {
    this.isLoading = true;
    this.socialService.followUser(this.id).subscribe(data => {
      if (data) {
        this.updateFriendStatus();
      }
      else console.log('error!!');
    },
      error => {
        console.log(error);
      });
  }

  unfollow() {
    this.isLoading = true;
    this.socialService.unfollowUser(this.id).subscribe(data => {
      if (data) {
        this.updateFriendStatus();
      }
      else console.log('error!!');
    },
      error => {
        console.log(error);
      });
  }

  unfriend() {
    this.isLoading = true;
    this.socialService.removeFromFriend(this.id).subscribe(data => {
      if (data) {
        this.updateFriendStatus();
      }
      else console.log('error!!');
    },
      error => {
        console.log(error);
      });
  }

  acceptFriendship() {
    this.isLoading = true;
    this.socialService.acceptFriend(this.id, null).subscribe(data => {
      if (data) {
        this.updateFriendStatus();
      }
      else console.log('error!!');
    },
      error => {
        console.log(error);
      });
  }

  onClickMovie(event) {
    if (event.movieId) {
      this.navCtrl.push(MoviePage, { id: event.movieId })
    }
  }

  onClickTV(event) {
    if (event.movieId) {
      this.navCtrl.push(TvShowPage, { id: event.movieId })
    }
  }
}
