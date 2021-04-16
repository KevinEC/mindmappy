import { createStore } from 'vuex'

const store = createStore({
  state: {
    canvasMousePressed: false,
    canvasMouseMove: {},
	canvasMouseMovement: null,
	scene: null,
	camera: null,
	pressedTopicId: null,
	creatingTopic: false,
	topicsMounted: 0,
	shiftKey: false,
	deselectAllTopicsSignal: 0,
	selectedTopics: [],
	topics: [
		{
			title: "mindmap",
			id: 1,
			pos: {
				x: 0,
				y: 0,
			},
			connections: [2]
		},
		{
			title: "idea",
			id: 2,
			pos: {
				x: 80,
				y: -80
			},
			connections: [1]
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
	},
	UPDATE_TOPIC_BY_ID( state, {topicToUpdate, updateData}){
		let index = state.topics.findIndex(topic => topic.id === topicToUpdate.id);
		console.log("topic update:", updateData);
		state.topics[index] = {
			...topicToUpdate,
			...updateData
		};
		state.topicUpdated = Math.random();
	},
	SET_PRESSED_TOPIC_ID(state, topicId){
		state.pressedTopicId = topicId;
	},
	SET_TOPICS_MOUNTED(state, mounted){
		if(mounted) state.topicsMounted = Math.random();
	},
	TOGGLE_SELECTED_TOPIC(state, topicId){
		let topicIndex = state.selectedTopics.findIndex(id => id === topicId);
		if(topicIndex === -1) state.selectedTopics.push(topicId);
		else state.selectedTopics.splice(topicIndex, 1);
		console.log(state.selectedTopics);
	},
	SET_SHIFT_KEY(state, pressed){
		state.shiftKey = pressed;
	},
	DESELECT_ALL_TOPICS_BUT(state, id){
		if(id === "all") state.selectedTopics = [];
		else state.selectedTopics = [id];
		state.deselectAllTopicsSignal = Math.random();
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
		},
		pushTopicObject({ commit }, topicObjectData) {
			commit('PUSH_TOPIC_OBJECT', topicObjectData);
		},
		setTopicObjects({ commit }, topicObjectsData) {
			commit('SET_TOPIC_OBJECTS', topicObjectsData);
		},
		updateTopicById({ commit, getters }, {id, updateData}){
			let topicToUpdate = getters.getTopicById(id);
			commit('UPDATE_TOPIC_BY_ID', {topicToUpdate, updateData})
		},
		setPressedTopic({commit}, topicIdData) {
			commit('SET_PRESSED_TOPIC_ID', topicIdData);
		},
		setTopicsMounted({ commit }, mounted){
			commit('SET_TOPICS_MOUNTED', mounted)
		},
		toggleSelectedTopic({ commit }, topicId){
			commit('TOGGLE_SELECTED_TOPIC', topicId);
		},
		setShiftKey({ commit }, pressed){
			commit('SET_SHIFT_KEY', pressed);
		},
		deselectAllTopicsBut({ commit }, id){
			commit('DESELECT_ALL_TOPICS_BUT', id);
		},
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
		},
		getTopicById: (state) => (id) => {
			return state.topics.find(topic => topic.id === id);
		},
		getPressedTopicId(state){
			return state.pressedTopicId;
		},
		getShiftKey(state){
			return state.shiftKey;
		},
		getSelectedTopicsLength(state){
			return state.selectedTopics.length;
		},
		getSelectedTopics(state){
			return state.selectedTopics;
		},
	}
})
export default store