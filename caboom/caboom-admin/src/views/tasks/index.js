import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import firebase from "./../../initFirebase";
import Modal from "@material-ui/core/Modal";
import Grid from "@material-ui/core/Grid";
import moment from "moment";
import AddIcon from "@material-ui/icons/AddCircleOutline";
import IconButton from "@material-ui/core/IconButton";
import Item from "./item";
// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  /*
  _updateStatus(
    droppableDestination.droppableId,
    removed.id,
    removed.data.creator,
    removed.data.creatorName
  );*/
  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;
  return result;
};
const makeNotification = async (id, status, owner, creatorName) => {
  var name;
  let getName = await firebase
    .firestore()
    .collection("Users")
    .where("email", "==", firebase.auth().currentUser.email)
    .get();
  getName.forEach((data) => {
    name = data.data().name;
  });
  var message;
  if (status === "Feito") {
    message = `${name} moveu o chamado ${id} para ${status} e está aguardando sua aprovação`;
  } else {
    message = `${name} moveu o chamado ${id} para ${status}`;
  }
  firebase
    .firestore()
    .collection("Notifications")
    .add({
      relatedId: "",
      userName: name,
      email: owner,
      message: message,
      path: "/helpdesk/chamadosEnviados",
      isRead: false,
      id: "",
      timesTamp: new Date(),
      date: moment(new Date()).format("DD/MM/YYYY"),
    })
    .then((newDoc) => {
      firebase
        .firestore()
        .collection("Notifications")
        .doc(newDoc.id)
        .update({ id: newDoc.id });
    });
};

function _updateStatus(droppableDestination, task, creator, creatorName) {
  let newstatus;
  if (droppableDestination === "droppable") {
    newstatus = "A fazer";
  }
  if (droppableDestination === "droppable2") {
    newstatus = "Em andamento";
  }
  if (droppableDestination === "droppable3") {
    newstatus = "Pausado";
  }
  if (droppableDestination === "droppable4") {
    newstatus = "Feito";
  }
  firebase
    .firestore()
    .collection("Chamados")
    .doc(task)
    .update({
      status: newstatus,
      finalDate: moment(new Date()).format("DD/MM/YYYY"),
    })
    .then(() => {
      makeNotification(task, newstatus, creator, creatorName);
    });
}

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  borderRadius: 3,
  // change background colour if dragging
  background: isDragging ? "#dfdfdf" : "#FAFAFA",
  boxShadow: "1px 1px 1px #9E9E9E",
  borderLeftWidth: 1,
  borderRightWidht: 1,
  borderColor: "#000000",
  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "#8ce47a" : "transparent",
  padding: grid,
  width: "100%",
  height: "auto",
  borderRadius: 5,
});

export default class App extends Component {
  state = {
    selected: [],
    chamados: [],
    chamadosEmAndamento: [],
    chamadosPausados: [],
    chamadosFeitos: [],
    items: [],
    open: false,
    modalDataSelect: {},
    user: "",
    droppables: [],
  };

  /**
   * A semi-generic way to handle multiple lists. Matches
   * the IDs of the droppable container to the names of the
   * source arrays stored in the state.
   */
  id2List = {};

  _fetchProfilePictures(email) {
    let url;
    firebase
      .firestore()
      .collection("Users")
      .where("email", "==", email)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          return;
        }
        snapshot.forEach((photo) => {
          url = photo.data().anexoURL;
        });
      })
      .then(() => {
        return url;
      });
  }

  fetchTasks = () => {
    var droppablesFetched = [];
    firebase
      .firestore()
      .collection("droppables")
      .where("pasta", "==", window.location.pathname.split("/")[3])
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          droppablesFetched.push(doc.data());
        });
      })
      .then(() => {
        droppablesFetched.sort((a, b) =>
          a.droppableId > b.droppableId
            ? 1
            : b.droppableId > a.droppableId
            ? -1
            : 0
        );
        this.setState({ droppables: droppablesFetched });
      });
  };
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ user: user.uid });
      this.fetchTasks();
    });
  }

  onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.state.droppables[source.droppableId].tasks,
        source.index,
        destination.index
      );
      var unorderedDrops = this.state.droppables;
      unorderedDrops[source.droppableId].tasks = items;
      this.setState({ droppables: unorderedDrops });
    } else {
      const result = move(
        this.state.droppables[source.droppableId].tasks,
        this.state.droppables[destination.droppableId].tasks,
        source,
        destination
      );

      var oldDroppables = this.state.droppables;
      oldDroppables[source.droppableId].tasks = result[source.droppableId];
      oldDroppables[destination.droppableId].tasks =
        result[destination.droppableId];
      for (let id = 0; id < oldDroppables.length; id++) {
        const element = oldDroppables[id].tasks;
        for (let idx = 0; idx < element.length; idx++) {
          oldDroppables[id].tasks[idx].taskId =
            oldDroppables[id].droppableId + "" + idx;
        }
      }
      this.setState({
        droppables: oldDroppables,
      });
    }
  };

  addSection = () => {
    var sectionsOld = this.state.droppables;
    var oldIds = this.id2List;
    oldIds[
      sectionsOld[sectionsOld.length - 1]
        ? sectionsOld[sectionsOld.length - 1].droppableId + 1
        : 0
    ] = sectionsOld[sectionsOld.length - 1]
      ? sectionsOld[sectionsOld.length - 1].droppableId + 1
      : 0;
    this.id2List = oldIds;
    firebase
      .firestore()
      .collection("droppables")
      .add({
        droppableId: sectionsOld[sectionsOld.length - 1]
          ? sectionsOld[sectionsOld.length - 1].droppableId + 1
          : 0,
        docId: "",
        name: "",
        color: "",
        tasks: [],
        pasta: window.location.pathname.split("/")[3],
      })
      .then((newDoc) => {
        firebase
          .firestore()
          .collection("droppables")
          .doc(newDoc.id)
          .update({ docId: newDoc.id })
          .then(() => {
            sectionsOld.push({
              droppableId: sectionsOld[sectionsOld.length - 1]
                ? sectionsOld[sectionsOld.length - 1].droppableId + 1
                : 0,
              docId: newDoc.id,
              name: "",
              color: "",
              tasks: [],
              idx: sectionsOld.length + 1,
            });
            sectionsOld.sort((a, b) =>
              a.idx > b.idx ? 1 : b.idx > a.idx ? -1 : 0
            );
            this.setState({ droppables: sectionsOld });
          });
      });
  };

  displayModalData(data) {
    return (
      <>
        <div className="Modal-main">
          <div className="modal-content">
            <h3 className="detalhesHeader">Detalhes do chamado</h3>
            <h5 className="modal-creator">criado por {data.creator}</h5>
            <div style={{ paddingTop: 30 }} />
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <div className="modal-details">
                  <h4 className="detalhesHeader">Problema: </h4>
                  <p>{data.problemas}</p>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <p className="detalhesHeader">Encarregados: </p>
                  <p>{data.encarregados}</p>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <p className="detalhesHeader">Área: </p>
                  <p>{data.area}</p>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <p className="detalhesHeader">Data limite: </p>
                  <p>{data.date}</p>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <p className="detalhesHeader">ID: </p>
                  <p>{data.id}</p>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <p className="detalhesHeader">Fase atual: </p>
                  <p>{data.status}</p>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <p className="detalhesHeader">Descrição: </p>
                  <p>{data.descricao}</p>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </>
    );
  }
  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity

  changeDroppableName = (e, id) => {
    var oldDroppables = [...this.state.droppables];
    oldDroppables[id].name = e.target.value;
    this.setState({ droppables: oldDroppables });
  };
  changeTaskDescription = (e, id, taskId) => {
    var oldDroppables = [...this.state.droppables];
    var foundTaskId = 0;
    for (let index = 0; index < oldDroppables[id].tasks.length; index++) {
      const element = oldDroppables[id].tasks[index];
      if (element.taskId === taskId) {
        foundTaskId = index;
      }
    }
    oldDroppables[id].tasks[foundTaskId].description = e.target.value;
    this.setState({ droppables: oldDroppables });
  };
  changeDroppableColor = (e, id) => {
    var oldDroppables = [...this.state.droppables];
    oldDroppables[id].color = e.target.value;
    this.setState({ droppables: oldDroppables });
  };

  handleBackgroundText = (color) => {
    var c = color.substring(1); // strip #
    var rgb = parseInt(c, 16); // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff; // extract red
    var g = (rgb >> 8) & 0xff; // extract green
    var b = (rgb >> 0) & 0xff; // extract blue

    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    if (luma < 100) {
      return "#fff";
    } else {
      return "#000";
    }
  };

  updateName = (name, id) => {
    firebase
      .firestore()
      .collection("droppables")
      .doc(id)
      .update({ name: name });
  };

  updateTaskName = (name, id, index) => {
    firebase
      .firestore()
      .collection("droppables")
      .doc(id)
      .update({ tasks: this.state.droppables[index].tasks });
  };

  updateColor = (newColor, id) => {
    firebase
      .firestore()
      .collection("droppables")
      .doc(id)
      .update({ color: newColor });
  };

  addTasks = (id) => {
    var sectionsOld = this.state.droppables;
    var tasks = sectionsOld[id].tasks;
    sectionsOld[id].tasks.push({
      taskId:
        tasks.length > 0
          ? id + "" + tasks[tasks.length - 1].taskId * 1 + 1
          : id + "0",
      description: "",
      longDescription: "",
      subtasks: [],
      notes: [],
      files: [],
      people: [],
      deadLine: "",
      history: [],
      finished: false,
      creator: {
        name: firebase.auth()?.currentUser?.displayName,
        email: firebase.auth()?.currentUser?.email,
        photo: firebase.auth()?.currentUser?.photoURL,
        uid: firebase.auth()?.currentUser?.uid,
      },
    });
    firebase
      .firestore()
      .collection("droppables")
      .doc(sectionsOld[id].docId)
      .update({ tasks: sectionsOld[id].tasks });
    this.setState({ droppables: sectionsOld });
  };
  render() {
    console.log(
      firebase.auth()?.currentUser?.displayName,
      firebase.auth()?.currentUser?.email,
      firebase.auth()?.currentUser?.uid
    );
    return (
      <>
        <Modal
          open={this.state.open}
          onClose={() => this.setState({ open: false })}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {this.displayModalData(this.state.modalDataSelect)}
        </Modal>
        <div className="droppables-wrapper">
          <DragDropContext onDragEnd={this.onDragEnd}>
            {this.state.droppables.map((drop, indexD) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
                className="Droppable-container"
              >
                <div>
                  <div
                    style={{
                      backgroundColor: drop.color ? drop.color : "#FBCD00",
                    }}
                    className="Droppable-Title-Feito"
                  >
                    <input
                      className="input-section-name"
                      onBlur={() => this.updateName(drop.name, drop.docId)}
                      value={drop.name}
                      style={{ color: this.handleBackgroundText(drop.color) }}
                      onChange={(e) => this.changeDroppableName(e, indexD)}
                    />
                    <input
                      type="color"
                      className="color-input"
                      onBlur={() => this.updateColor(drop.color, drop.docId)}
                      value={drop.color ? drop.color : "#fbcd00"}
                      onChange={(e) => this.changeDroppableColor(e, indexD)}
                    />
                    <IconButton
                      color="primary"
                      style={{
                        backgroundColor: drop.color ? drop.color : "#FBCD00",
                      }}
                      onClick={() => {
                        this.addTasks(indexD);
                      }}
                    >
                      <AddIcon color="primary" />
                    </IconButton>
                  </div>
                </div>
                <Droppable index={indexD} droppableId={drop.droppableId + ""}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      className="droppable-wrapeper"
                      style={getListStyle(snapshot.isDraggingOver)}
                    >
                      {drop.tasks.map((item, index) => (
                        <Draggable
                          key={item.taskId}
                          draggableId={item.taskId + ""}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="done-item"
                            >
                              <Item
                                data={item}
                                changeName={(e) =>
                                  this.changeTaskDescription(
                                    e,
                                    indexD,
                                    item.taskId
                                  )
                                }
                                updateName={() =>
                                  this.updateTaskName(
                                    drop.name,
                                    drop.docId,
                                    indexD
                                  )
                                }
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </DragDropContext>
          <div
            onClick={() => {
              this.addSection();
            }}
            className="new-column-wrapper"
          >
            <p>+ Nova coluna</p>
          </div>
        </div>
      </>
    );
  }
}
