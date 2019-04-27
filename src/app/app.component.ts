import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from 'firebase';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'トップ',
      url: '/',
      icon: 'home'
    },
    {
      title: 'ルートを取込',
      url: '/migration',
      icon: 'add'//'cloud-download'
    },
    {
      title: 'ルートを検索',
      url: '/list',
      icon: 'search'
    }
  ];

  public tabslot = 'top';
  public user: User;

  constructor(
    public platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public auth: AngularFireAuth,
    private navCtrl: NavController
  ) {
    this.initializeApp();
    this.initializeAuth();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // モバイル出ないときのデザイン調整
      if (!this.platform.is('mobile')) {
        this.tabslot = 'top';
        this.appPages.shift();
      }
    });
  }

  initializeAuth() {
    // 現在のログイン状態を確認
    this.user = this.auth.auth.currentUser;

    this.auth.authState.subscribe((user) => {
      if (user) {
        console.log('login done');
        this.user = user;
        // User is signed in.
        console.log(user);
        console.log(user.displayName);
        console.log(user.uid);
      } else {
        console.log('logout done');
        this.user = null;
        // No user is signed in.
      }
    });
  }

  toLoginPage() {
    this.navCtrl.navigateForward('/login');
  }

  logout() {
    this.auth.auth.signOut();
  }
}
