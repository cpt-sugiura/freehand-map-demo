import { TileLayer, MapContainer, MapContainerProps } from 'react-leaflet';
import * as React from 'react';
import { select, Selection } from 'd3-selection';
import { line, curveMonotoneX } from 'd3-shape';
import { LeafletMouseEvent, Point } from 'leaflet';

type MapChartProps = {
  center: MapContainerProps['center'];
};
/**
 * Leaflet の Map
 */
export const FreeHandMap: React.FC<MapChartProps> = (props) => {
  // SVG の path 要素を一続きにして伸ばし続ける関数の置き場変数
  let pathStretcher: (toPoint: Point) => void;

  // Map コンポーネントを配置。手書き中に地図が不意に動かない様に以下の props を定義。不意に動くと思った通りの書き込みをし難いです。
  //       dragging={false}
  //       zoomControl={false}
  //       scrollWheelZoom={false}
  //       doubleClickZoom={false}
  return (
    <MapContainer
      id={'map'}
      center={props.center}
      zoom={17}
      dragging={false}
      zoomControl={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      whenCreated={(map) => {
        // Map が用意されたところでイベントをまとめて登録

        // 書き始め、書き終わりを制御するための状態
        let mouseState: 'WAIT' | 'WRITING' = 'WAIT';
        map.addEventListener('mousedown', (event: LeafletMouseEvent) => {
          // マウスをクリックしたら書き始める。=> 書き込み待ち状態から書き込み中状態になる
          mouseState = 'WRITING';
          // SVG 要素を用意して地図要素の末尾に追加。この SVG 要素の中の path で任意に動かされたマウスの軌跡を表現する
          const svg = select(map.getContainer())
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .style('pointer-events', 'none')
            .style('z-index', '1001')
            .style('position', 'absolute');
          // マウスが動かされたら、SVG 要素中に線を追加する関数を用意
          pathStretcher = makePathCreator(svg, map.latLngToContainerPoint(event.latlng));
        });
        map.addEventListener('mousemove', (event: LeafletMouseEvent) => {
          // マウスが動かされた時、書き込み中でないのならなにもしない
          if (mouseState !== 'WRITING') {
            return;
          }
          // 書き込み中ならば線を追加
          const point = map.mouseEventToContainerPoint(event.originalEvent);
          pathStretcher(new Point(point.x, point.y));
        });
        map.addEventListener('mouseup', () => {
          // マウスが離されたら書き込みを終えて再び待機状態へ移行
          mouseState = 'WAIT';
        });
      }}
    >
      <TileLayer url="https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg" />
    </MapContainer>
  );
};

/**
 * 点を与えるたびに、引数の SVG 要素に、引数の点から始まる一続きのパスを SVG 要素に追加する関数を返す。
 * @param svg パスが追加され続ける SVG 要素
 * @param initPoint パスを追加する始点
 */
function makePathCreator(svg: Selection<SVGSVGElement, unknown, null, undefined>, initPoint: Point) {
  /**
   *  leaflet の Point 二点から SVG のパス定義である d 属性を生成する関数
   *  @see https://developer.mozilla.org/ja/docs/Web/SVG/Attribute/d
   */
  const pointsToPathD = line<Point>()
    .curve(curveMonotoneX)
    .x((d) => d.x)
    .y((d) => d.y);

  /** 始点 */
  let fromPoint: Point = initPoint;
  // 現在の始点から与えられた点へ続く線を描画する関数を返す
  return (toPoint: Point) => {
    // 始点から与えられた点への線を追加
    svg
      .append('path')
      .attr('d', pointsToPathD([fromPoint, toPoint]))
      // ユーザーに書く線を決めさせたい場合はここに色々とデザインを決定する属性を渡せるようにする
      .attr('stroke', 'red')
      .attr('stroke-width', '2px');
    // 今回の終点を次回の始点化
    fromPoint = toPoint;
  };
}
