import { createStore } from 'vuex'

import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    FogExp2,
    CylinderBufferGeometry,
    MeshPhongMaterial,
    Mesh,
    DirectionalLight,
    AmbientLight,
    // LineBasicMaterial,
    // Geometry,
    // Vector3,
    // Line
  } from "three"

  import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';



const store = createStore({
  state: {
    width: 0,
    height: 0,
    camera: null,
    controls: null,
    scene: null,
    renderer: null,
    axisLines: [],
    pyramids: []
  },
  mutations: {
    SET_VIEWPORT_SIZE(state, { width, height }) {
        state.width = width;
        state.height = height;
    },
    RESIZE(state, { width, height }) {
        state.width = width;
        state.height = height;
        state.camera.aspect = width / height;
        state.camera.updateProjectionMatrix();
        state.renderer.setSize(width, height);
        state.controls.handleResize();
        state.renderer.render(state.scene, state.camera);
    },
    INITIALIZE_RENDERER(state, el) {
        state.renderer = new WebGLRenderer({ antialias: true });
        state.renderer.setPixelRatio(window.devicePixelRatio);
        state.renderer.setSize(state.width, state.height);
        el.appendChild(state.renderer.domElement);
    },
    INITIALIZE_CAMERA(state) {
        state.camera = new PerspectiveCamera(90, state.width / state.height, 1, 1000);
        state.camera.position.z = 500;
    },
    INITIALIZE_CONTROLS(state) {
        state.controls = new TrackballControls(
          state.camera,
          state.renderer.domElement
        );
        state.controls.rotateSpeed = 1.0;
        state.controls.zoomSpeed = 1.2;
        state.controls.panSpeed = 0.8;
        state.controls.noZoom = false;
        state.controls.noPan = false;
        state.controls.staticMoving = true;
        state.controls.dynamicDampingFactor = 0.3;
    },
    INITIALIZE_SCENE(state) {
        state.scene = new Scene();
        state.scene.background = new Color(0xcccccc);
        state.scene.fog = new FogExp2(0xcccccc, 0.002);

        let geometry = new CylinderBufferGeometry(0, 10, 30, 4, 1);
        let material = new MeshPhongMaterial({
          color: 0xffffff,
          flatShading: true
        });
        
        for (let i = 0; i < 500; i++) {
          let mesh = new Mesh(geometry, material);
          mesh.position.x = (Math.random() - 0.5) * 1000;
          mesh.position.y = (Math.random() - 0.5) * 1000;
          mesh.position.z = (Math.random() - 0.5) * 1000;
          mesh.updateMatrix();
          mesh.matrixAutoUpdate = false;
          state.pyramids.push(mesh);
        }
        state.scene.add(...state.pyramids);
        // lights
        let lightA = new DirectionalLight(0xffffff);
        lightA.position.set(1, 1, 1);
        state.scene.add(lightA);
        let lightB = new DirectionalLight(0x002288);
        lightB.position.set(-1, -1, -1);
        state.scene.add(lightB);
        let lightC = new AmbientLight(0x222222);
        state.scene.add(lightC);
        // // Axis Line 1
        // let materialB = new LineBasicMaterial({ color: 0x0000ff });
        // let geometryB = new Geometry();
        // geometryB.vertices.push(new Vector3(0, 0, 0));
        // geometryB.vertices.push(new Vector3(0, 1000, 0));
        // let lineA = new Line(geometryB, materialB);
        // state.axisLines.push(lineA);
        // // Axis Line 2
        // let materialC = new LineBasicMaterial({ color: 0x00ff00 });
        // let geometryC = new Geometry();
        // geometryC.vertices.push(new Vector3(0, 0, 0));
        // geometryC.vertices.push(new Vector3(1000, 0, 0));
        // let lineB = new Line(geometryC, materialC);
        // state.axisLines.push(lineB);
        // // Axis 3
        // let materialD = new LineBasicMaterial({ color: 0xff0000 });
        // let geometryD = new Geometry();
        // geometryD.vertices.push(new Vector3(0, 0, 0));
        // geometryD.vertices.push(new Vector3(0, 0, 1000));
        // let lineC = new Line(geometryD, materialD);
        // state.axisLines.push(lineC);
        
        // state.scene.add(...state.axisLines);
    },
  },
  actions: {
    INIT({ state, commit }, { width, height, el }) {
      return new Promise(resolve => {
        commit("SET_VIEWPORT_SIZE", { width, height });
        commit("INITIALIZE_RENDERER", el);
        commit("INITIALIZE_CAMERA");
        commit("INITIALIZE_CONTROLS");
        commit("INITIALIZE_SCENE");
        // Initial scene rendering
        // TODO problem occurs here
        state.renderer.render(state.scene, state.camera);
        // Add an event listener that will re-render
        // the scene when the controls are changed
        state.controls.addEventListener("change", () => {
          state.renderer.render(state.scene, state.camera);
        });
        resolve();
      });
    },
    ANIMATE({ state, dispatch }) {
        window.requestAnimationFrame(() => {
          dispatch("ANIMATE");
          state.controls.update();
        });
    }
}
})
export default store