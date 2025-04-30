import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import firebase from './../../initfirebase';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import moment from 'moment'
import CheckIcon from '@material-ui/icons/Check';
import Details from './../../components/chamadosDetails/details';
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
    console.log("droppableDestination ==>", droppableDestination)
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    console.log("removed ==>", removed)
    _updateStatus(droppableDestination.droppableId, removed.id, removed.data.creator, removed.data.creatorName)
    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;
    return result;
};
const makeNotification = async (id, status, owner, creatorName) => {
    var name;
    let getName = await firebase.firestore().collection("Users").where("email", "==", firebase.auth().currentUser.email).get()
    getName.forEach(data => {
        name = data.data().name
    })
    var message;
    if (status === "Feito") {
        message = `${name} moveu o chamado ${id} para ${status} e está aguardando sua aprovação`
    } else {
        message = `${name} moveu o chamado ${id} para ${status}`
    }
    firebase.firestore().collection("Notifications").add({
        relatedId: '',
        userName: name,
        email: owner,
        message: message,
        path: "/helpdesk/chamadosEnviados",
        isRead: false,
        id: "",
        timesTamp: new Date(),
        date: moment(new Date()).format("DD/MM/YYYY"),
    }).then(newDoc => {
        firebase.firestore().collection("Notifications").doc(newDoc.id).update({ id: newDoc.id })
    })
}

