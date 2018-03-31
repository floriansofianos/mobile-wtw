import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { CountriesServiceProvider } from '../../providers/countries-service/countries-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { Subject } from 'rxjs';

declare var cordova: any;

@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage {

  lastImage: string = null;
  loading: Loading;
  isLoading: boolean;
  firstLoading: Loading;
  user: any;
  username: string;
  countriesList: any;
  profileForm: any;
  photoData: any;
  parentSubject:Subject<any> = new Subject();

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, private transfer: Transfer,
    public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController, private file: File,
    private filePath: FilePath, public actionSheetCtrl: ActionSheetController, private authService: AuthServiceProvider,
    private countriesService: CountriesServiceProvider, private userService: UserServiceProvider) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.firstLoading = this.loadingCtrl.create();
    this.firstLoading.present();
    let currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.user = currentUser;
      this.username = currentUser.username;
      this.countriesService.getAll().subscribe(response => {
        this.countriesList = response.countries;
        this.profileForm = {
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          yearOfBirth: this.user.yearOfBirth,
          selectedCountry: this.user.country
        }
        this.updatePhoto();
      },
        error => {
          console.log(error);
        });

    }
    else {
      console.log('No current user error!!');
    }
  }

  updatePhoto() {
    this.isLoading = true;
    this.userService.getAvatar(this.user.id, 'big').subscribe(res => {
      var data = res;
      if (data && data.success) {
        this.photoData = data.data;
      }
      else this.photoData = null;
      this.isLoading = false;
      this.firstLoading.dismiss();
    },
      error => {
        console.log(error);
      }
    );
  }

  delete() {
    this.userService.deleteAvatar().subscribe(res => {
      this.updatePhoto();
    },
      error => {
        console.log(error);
      }
    );
  }

  save() {
    this.isLoading = true;
    this.firstLoading = this.loadingCtrl.create();
    this.firstLoading.present();
    this.authService.setUserProperties(this.profileForm).subscribe(res => {
      this.isLoading = false;
      this.firstLoading.dismiss();
    },
      error => {
        console.log(error);
      }
    );
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      this.uploadImage();
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage() {
    // Destination URL
    var url = "https://app.whatowatch.net/api/user/avatar";

    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);

    // File name only
    var filename = this.lastImage;

    this.authService.getAuthToken().then(token => {
      var options = {
        fileKey: "image",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        headers: { 'Authorization': 'JWT ' + token },
        params: { 'fileName': filename }
      };

      const fileTransfer: TransferObject = this.transfer.create();

      this.loading = this.loadingCtrl.create({
        content: 'Uploading...',
      });
      this.loading.present();

      // Use the FileTransfer to upload the image
      fileTransfer.upload(targetPath, url, options).then(data => {
        this.loading.dismissAll();
        this.presentToast('Image succesful uploaded.');
        this.firstLoading = this.loadingCtrl.create();
        this.firstLoading.present();
        this.updatePhoto();
      }, err => {
        this.loading.dismissAll()
        this.presentToast('Error while uploading file.');
      });
    });

  }

  ionViewWillEnter() {
    this.parentSubject.next('reload');
  }

}
