import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Pagination } from "react-bootstrap";
import "./Appointments.css";

const Events = (props) => {
    // State to store the events
    const [events, setEvents] = useState([]);
    // State to track the current page
    const [currentPage, setCurrentPage] = useState(1);
    // Number of events per page
    const eventsPerPage = 6;

    // Function to fetch events from the blockchain
    const fetchEvents = async () => {
        try {
            // Fetch events data from the blockchain
            // Replace the following line with your actual code to fetch events
            const eventsData = await fetchEventDataFromBlockchain();

            // Set the events state with the fetched data
            setEvents(eventsData);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useEffect(() => {
        // Fetch events when the component mounts
        fetchEvents();
    }, []);

    // Dummy function to simulate fetching events from the blockchain
    const fetchEventDataFromBlockchain = async () => {
        // Replace this with your actual code to fetch events from the blockchain
        // For demonstration purposes, returning dummy data
        return [
            { id: 1, name: "Event 1", date: "2024-05-10", location: "Virtual", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et lorem id magna gravida tempus." },
            { id: 2, name: "Event 2", date: "2024-05-15", location: "Conference Hall", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et lorem id magna gravida tempus." },
            { id: 3, name: "Event 3", date: "2024-05-20", location: "Online", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et lorem id magna gravida tempus." },
            // Add more dummy data as needed
            { id: 1, name: "Event 1", date: "2024-05-10", location: "Virtual", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et lorem id magna gravida tempus." },
            { id: 2, name: "Event 2", date: "2024-05-15", location: "Conference Hall", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et lorem id magna gravida tempus." },
            { id: 3, name: "Event 3", date: "2024-05-20", location: "Online", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et lorem id magna gravida tempus." },
            // Add more dummy data as needed
        ];
    };

    // Calculate index of the last event on the current page
    const indexOfLastEvent = currentPage * eventsPerPage;
    // Calculate index of the first event on the current page
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    // Get the events for the current page
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Container className="events-container">
            <h1 className="text-center">Events</h1>
            <Row xs={1} sm={2} md={3} lg={3} xl={3} className="g-4">
                {/* Map through the events array and render each event */}
                {currentEvents.map(event => (
                    <Col key={event.id}>
                        <Card className="h-100">
                            <Card.Body>
                                <Card.Title>{event.name}</Card.Title>
                                <Card.Text><strong>Date:</strong> {event.date}</Card.Text>
                                <Card.Text><strong>Location:</strong> {event.location}</Card.Text>
                                <Card.Text>{event.description}</Card.Text>
                                <Button variant="primary">Register</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4">
                <Pagination>
                    {Array.from({ length: Math.ceil(events.length / eventsPerPage) }, (_, i) => (
                        <Pagination.Item key={i + 1} onClick={() => paginate(i + 1)} active={i + 1 === currentPage}>
                            {i + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            </div>
        </Container>
    );
};

export default Events;
