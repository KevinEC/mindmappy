import { createStore } from 'vuex'

const store = createStore({
  state: {
    canvasMousePressed: false,
    canvasMouseMove: {},
		canvasMouseMovement: null,
		scene: null,
		camera: null,
		creatingTopic: false,
		topics: [
			{
				title: "mindmap",
				pos: {
					x: null,
					y: null
				}
			},
			{
				title: "idea",
				pos: {
					x: null,
					y: null
				}
			}
		]
  },
  mutations: {
    SET_CANVAS_MOUSE_MOVE(state, payload) {
		state.canvasMouseMove = {
			...state.canvasMouseMove,
			...payload
		};
		// hack to ease object change detection
		state.canvasMouseMovement = Math.random();
    },
		SET_CANVAS_MOUSE_PRESSED(state, pressed) {
			//console.log("MUTATION", pressed);
			state.canvasMousePressed = pressed;
		},
		SET_SCENE(state, scene){
			state.scene = scene;
		},
		SET_CAMERA(state, camera){
			state.camera = camera;
		},
		SET_CREATING_TOPIC(state, creating){
			state.creatingTopic = creating;
		},
		PUSH_TOPIC(state, topic){
			state.topics.push(topic);
		}
  },
  actions: {
		updateCanvasMouseMove({ commit }, mouseMoveData) {
			commit('SET_CANVAS_MOUSE_MOVE', mouseMoveData);
		},
		updateCanvasMousePressed({ commit }, pressedData) {
			commit('SET_CANVAS_MOUSE_PRESSED', pressedData);
		},
		setScene({ commit }, sceneData) {
			commit('SET_SCENE', sceneData);
		},
		setCamera({ commit }, cameraData) {
			commit('SET_CAMERA', cameraData);
		},
		setCreatingTopic({ commit }, creatingData) {
			commit('SET_CREATING_TOPIC', creatingData);
		},
		pushTopic({ commit }, topicData) {
			commit('PUSH_TOPIC', topicData);
		}
  },
	getters: {
		getCanvasMouseMove(state){
			return state.canvasMouseMove;
		},
		getCanvasMousePressed(state){
			return state.canvasMousePressed;
		},
		getScene(state){
			return state.scene;
		},
		getCamera(state){
			return state.camera;
		},
		getCreatingTopic(state){
			return state.creatingTopic;
		},
		getAllTopics(state) {
			return state.topics;
		}
	}
})
export default store