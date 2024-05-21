import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Card, ListGroup } from 'react-bootstrap';
import { useState } from 'react';

const Modals = (props) => {
    return (
        <Modal show={props.show} onHide={props.handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Détails du patient</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Card>
                    <Card.Header className="bg-primary text-white">Informations générales</Card.Header>
                    <ListGroup variant="flush">
                        <ListGroup.Item><strong>ID du patient:</strong> {props.data1["Informations du patient"]["ID du patient"]}</ListGroup.Item>
                        <ListGroup.Item><strong>Nom:</strong> {props.data1["Informations du patient"].Nom}</ListGroup.Item>
                        <ListGroup.Item><strong>Date de naissance:</strong> {props.data1["Informations du patient"]["Date de naissance"]}</ListGroup.Item>
                        <ListGroup.Item><strong>Sexe:</strong> {props.data1["Informations du patient"].Sexe}</ListGroup.Item>
                        <ListGroup.Item><strong>Adresse:</strong> {props.data1["Informations du patient"].Adresse}</ListGroup.Item>
                        <ListGroup.Item><strong>Contact:</strong> Téléphone: {props.data1["Informations du patient"].Contact.Téléphone}, Email: {props.data1["Informations du patient"].Contact.Email}</ListGroup.Item>
                        <ListGroup.Item><strong>Contact d'urgence:</strong> {props.data1["Informations du patient"]["Contact d'urgence"].Nom} ({props.data1["Informations du patient"]["Contact d'urgence"].Relation}), Téléphone: {props.data1["Informations du patient"]["Contact d'urgence"].Téléphone}</ListGroup.Item>
                        <ListGroup.Item><strong>Assurance:</strong> {props.data1["Informations du patient"].Assurance.Fournisseur}, Numéro de police: {props.data1["Informations du patient"].Assurance["Numéro de police"]}, Numéro de groupe: {props.data1["Informations du patient"].Assurance["Numéro de groupe"]}</ListGroup.Item>
                    </ListGroup>
                </Card>
                <Card className="mt-3">
                    <Card.Header className="bg-primary text-white">Dossiers médicaux</Card.Header>
                    <ListGroup variant="flush">
                        {props.data1["Dossiers médicaux"].map((record, index) => (
                            <ListGroup.Item key={index}>
                                <strong>Dossier {record.id}</strong>
                                <br />
                                <strong>Date:</strong> {record.date}
                                <br />
                                <strong>Diagnostic:</strong> {record.diagnosis}
                                <br />
                                <strong>Docteur:</strong> {record.doctor.name} ({record.doctor.speciality}) - {record.doctor.hospital}
                                <br />
                                <strong>Traitement:</strong>
                                <ul>
                                    {record.treatment.medicines.map((medication, idx) => (
                                        <li key={idx}>
                                            {medication} - {record.treatment.dosage}, {record.treatment.frequency}
                                        </li>
                                    ))}
                                </ul>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Fermer
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Modals;
