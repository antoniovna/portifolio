import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import firebase from "./../../initFirebase";
import Modal from "@material-ui/core/Modal";
import Grid from "@material-ui/core/Grid";
import moment from "moment";
import CheckIcon from "@material-ui/icons/Check";
import Details from "./orderDetails";
import { Button, Typography } from "@material-ui/core";
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
  _updateStatus(
    droppableDestination.droppableId,
    removed.id,
    removed.data.creator,
    removed.data.creatorName
  );
  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;
  return result;
};

function _updateStatus(droppableDestination, task, creator, creatorName) {
  let newstatus;
  if (droppableDestination === "droppable") {
    newstatus = "Esperando pagamento";
  }
  if (droppableDestination === "droppable2") {
    newstatus = "Aceitos";
  }
  if (droppableDestination === "droppable3") {
    newstatus = "Confeccionando";
  }
  if (droppableDestination === "droppable4") {
    newstatus = "Em entrega";
  }
  firebase
    .firestore()
    .collection("purchases")
    .doc(task)
    .update({
      paymentStatus: newstatus,
      finalDate: moment(new Date()).format("DD/MM/YYYY"),
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
  width: "200px",
  height: "auto",
  borderRadius: 5,
});

export default class App extends Component {
  state = {
    aceitos: [],
    chamados: [],
    chamadosEmAndamento: [],
    confeccionando: [],
    emEntrega: [],
    esperandoPagamento: [],
    open: false,
    modalDataSelect: {},
    user: "",
    finalizar: false,
    selectedOrder: null,
  };

  /**
   * A semi-generic way to handle multiple lists. Matches
   * the IDs of the droppable container to the names of the
   * source arrays stored in the state.
   */
  id2List = {
    droppable: "esperandoPagamento",
    droppable2: "aceitos",
    droppable3: "confeccionando",
    droppable4: "emEntrega",
  };

  _fetchTasks(user) {
    firebase
      .firestore()
      .collection("purchases")
      .where("paymentStatus", "==", "Esperando pagamento")
      .onSnapshot((snapshot) => {
        this.setState({
          esperandoPagamento: [],
        });
        if (snapshot.empty) {
          console.log("Chamados não encontrados");
          return;
        }
        snapshot.forEach((doc) => {
          this.setState({
            esperandoPagamento: this.state.esperandoPagamento.concat({
              id: doc.data().id,
              content: doc.data().user.name,
              data: doc.data(),
              encarregados: [],
            }),
          });
        });
      });
    firebase
      .firestore()
      .collection("purchases")
      .where("paymentStatus", "==", "Aceitos")
      .onSnapshot((snapshot) => {
        this.setState({
          aceitos: [],
        });
        if (snapshot.empty) {
          console.log("Chamados não encontrados");
          return;
        }
        snapshot.forEach((doc) => {
          this.setState({
            aceitos: this.state.aceitos.concat({
              id: doc.data().id,
              content: doc.data().problema,
              data: doc.data(),
              encarregados: doc.data().encarregados,
            }),
          });
        });
      });

    firebase
      .firestore()
      .collection("purchases")
      .where("paymentStatus", "==", "Confeccionando")
      .onSnapshot((snapshot) => {
        this.setState({
          confeccionando: [],
        });
        if (snapshot.empty) {
          console.log("Chamados não encontrados");
          return;
        }
        snapshot.forEach((doc) => {
          this.setState({
            confeccionando: this.state.confeccionando.concat({
              id: doc.data().id,
              content: doc.data().problema,
              data: doc.data(),
              encarregados: doc.data().encarregados,
            }),
          });
        });
      });
    firebase
      .firestore()
      .collection("purchases")
      .where("paymentStatus", "==", "Em entrega")
      .onSnapshot((snapshot) => {
        this.setState({
          emEntrega: [],
        });
        if (snapshot.empty) {
          console.log("Chamados não encontrados");
          return;
        }
        snapshot.forEach((doc) => {
          this.setState({
            emEntrega: this.state.emEntrega.concat({
              id: doc.data().id,
              content: doc.data().problema,
              data: doc.data(),
              encarregados: doc.data().encarregados,
            }),
          });
        });
      });
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ user: user.email });
      this._fetchTasks(user.email);
    });
  }
  getList = (id) => this.state[this.id2List[id]];

  onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );
      let state = { items };
      if (source.droppableId === "droppable2") {
        state = { aceitos: items };
      }
      if (source.droppableId === "droppable3") {
        state = { confeccionando: items };
      }
      if (source.droppableId === "droppable4") {
        state = { emEntrega: items };
      }
      this.setState(state);
    } else {
      console.log(
        "getlist +===>",
        this.getList(source.droppableId),
        this.getList(destination.droppableId)
      );
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );
      if (destination.droppableId === "droppable3") {
        if (source.droppableId === "droppable2") {
          this.setState({
            aceitos: result.droppable2,
            confeccionando: result.droppable3,
          });
          return;
        }
        if (source.droppableId === "droppable") {
          this.setState({
            items: result.droppable,
            confeccionando: result.droppable3,
          });
          return;
        }
        if (source.droppableId === "droppable4") {
          this.setState({
            emEntrega: result.droppable4,
            confeccionando: result.droppable3,
          });
          return;
        }
      }
      if (destination.droppableId === "droppable") {
        if (source.droppableId === "droppable2") {
          this.setState({
            aceitos: result.droppable2,
            items: result.droppable,
          });
          return;
        }
        if (source.droppableId === "droppable3") {
          this.setState({
            items: result.droppable,
            confeccionando: result.droppable3,
          });
          return;
        }
        if (source.droppableId === "droppable4") {
          this.setState({
            emEntrega: result.droppable4,
            items: result.droppable,
          });
          return;
        }
      }
      if (destination.droppableId === "droppable2") {
        if (source.droppableId === "droppable") {
          this.setState({
            aceitos: result.droppable2,
            items: result.droppable,
          });
          return;
        }
        if (source.droppableId === "droppable3") {
          this.setState({
            aceitos: result.droppable2,
            confeccionando: result.droppable3,
          });
          return;
        }
        if (source.droppableId === "droppable4") {
          this.setState({
            emEntrega: result.droppable4,
            aceitos: result.droppable2,
          });
          return;
        }
      }
      if (destination.droppableId === "droppable4") {
        if (source.droppableId === "droppable") {
          this.setState({
            emEntrega: result.droppable4,
            items: result.droppable,
          });
          return;
        }
        if (source.droppableId === "droppable3") {
          this.setState({
            emEntrega: result.droppable4,
            confeccionando: result.droppable3,
          });
          return;
        }
        if (source.droppableId === "droppable2") {
          this.setState({
            aceitos: result.droppable2,
            emEntrega: result.droppable4,
          });
          return;
        }
      }
    }
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
  listItems(data) {
    data.pieces.forEach((piece) => {});
    return (
      <>
        {data.pieces.map((piece, idx) => (
          <>
            <p style={{ marginRight: "8px" }}>{piece.name}</p>
          </>
        ))}
      </>
    );
  }
  orderTotal(data) {
    var total = 0;
    data.pieces.forEach((piece) => {
      total += piece.amount * piece.piece.price;
    });
    return total;
  }
  orderAmount(data) {
    var total = 0;
    data.pieces.forEach((piece) => {
      total += piece.amount;
    });
    return total;
  }
  finishOrder(id) {
    firebase
      .firestore()
      .collection("purchases")
      .doc(id)
      .update({
        paymentStatus: "Finalizado",
        dataFinalizado: moment(new Date()).format("DD/MM/YYYY"),
      })
      .then(() => {
        this.setState({
          selectedOrder: null,
          finalizar: false,
        });
      })
      .catch((e) => {
        alert("Ocorreu um erro ao finalizar o pedido");
        this.setState({
          selectedOrder: null,
          finalizar: false,
        });
      });
  }
  render() {
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
        <Modal
          open={this.state.finalizar}
          onClose={() => this.setState({ finalizar: false })}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "white",
              padding: "15px",
              width: "40vw",
              maxHeight: "20vh",
              top: "0px",
              bottom: "0px",
            }}
          >
            <Typography variant="h6">
              Confirmar finalização do pedido
            </Typography>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "8px",
                justifyContent: "space-between",
                marginTop: "8px",
              }}
            >
              <Button
                onClick={() =>
                  this.setState({
                    finalizar: false,
                  })
                }
                color="secondary"
                variant="outlined"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => this.finishOrder(this.state.selectedOrder)}
                disabled={this.state.selectedOrder === null}
                color="primary"
                variant="outlined"
              >
                Finalizar
              </Button>
            </div>
          </div>
        </Modal>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <DragDropContext onDragEnd={this.onDragEnd}>
            <div className="Droppable-container">
              <div className="Droppable-Title">
                <p>Esperando pagamento</p>
              </div>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {this.state.esperandoPagamento.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <div className="task-header">
                              <p
                                style={{
                                  fontWeight: "bold",
                                  color: "grey",
                                }}
                              >
                                {item?.data?.user?.name}
                              </p>

                              {this.listItems(item.data)}
                              <Details operation={0} data={item} />
                            </div>
                            <Typography style={{ fontWeight: "600" }}>
                              {item.data.data}
                            </Typography>
                            <Typography style={{ fontWeight: "600" }}>
                              {this.orderAmount(item.data)} peças
                            </Typography>
                            <Typography style={{ fontWeight: "bold" }}>
                              {this.orderTotal(item.data).toLocaleString(
                                "en-US",
                                {
                                  style: "currency",
                                  currency: "BRL",
                                }
                              )}
                            </Typography>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
            <div className="Droppable-container">
              <div className="Droppable-Title-Em-Andamento">
                <p>Aceitos</p>
              </div>
              <Droppable droppableId="droppable2">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {this.state.aceitos.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <div className="task-header">
                              <p style={{ fontWeight: "bold", color: "grey" }}>
                                {item?.data?.user?.name}
                              </p>

                              {this.listItems(item.data)}
                              <Details operation={0} data={item} />
                            </div>{" "}
                            <Typography style={{ fontWeight: "600" }}>
                              {item.data.data}
                            </Typography>{" "}
                            <Typography style={{ fontWeight: "600" }}>
                              {this.orderAmount(item.data)} peças
                            </Typography>
                            <Typography style={{ fontWeight: "bold" }}>
                              {this.orderTotal(item.data).toLocaleString(
                                "en-US",
                                {
                                  style: "currency",
                                  currency: "BRL",
                                }
                              )}
                            </Typography>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
            <div className="Droppable-container">
              <div className="Droppable-Title-Pausado">
                <p>Confeccionando</p>
              </div>
              <Droppable droppableId="droppable3">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {this.state.confeccionando.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <div className="task-header">
                              <p style={{ fontWeight: "bold", color: "grey" }}>
                                {item?.data?.user?.name}
                              </p>

                              {this.listItems(item.data)}
                              <Details operation={0} data={item} />
                            </div>{" "}
                            <Typography style={{ fontWeight: "600" }}>
                              {item.data.data}
                            </Typography>{" "}
                            <Typography style={{ fontWeight: "600" }}>
                              {this.orderAmount(item.data)} peças
                            </Typography>
                            <Typography style={{ fontWeight: "bold" }}>
                              {this.orderTotal(item.data).toLocaleString(
                                "en-US",
                                {
                                  style: "currency",
                                  currency: "BRL",
                                }
                              )}
                            </Typography>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
            <div className="Droppable-container">
              <div className="Droppable-Title-Feito">
                <CheckIcon color="primary" size={20} />
                <p style={{ marginLeft: 7 }}>Entrega</p>
              </div>
              <Droppable droppableId="droppable4">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {this.state.emEntrega.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="done-item"
                          >
                            <div className="task-header">
                              <p style={{ fontWeight: "bold", color: "grey" }}>
                                {item?.data?.user?.name}
                              </p>

                              {this.listItems(item.data)}
                              <Details operation={0} data={item} />
                            </div>{" "}
                            <Typography style={{ fontWeight: "600" }}>
                              {item.data.data}
                            </Typography>{" "}
                            <Typography style={{ fontWeight: "600" }}>
                              {this.orderAmount(item.data)} peças
                            </Typography>
                            <Typography style={{ fontWeight: "bold" }}>
                              {this.orderTotal(item.data).toLocaleString(
                                "en-US",
                                {
                                  style: "currency",
                                  currency: "BRL",
                                }
                              )}
                            </Typography>
                            <Button
                              onClick={() =>
                                this.setState({
                                  finalizar: true,
                                  selectedOrder: item.data.id,
                                })
                              }
                              color="primary"
                              variant="outlined"
                            >
                              Finalizar
                            </Button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </DragDropContext>
        </div>
      </>
    );
  }
}