function _updateStatus(droppableDestination, task, creator, creatorName) {
    let newstatus;
    if (droppableDestination === "droppable") {
        newstatus = "A fazer"
    }
    if (droppableDestination === "droppable2") {
        newstatus = "Em andamento"
    }
    if (droppableDestination === "droppable3") {
        newstatus = "Pausado"
    }
    if (droppableDestination === "droppable4") {
        newstatus = "Feito"
    }
    firebase.firestore().collection("Chamados").doc(task).update({ status: newstatus, finalDate: moment(new Date()).format("DD/MM/YYYY") }).then(() => {
        makeNotification(task, newstatus, creator, creatorName);
        console.log("Deu bom meu mano, doc atualizado:", task, "para o status de:", newstatus)
    })
}

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    borderRadius: 3,
    // change background colour if dragging
    background: isDragging ? '#dfdfdf' : '#FAFAFA',
    boxShadow: "1px 1px 1px #9E9E9E",
    borderLeftWidth: 1,
    borderRightWidht: 1,
    borderColor: "#000000",
    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? '#8ce47a' : 'transparent',
    padding: grid,
    width: "100%",
    height: "auto",
    borderRadius: 5
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
        user: ""
    };

    /**
     * A semi-generic way to handle multiple lists. Matches
     * the IDs of the droppable container to the names of the
     * source arrays stored in the state.
     */
    id2List = {
        droppable: 'items',
        droppable2: 'selected',
        droppable3: "chamadosPausados",
        droppable4: "chamadosFeitos"
    };

    _fetchTasks(user) {
        firebase.firestore().collection("Chamados").where("encarregados", "array-contains", user).where("status", "==", "A fazer").where("hideOwner", "==", false).onSnapshot(snapshot => {
            this.setState({
                items: []
            })
            if (snapshot.empty) {
                console.log("Chamados não encontrados")
                return
            }
            snapshot.forEach(doc => {
                this.setState({
                    items: this.state.items.concat({
                        id: doc.data().id,
                        content: doc.data().problema,
                        data: doc.data(),
                        encarregados: doc.data().encarregados
                    })
                })
            })
        })
        firebase.firestore().collection("Chamados").where("encarregados", "array-contains", user).where("status", "==", "Em andamento").where("hideOwner", "==", false).onSnapshot(snapshot => {
            this.setState({
                selected: []
            })
            if (snapshot.empty) {
                console.log("Chamados não encontrados")
                return
            }
            snapshot.forEach(doc => {
                this.setState({
                    selected: this.state.selected.concat({
                        id: doc.data().id,
                        content: doc.data().problema,
                        data: doc.data(),
                        encarregados: doc.data().encarregados

                    })
                })
            })
        })

        firebase.firestore().collection("Chamados").where("encarregados", "array-contains", user).where("status", "==", "Pausado").where("hideOwner", "==", false).onSnapshot(snapshot => {
            this.setState({
                chamadosPausados: []
            })
            if (snapshot.empty) {
                console.log("Chamados não encontrados")
                return
            }
            snapshot.forEach(doc => {
                this.setState({
                    chamadosPausados: this.state.chamadosPausados.concat({
                        id: doc.data().id,
                        content: doc.data().problema,
                        data: doc.data(),
                        encarregados: doc.data().encarregados
                    })
                })
            })
        })
        firebase.firestore().collection("Chamados").where("encarregados", "array-contains", user).where("status", "==", "Feito").where("finalized", "==", false).where("hideOwner", "==", false).onSnapshot(snapshot => {
            this.setState({
                chamadosFeitos: []
            })
            if (snapshot.empty) {
                console.log("Chamados não encontrados")
                return
            }
            snapshot.forEach(doc => {
                this.setState({
                    chamadosFeitos: this.state.chamadosFeitos.concat({
                        id: doc.data().id,
                        content: doc.data().problema,
                        data: doc.data(),
                        encarregados: doc.data().encarregados
                    })
                })
            })
        })
    }

    _fetchProfilePictures(email) {
        let url;
        console.log("email ===> ", email)
        firebase.firestore().collection("Users").where("email", "==", email).get().then(snapshot => {
            if (snapshot.empty) {
                console.log("Chamados não encontrados")
                return
            }
            snapshot.forEach(photo => {
                url = photo.data().anexoURL
            })
            console.log("snapshot.data() ==>", url)
        }).then(() => {
            return url
        })
    }
    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            this.setState({ user: user.email })
            this._fetchTasks(user.email)
        })
    }
    getList = id => this.state[this.id2List[id]];

    onDragEnd = result => {
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
            if (source.droppableId === 'droppable2') {
                state = { selected: items };
            }
            if (source.droppableId === 'droppable3') {
                state = { chamadosPausados: items };
            }
            if (source.droppableId === "droppable4") {
                state = { chamadosFeitos: items }
            }
            this.setState(state);
        } else {
            console.log("getlist +===>", this.getList(source.droppableId),
                this.getList(destination.droppableId))
            const result = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );
            if (destination.droppableId === "droppable3") {
                if (source.droppableId === "droppable2") {
                    this.setState({
                        selected: result.droppable2,
                        chamadosPausados: result.droppable3,
                    });
                    return
                }
                if (source.droppableId === "droppable") {
                    this.setState({
                        items: result.droppable,
                        chamadosPausados: result.droppable3,
                    });
                    return
                }
                if (source.droppableId === "droppable4") {
                    this.setState({
                        chamadosFeitos: result.droppable4,
                        chamadosPausados: result.droppable3,
                    });
                    return
                }
            }
            if (destination.droppableId === "droppable") {
                if (source.droppableId === "droppable2") {
                    this.setState({
                        selected: result.droppable2,
                        items: result.droppable,
                    });
                    return
                }
                if (source.droppableId === "droppable3") {
                    this.setState({
                        items: result.droppable,
                        chamadosPausados: result.droppable3,
                    });
                    return
                }
                if (source.droppableId === "droppable4") {
                    this.setState({
                        chamadosFeitos: result.droppable4,
                        items: result.droppable,
                    });
                    return
                }
            }
            if (destination.droppableId === "droppable2") {
                if (source.droppableId === "droppable") {
                    this.setState({
                        selected: result.droppable2,
                        items: result.droppable,
                    });
                    return
                }
                if (source.droppableId === "droppable3") {
                    this.setState({
                        selected: result.droppable2,
                        chamadosPausados: result.droppable3,
                    });
                    return
                }
                if (source.droppableId === "droppable4") {
                    this.setState({
                        chamadosFeitos: result.droppable4,
                        selected: result.droppable2,
                    });
                    return
                }
            }
            if (destination.droppableId === "droppable4") {
                if (source.droppableId === "droppable") {
                    this.setState({
                        chamadosFeitos: result.droppable4,
                        items: result.droppable,
                    });
                    return
                }
                if (source.droppableId === "droppable3") {
                    this.setState({
                        chamadosFeitos: result.droppable4,
                        chamadosPausados: result.droppable3,
                    });
                    return
                }
                if (source.droppableId === "droppable2") {
                    this.setState({
                        selected: result.droppable2,
                        chamadosFeitos: result.droppable4,
                    });
                    return
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
                                    <h4 className="detalhesHeader">Problema:  </h4>
                                    <p>{data.problemas}</p>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <p className="detalhesHeader">Encarregados:  </p><p>{data.encarregados}</p>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <p className="detalhesHeader">Área: </p><p>{data.area}</p>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <p className="detalhesHeader">Data limite: </p><p>{data.date}</p>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <p className="detalhesHeader">ID: </p><p>{data.id}</p>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <p className="detalhesHeader">Fase atual: </p><p>{data.status}</p>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <p className="detalhesHeader">Descrição: </p><p>{data.descricao}</p>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </>
        )
    }
    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
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
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around", width: "100%" }}>
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <div className="Droppable-container">
                            <div className="Droppable-Title">
                                <p>A fazer</p>

                            </div>
                            <Droppable droppableId="droppable">
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={getListStyle(snapshot.isDraggingOver)}>
                                        {this.state.items.map((item, index) => (
                                            <Draggable
                                                key={item.id}
                                                draggableId={item.id}
                                                index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                        )}>
                                                        <div className="task-header">
                                                            <div style={{ flexDirection: "row", display: "flex" }}>
                                                                <p style={{ fontWeight: "bold", color: "grey" }}>ID: </p>
                                                                <p style={{ color: "grey" }}> {item.id}</p>
                                                            </div>
                                                            <Details operation={0} data={item.data} />
                                                        </div>
                                                        <p style={{ color: "black" }}>{item.content}</p>
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
                            <div className="Droppable-Title-Em-Andamento" >
                                <p>Em andamento</p>
                            </div>
                            <Droppable droppableId="droppable2">
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={getListStyle(snapshot.isDraggingOver)}>
                                        {this.state.selected.map((item, index) => (
                                            <Draggable
                                                key={item.id}
                                                draggableId={item.id}
                                                index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                        )}>
                                                        <div className="task-header">
                                                            <div style={{ flexDirection: "row", display: "flex" }}>
                                                                <p style={{ fontWeight: "bold", color: "grey" }}>ID: </p>
                                                                <p style={{ color: "grey" }}> {item.id}</p>
                                                            </div>
                                                            <Details operation={0} data={item.data} />
                                                        </div>
                                                        <p style={{ color: "black" }}>{item.content}</p>
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
                                <p>Pausados</p>

                            </div>
                            <Droppable droppableId="droppable3">
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={getListStyle(snapshot.isDraggingOver)}>
                                        {this.state.chamadosPausados.map((item, index) => (
                                            <Draggable
                                                key={item.id}
                                                draggableId={item.id}
                                                index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                        )}>
                                                        <div className="task-header">
                                                            <div style={{ flexDirection: "row", display: "flex" }}>
                                                                <p style={{ fontWeight: "bold", color: "grey" }}>ID: </p>
                                                                <p style={{ color: "grey" }}> {item.id}</p>
                                                            </div>
                                                            <Details operation={0} data={item.data} />
                                                        </div>
                                                        <p style={{ color: "black" }}>{item.content}</p>
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
                                <p style={{ marginLeft: 7 }} >Feitos</p>

                            </div>
                            <Droppable droppableId="droppable4">
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={getListStyle(snapshot.isDraggingOver)}>
                                        {this.state.chamadosFeitos.map((item, index) => (
                                            <Draggable
                                                key={item.id}
                                                draggableId={item.id}
                                                index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="done-item">
                                                        <div className="task-header">
                                                            <div style={{ flexDirection: "row", display: "flex" }}>
                                                                <p style={{ fontWeight: "bold", color: "grey" }}>ID: </p>
                                                                <p style={{ color: "grey" }}> {item.id}</p>
                                                            </div>
                                                            <Details operation={0} data={item.data} />
                                                        </div>
                                                        <p style={{ color: "black" }}>{item.content}</p>
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

