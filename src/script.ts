// Three.js をインポート
import * as THREE from 'three';
// Three.js の OrbitControls をインポート
import { OrbitControls } from 'three-orbitcontrols-ts';

let cameraDebug: HTMLElement = document.createElement('section');
document.body.appendChild(cameraDebug);

let commandLine: HTMLElement = document.createElement('section');
commandLine.id = 'commandSection';
document.body.appendChild(commandLine);

let commandInput: HTMLInputElement = document.createElement('input');
commandInput.id = 'commandArea';
commandLine.appendChild(commandInput);

let commandRun: HTMLInputElement = document.createElement('input');
commandRun.id = 'commandRun';
commandRun.type = 'button';
commandRun.value = 'GO';
commandLine.appendChild(commandRun);

window.addEventListener('DOMContentLoaded', () => {
  const onResize = (): void => {
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  // レンダラーを作成
  const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
  // canvasをbodyに追加
  document.body.appendChild(renderer.domElement);

  // シーンの作成
  const scene: THREE.Scene = new THREE.Scene();

  // カメラを作成
  const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(45, 640/480, 1, 10000);
  camera.position.set(0, 0, 48);

  // カメラコントロール
  const controls: OrbitControls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  // レンダラー初期化
  onResize();
  // リサイズイベント発生時に実行
  window.addEventListener('resize', onResize);

  // キューブの作成
  // -----------------------
  // ボックスジオメトリを生成
  const geometry: THREE.BoxGeometry       = new THREE.BoxGeometry(16, 16, 16);
  // マテリアルを生成
  const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({color: 0x00ff00});
  // 上記のボックスジオメトリとマテリアルを使ってメッシュを生成
  const cube: THREE.Mesh                  = new THREE.Mesh( geometry, material );

  // シーンにキューブを追加
  scene.add(cube);

  // 地面をシーンに追加
  let ground: THREE.Mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(64, 64, 1, 1),
    new THREE.MeshBasicMaterial({
      color: 0x99FF66
    })
  );
  ground.rotation.x = - Math.PI / 2;
  scene.add(ground);

  // 座標軸を表示
  var axes: THREE.AxesHelper = new THREE.AxesHelper(25);
  scene.add(axes);

  // 平行光源を生成
  const light: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff);
  // 光源の位置を設定
  light.position.set(0, 10, 30);
  // シーンに光源を追加
  scene.add(light);

  commandRun.addEventListener('click', () => {
    let command: string[] = commandInput.value.split(' ');

    for (let len: number = command.length; len <= 6+1; len++) {
      command.push('');
    }

    switch (command[0]) {
      case 'tp':
        if (!(command[1] == '~' || command[1] == '')) {
          camera.position.x = parseFloat(command[1]);
        }
        if (!(command[2] == '~' || command[2] == '')) {
          camera.position.y = parseFloat(command[2]);
        }
        if (!(command[3] == '~' || command[3] == '')) {
          camera.position.z = parseFloat(command[3]);
        }
        if (!(command[4] == '~' || command[4] == '')) {
          camera.rotation.x = parseFloat(command[4]);
        }
        if (!(command[5] == '~' || command[5] == '')) {
          camera.rotation.y = parseFloat(command[5]);
        }
        if (!(command[6] == '~' || command[6] == '')) {
          camera.rotation.z = parseFloat(command[6]);
        }
        break;
      default:
        break;
    }
  })

  // 毎フレーム更新関数
  const tick = (): void => {
    // 一定間隔で処理を繰り返す(引数に関数名を渡す)
    requestAnimationFrame(tick);
    // キューブの回転を変更
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;

    // 描画
    renderer.render(scene, camera);

    // デバッグ
    cameraDebug.innerHTML = `POSITION: x=<span class="x-value">${camera.position.x}</span>, y=<span class="y-value">${camera.position.y}</span>, z=<span class="z-value">${camera.position.z}</span><br>ROTATION: x=<span class="x-value">${camera.rotation.x}</span>, y=<span class="y-value">${camera.rotation.y}</span>, z=<span class="z-value">${camera.rotation.z}</span>`
  }

  // 毎フレーム更新関数を実行
  tick();
});