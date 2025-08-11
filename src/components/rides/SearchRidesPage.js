import { useState, useEffect } from 'react';
import { ridesAPI } from '../services/api';

function SearchRidesPage({ showToast }) {
    const [departure, setDeparture] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [seats, setSeats] = useState(1);
    const [rides, setRides] = useState([]);
    const [searched, setSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!departure || !destination || !date || !seats) {
            showToast('Please fill in all fields', 'warning');
            return;
        }

        setIsLoading(true);
        try {
            const response = await ridesAPI.search({
                departure,
                destination,
                date,
                seats
            });

            setRides(response.data);
            setSearched(true);

            if (response.data.length === 0) {
                showToast('No rides found for your search criteria', 'info');
            }
        } catch (error) {
            showToast('Failed to search rides. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBookRide = (ride) => {
        showToast(`Booking request sent to ${ride.driver.name}`, 'success');
        // In a real app, you would navigate to the booking page
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">Search Rides</h2>
            
            <div className="card mb-4">
                <div className="card-body">
                    <form onSubmit={handleSearch}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label htmlFor="departure" className="form-label">Departure Location</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="departure" 
                                    value={departure}
                                    onChange={(e) => setDeparture(e.target.value)}
                                    placeholder="Enter departure location"
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="destination" className="form-label">Destination</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="destination" 
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="Enter destination"
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="date" className="form-label">Date</label>
                                <input 
                                    type="date" 
                                    className="form-control" 
                                    id="date" 
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="seats" className="form-label">Number of Seats</label>
                                <select 
                                    className="form-select" 
                                    id="seats" 
                                    value={seats}
                                    onChange={(e) => setSeats(parseInt(e.target.value))}
                                    required
                                >
                                    {[1, 2, 3, 4].map(num => (
                                        <option key={num} value={num}>{num} seat{num > 1 ? 's' : ''}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">&nbsp;</label>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Searching...
                                            </>
                                        ) : 'Search Rides'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            
            {searched && (
                <div>
                    <h3 className="mb-3">Available Rides</h3>
                    {rides.length > 0 ? (
                        <div className="row">
                            {rides.map(ride => (
                                <div key={ride.id} className="col-md-6 col-lg-4 mb-4">
                                    <div className="ride-card h-100 d-flex flex-column">
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h5>{ride.driver.name}</h5>
                                                <div className="rating-stars">
                                                    {ride.driver.rating || '4.5'} <i className="bi bi-star-fill"></i>
                                                </div>
                                            </div>
                                            <p className="text-muted mb-2">{ride.driver.carModel} ({ride.driver.carNumber})</p>
                                            <div className="mb-3">
                                                <div className="d-flex align-items-center mb-1">
                                                    <i className="bi bi-geo-alt-fill text-primary me-2"></i>
                                                    <span>{ride.departure} to {ride.destination}</span>
                                                </div>
                                                <div className="d-flex align-items-center mb-1">
                                                    <i className="bi bi-calendar-fill text-primary me-2"></i>
                                                    <span>{new Date(ride.departureTime).toLocaleDateString()} at {new Date(ride.departureTime).toLocaleTimeString()}</span>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-person-fill text-primary me-2"></i>
                                                    <span>{ride.seatsAvailable} seats available</span>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span className="fw-bold">${ride.pricePerSeat}/seat</span>
                                                    <span className="text-muted">
                                                        Total: ${(ride.pricePerSeat * seats).toFixed(2)} for {seats} seat{seats > 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-auto">
                                            <button className="btn btn-primary w-100" onClick={() => handleBookRide(ride)}>
                                                Book Ride
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <i className="bi bi-search display-1 text-muted"></i>
                            <h4 className="mt-3">No rides found</h4>
                            <p className="text-muted">Try adjusting your search criteria</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchRidesPage;