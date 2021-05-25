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
	topicUpdatedSignal: 0,
	graph: null,
	graphlayout: null,

	newConnection: null,
	creatingNewConnection: false,

	connectionRemovedSignal: 0,
	connectionsToRemove: [],
	glowingConnection: null,
	
	menuActive: false,

	selectedTopics: [],
	floatingTopics: [],
	floatingTopicsSignal: 0,
	topics: [
		{
			title: "Smart Home",
			root: true,
			id: "root",
			pos: {
				x: -100,
				y: 0,
			},
			connections: [
				// {id: 1, k: 200},
				// {id: 2, k: 50}
			]
		},
		{
			title: "Appliances",
			id: 1,
			pos: {
				x: 50,
				y: 80
			},
			connections: [
				{id: "root", k: 200},
				// {id: 11, k: 200},
				// {id: 12, k: 200},
				// {id: 13, k: 200},
			]
		},
		{
			title: "lights",
			id: 11,
			pos: {
				x: 250,
				y: 80
			},
			connections: [
				{id: 1, k: 200},
			]
		},
		{
			title: "speakers",
			id: 12,
			pos: {
				x: 250,
				y: 140
			},
			connections: [
				{id: 1, k: 200},
			]
		},
		{
			title: "door",
			id: 13,
			pos: {
				x: 250,
				y: 200
			},
			connections: [
				{id: 1, k: 200},
			]
		},
		{
			title: "Control Mediums",
			id: 2,
			pos: {
				x: 50,
				y: -80
			},
			connections: [
				{id: "root", k: 50},
				// {id: 21, k: 200},
				// {id: 22, k: 200},
				// {id: 23, k: 200},
			]
		},
		{
			title: "Voice",
			id: 21,
			pos: {
				x: 250,
				y: -80
			},
			connections: [
				{id: 2, k: 200},
			]
		},
		{
			title: "Smartphone",
			id: 22,
			pos: {
				x: 250,
				y: -160
			},
			connections: [
				{id: 2, k: 200},
				//{id: 232, k: 200},
			]
		},
		{
			title: "Dedicated screen touch interface",
			id: 23,
			pos: {
				x: 250,
				y: -220
			},
			connections: [
				{id: 2, k: 200},
				// {id: 231, k: 200},
			]
		},
		{
			title: "Screen built into wall",
			id: 231,
			pos: {
				x: 350,
				y: -220
			},
			connections: [
				{id: 23, k: 200},
			]
		},
		{
			title: "Mobile device",
			id: 232,
			pos: {
				x: 350,
				y: -300
			},
			connections: [
				{id: 23, k: 200},
				//{id: 22, k: 200},
			]
		},
	]
  },
  mutations: {
	INIT_TOPICS(state){
		//window.localStorage.clear();
		const savedTopics = window.localStorage.getItem("topics");
		//console.log("saved topics in init", savedTopics);
		if(savedTopics != undefined){
			state.topics = JSON.parse(savedTopics)
		}	
	},
	SAVE_TOPICS_TO_LOCAL_STORAGE(state){
		const topicsJson = JSON.stringify(state.topics);
		window.localStorage.setItem("topics", topicsJson);
	},
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
	SET_NODES_PARENT(state, nodesParent){
		state.nodesParent = nodesParent;
	},
	SET_CAMERA(state, camera){
		state.camera = camera;
	},
	CREATE_NEW_NODE(state, pos){
		state.newTopicPos = pos;
	},
	SET_CREATING_TOPIC(state, creating){
		state.creatingTopic = creating;
	},
	PUSH_TOPIC(state, topic){
		state.topics.push(topic);
	},
	UPDATE_TOPIC_BY_ID( state, {topicToUpdate, updateData}){
		let index = state.topics.findIndex(topic => topic.id === topicToUpdate.id);
		//console.log("topic update:", updateData);
		//console.log("topic updated");
		state.topics[index] = {
			...topicToUpdate,
			...updateData
		};
		if(updateData.pos != undefined && state.pressedTopicId !== topicToUpdate.id) {
			state.topics[index].object.position.x = updateData.pos.x;
			state.topics[index].object.position.y = updateData.pos.y;
		}
		state.topicUpdatedSignal = Math.random();

		// save to local storage
		
		//console.log("topics in localstorage", window.localStorage.getItem("topics"))
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
		//console.log(state.selectedTopics);
	},
	SET_SHIFT_KEY(state, pressed){
		state.shiftKey = pressed;
	},
	DESELECT_ALL_TOPICS_BUT(state, id){
		if(id === "all") state.selectedTopics = [];
		else state.selectedTopics = [id];
		state.deselectAllTopicsSignal = Math.random();
	},
	TOGGLE_FLOATING_TOPIC_BY_ID(state, topicId){
		let topicIndex = state.floatingTopics.findIndex(id => id === topicId);
		if(topicIndex === -1) state.floatingTopics.push(topicId);
		else state.floatingTopics.splice(topicIndex, 1);
		state.floatingTopicsSignal = Math.random();
	},
	TRIGGER_FLOATING_TOPICS_SIGNAL(state){
		state.floatingTopicsSignal = Math.random();
	},
	SET_GRAPH_LAYOUT(state, graphLayout){
		state.graphLayout = graphLayout;
	},
	SET_GRAPH(state, graph){
		state.graph = graph;
	},
	SET_NEW_CONNECTION(state, connection){
		state.creatingNewConnection = true;
		state.newConnection = {
			...state.newConnection,
			...connection
		}
	},
	PUSH_TOPIC_CONNECTION(state, {topicToUpdate, toNode, connection}){
		let force;
		if(connection.type == undefined || connection.type == "normal")
			force = 90;
		else if(connection.type == "weak")
			force = 5;
		
		topicToUpdate.connections.push({
			id: connection.to,
			k: force,
			type: connection.type
		});
		let node1 = topicToUpdate.graphNode.node;
		let node2 = toNode.graphNode.node;
		state.graph.newEdge(node1, node2, force);
		state.creatingNewConnection = false;
	},
	SET_REMOVE_CONNECTION_ID(state, id){
		state.removeConnectionId = id;
	},
	REMOVE_CONNECTION(state, topics){
		let connected = false;
		let id1 = topics.from.id;
		let id2 = topics.to.id;

		let indexToDelete = null;
		//reset the array
		state.connectionsToRemove = [];

		let from,to,node;
		for (let j = 0; j < 2; j++) {
			if(j === 0) {
				node = "from";
				from = id1;
				to = id2;
			}
			if(j === 1) {
				node = "to";
				from = id2;
				to = id1;
			}
			
			topics[node].connections.forEach((connection, i) => {
				if(connection.id == to){
					indexToDelete = i;
					connected = true;
				}
			})
			// remove adjacent connections in store data
			if(connected && topics.removeAdjacent){
				console.log("adjacent nodes in graph: ", state.graph);
				let connectedNode, connRemoveId;
				state.graph.edges.forEach(edge => {
					if(edge.target.id == from){
						connectedNode = state.topics.find(topic => topic.id == edge.source.id);
						connRemoveId = connectedNode.connections.findIndex(connection => connection.id == from);
						state.connectionsToRemove.push({from: from, to: connectedNode.id});
						connectedNode.connections.splice(connRemoveId, 1);
					}
				})
			}
			if(connected){
				topics[node].connections.splice(indexToDelete, 1);
				state.connectionsToRemove.push({from: from, to: to});
				state.graph.removeEdge(state.graph.adjacency[from][to][0])
			}

			
			connected = false;
		}

		state.connectionRemovedSignal = Math.random();
		state.removeConnectionId = null;
	},
	REMOVE_NODE(state, topicIndex){
		let node = state.topics[topicIndex].graphNode.node;
		
		state.graph.removeNode(node);
		state.topics.splice(topicIndex, 1);
	},
	SET_MENU_OPTION(state, options){
		state.menuOptions = options;
		state.menuOptionsSignal = Math.random();
	},
	SET_MENU_ACTIVE(state, active){
		state.menuActive = active;
	},
	SET_CONNECTION_GLOW(state, connection){
		state.glowingConnection = connection;
	},
	REMOVE_CONNECTION_GLOW(state, connection){
		state.removeGlowingConnection = connection;
	},
  },
  actions: {
		initTopics({ commit }){
			commit('INIT_TOPICS');
		},
		saveTopicsToLocalStorage({ commit }){
			commit('SAVE_TOPICS_TO_LOCAL_STORAGE');
		},
		updateCanvasMouseMove({ commit }, mouseMoveData) {
			commit('SET_CANVAS_MOUSE_MOVE', mouseMoveData);
		},
		updateCanvasMousePressed({ commit }, pressedData) {
			commit('SET_CANVAS_MOUSE_PRESSED', pressedData);
		},
		setScene({ commit }, sceneData) {
			commit('SET_SCENE', sceneData);
		},
		setNodesParent({ commit }, nodesParent) {
			commit('SET_NODES_PARENT', nodesParent);
		},
		setCamera({ commit }, cameraData) {
			commit('SET_CAMERA', cameraData);
		},
		setCreatingTopic({ commit }, creatingData) {
			commit('SET_CREATING_TOPIC', creatingData);
		},
		createNewNode({ commit }, pos){
			commit('CREATE_NEW_NODE', pos);
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
			if(topicToUpdate)
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
		toggleFloatingTopic({ commit }, topicId){
			commit('TOGGLE_FLOATING_TOPIC_BY_ID', topicId);
		},
		triggerFloatingTopicsSignal({ commit }){
			commit('TRIGGER_FLOATING_TOPICS_SIGNAL');
		},
		setGraphLayout({ commit }, graphLayout){
			commit('SET_GRAPH_LAYOUT', graphLayout);
		},
		setGraph({ commit }, graph){
			commit('SET_GRAPH', graph);
		},
		setNewConnection({ commit }, {from, to, type}){

			commit('SET_NEW_CONNECTION', {from, to, type});
		},
		pushTopicConnection({ commit, getters }, connection){
			let topicToUpdate = getters.getTopicById(connection.from);
			let toNode = getters.getTopicById(connection.to);
			commit('PUSH_TOPIC_CONNECTION', {topicToUpdate, toNode, connection});
		},
		setRemoveConnectionId({ commit }, id){
			commit('SET_REMOVE_CONNECTION_ID', id);
		},
		removeConnection({commit, getters }, {from, to, removeAdjacent = false}){
			const topics = {};
			topics.from = getters.getTopicById(from);
			topics.to = getters.getTopicById(to);
			topics.removeAdjacent = removeAdjacent;

			console.log("topics in remove connectiopn", topics);
			commit('REMOVE_CONNECTION', topics);
		},
		removeNode({ commit, getters }, id){
			let topicIndex = getters.getTopicIndexById(id)
			commit('REMOVE_NODE', topicIndex);
		},
		setMenuOption({ commit }, options){
			commit('SET_MENU_OPTION', options);
		},
		setMenuActive({ commit }, active){
			commit('SET_MENU_ACTIVE', active);
		},
		setConnectionGlow({ commit }, connection){
			commit('SET_CONNECTION_GLOW', connection);
		},
		removeConnectionGlow({ commit }, connection){
			commit('REMOVE_CONNECTION_GLOW', connection);
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
		getNodesParent(state){
			return state.nodesParent;
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
			return state.topics.find(topic => topic.id == id);
		},
		getTopicIndexById: (state) => (id) => {
			return state.topics.findIndex(topic => topic.id == id);
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
		getFloatingTopics(state){
			return state.floatingTopics;
		},
		getTopicCoordinateExtremeties(state){
			let maxX = 0; let minX = 0; let maxY = 0; let minY = 0;
			for (const topic of state.topics) {
				if(topic.pos.x > maxX) maxX = topic.pos.x;
				if(topic.pos.x < minX) minX = topic.pos.x;
				if(topic.pos.y > maxY) maxY = topic.pos.y;
				if(topic.pos.y < minY) minY = topic.pos.y;
			}
			return {
				minX: minX,
				maxX: maxX,
				minY: minY,
				maxY:maxY
			};
		},
		getGraphLayout(state){
			return state.graphLayout;
		},
		getGraph(state){
			return state.graph;
		},
		getNewConnection(state){
			return state.newConnection;
		},
		getCreatingNewConnection(state){
			return state.creatingNewConnection;
		},
		getRemoveConnectionId(state){
			return state.removeConnectionId;
		},
		getMenuOptions(state){
			return state.menuOptions;
		},
		getMenuActive(state){
			return state.menuActive;
		}
	}
})
export default store