import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import firebase from './../../initfirebase';
import logo from './../../assets/img/Logos/safira.png'

export default function Login() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const login = async () => {
        setIsLoading(true);
        firebase.auth().sendPasswordResetEmail(email).then(() => {
            setIsLoading(false);
        }).catch(e => {
            setIsLoading(false);
            console.log(e)
        })
    }
    return (
        <div className="wrap-home-page">
            <div className="flex-wrapper-div" >
                <div className="flex-div-left">
                    <div className="div-image-wrapper">
                    <img src={logo} alt=''  />
                    </div>
                    <label style={{ paddingLeft: 5 }}>Insira seu E-mail para redefinir a senha</label>
                    <input name="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" className="login-input" />
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <button onClick={() => login()} className="login-button">
                            Enviar
                    <>
                                {
                                    isLoading === true ? <div style={{ marginLeft: 7, marginRight: 7 }}><ClipLoader color="#FFFFFF" size={25} /></div> : null
                                }
                            </>
                        </button>
                    </div>
                </div>
                <div className="flex-div-right">

                </div>
            </div>
        </div>
    );
};