import React, { useState } from 'react';
import {Nav, Button, Modal, Card, ModalHeader, NavItem, TabContent, TabPane, ModalBody } from 'reactstrap';
import SignIn from './SignIn';
import { NavLink } from 'react-router-dom';
import SignUp from './SignUp';

function LoginButton(props) {
    const [loginmodal, setLogin] = useState(false);
    const toggleModal = () => {
        setLogin(!loginmodal);
    }
    const [activeTab, setActive] = useState("1");
    const toggleTab = tab => {
        if (activeTab !== tab)
            setActive(tab);
    }
    return (
        <div>
            {props.user != null
                ?
                <Button className="nav-link btn-login" onClick={props.logout}>
                    <span className="fa fa-sign-out fa-lg"></span> Logout
                </Button>
                :
                <Button className="nav-link btn-login" onClick={toggleModal}>
                    <span className="fa fa-sign-in fa-lg"></span> Login
                </Button>
            }
            <Modal isOpen={loginmodal} toggle={toggleModal} size="lg" >
                <ModalHeader>
                    <div className="row">
                        <div className="col-6">
                            <Button outline block color="link" onClick={() => toggleTab("1")} >SignIn</Button>
                        </div>
                        <div className="col-6">
                            <Button block outline color="link" onClick={() => toggleTab("2")} >SignUp</Button>
                        </div>
                    </div>
                </ModalHeader>
                <ModalBody>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                        <Card>
                            <SignIn signin={props.signin}/>
                        </Card>
                    </TabPane>
                    <TabPane tabId="2">
                        <Card>
                            <SignUp signin={props.signup} />
                        </Card>
                    </TabPane>
                </TabContent>
                </ModalBody>
            </Modal>
        </div>
    );
}

export default LoginButton;