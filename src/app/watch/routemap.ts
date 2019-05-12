import { Events } from '@ionic/angular';
import * as L from 'leaflet';
import * as Elevation from 'leaflet.elevation/src/L.Control.Elevation.js';
import * as AnimatedMarker from './animatedMarker.js';

/***
 * ルートModel
 * いろんなところで使いまわしたい
 */
export class Route {
    id: string;
    title: string;
    body: string;
    tag: string;
    author: string;
    summary: string;
    thumburl: string;
    is_gps: boolean;
    created_at: string;
    private staticmap_url = 'https://map.yahooapis.jp/map/V1/static';
    private thumbappid = "dj00aiZpPXFPNk1BUG4xYkJvYSZzPWNvbnN1bWVyc2VjcmV0Jng9N2U-";
    private getThumbUrl(summary) {
        let line = summary.slice(11, -1).split(',').map(pos => {
            let p = pos.split(' ');
            return p[1] + ',' + p[0];
        }).join(',');
        return this.staticmap_url + '?appid=' + this.thumbappid
            + '&autoscale=on&scalebar=off&width=450&height=300&l=' + '0,0,255,105,4,' // rgb, a, weight
            + line;
    }
}

export class Routemap {

    gpsIcon = new L.icon({
        iconUrl: '/assets/icon/gps_icon.png',
        iconSize: [20, 20], // size of the icon
        iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
        popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor    
    });
    startIcon = new L.icon({
        iconUrl: '/assets/icon/start_icon.png',
        iconSize: [50, 27], // size of the icon
        iconAnchor: [52, 27], // point of the icon which will correspond to marker's location
        popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor    
    });
    goalIcon = new L.icon({
        iconUrl: '/assets/icon/goal_icon.png',
        iconSize: [50, 27], // size of the icon
        iconAnchor: [-2, 27], // point of the icon which will correspond to marker's location
        popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor    
    });
    commentIcon = new L.icon({
        iconUrl: '/assets/icon/comment_icon.png',
        iconSize: [20, 20], // size of the icon
        iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
        popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor    
    });
    editIcon = new L.icon({
        iconUrl: '/assets/icon/edit_icon.png',
        iconSize: [14, 14], // size of the icon
        iconAnchor: [7, 7], // point of the icon which will correspond to marker's location
        popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor    
        className: 'map-editIcon',
    });

    private getYahooLayer() {
        let layer = new L.tileLayer('https://map.c.yimg.jp/m?x={x}&y={y}&z={z}&r=1&style=base:standard&size=512');
        // FIXME: 実行時にもとクラスの定義を書き換えちゃってる
        layer.__proto__.getTileUrl = function (coord) {
            let z = coord.z + 1;
            let x = coord.x;
            let y = Math.pow(2, coord.z - 1) - coord.y - 1;
            return 'https://map.c.yimg.jp/m?x=' + x + '&y=' + y + '&z=' + z + '&r=1&style=base:standard&size=512';
        }
        return layer;
    }

    constructor() {
        Elevation;
        AnimatedMarker;
    }

    createMap(mapele) {
        let center: any = [35.681, 139.767];
        let map = L.map(mapele, { center: center, zoom: 9, zoomControl: false });
        this.getYahooLayer().addTo(map);

        //スケールコントロールを追加（オプションはフィート単位を非表示）
        // TODO画面の設計を考えてじゃまにならないように配置したい
        L.control.scale({ imperial: false }).addTo(map);

        // elevation
        let elevation = L.control.elevation({
            position: 'bottomright',
            theme: 'steelblue-theme',
            // TODO : ウィンドウサイズ変更イベントに対応する
            width: window.innerWidth - 10,
            height: 150,
            margins: {
                top: 0,
                right: 5,
                bottom: 0,
                left: 0,
            },
            useHeightIndicator: true,
            isInnerLabel: true,
            tooltips: true,
            tooltipsLabel: {
                dist: '距離',
                elevation: '標高',
                slope: '斜度',
                distDiff: '距離差',
                elevationDiff: '標高差',
                slopeAverage: '平均斜度',
            },
            addSlope: true,
        }).addTo(map);


        return {
            map: map,
            elevation: elevation,
            addAnimatedMarker: (line) => {
                let latlnglist = line.map(l => { return [l[1], l[0]]; });
                let animatedMarker = L.animatedMarker(latlnglist, {});
                map.addLayer(animatedMarker);
                animatedMarker.start();
            },
        };
    }
}

