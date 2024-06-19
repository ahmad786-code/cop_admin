import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { firestore } from './firebase'; // Adjusted import based on your setup
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const CreateConcert = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState('');
    const [venue, setVenue] = useState('');
    const [featured, setFeatured] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [concerts, setConcerts] = useState([]);
    const [editConcertId, setEditConcertId] = useState(null);
    const [editFields, setEditFields] = useState({});

    useEffect(() => {
        const concertsCollection = collection(firestore, 'concerts');

        const unsubscribe = onSnapshot(concertsCollection, (snapshot) => {
            const concertsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setConcerts(concertsList);
        });

        return () => unsubscribe();
    }, []);

    const handleImageUpload = async (event, setImageFunc) => {
        const file = event.target.files[0];
        if (!file) return;

        const storage = getStorage();
        const fileRef = storageRef(storage, `concerts/${file.name}`);
        setUploading(true);

        try {
            const snapshot = await uploadBytes(fileRef, file);
            const imageUrl = await getDownloadURL(snapshot.ref);
            setImageFunc(imageUrl);
            alert('Image uploaded successfully!');
        } catch (error) {
            console.error('Failed to upload image:', error);
            alert('Failed to upload image.');
        }

        setUploading(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!image) {
            alert("Please upload an image for the concert.");
            return; // Prevent the form from submitting without an image URL
        }

        try {
            const docRef = await addDoc(collection(firestore, 'concerts'), {
                name,
                description,
                date: date.toISOString(),
                location,
                image,
                featured,
                venue // Include venue in document
            });
            console.log("Document written with ID: ", docRef.id);
            alert("Concert added successfully!");

            // Reset all fields
            setName('');
            setDescription('');
            setDate(new Date());
            setLocation('');
            setVenue(''); // Reset venue
            setImage(null);
            setFeatured(false);
        } catch (e) {
            console.error("Error adding document: ", e);
            alert("Failed to add concert.");
        }
    };

    const removeConcert = async (concertId) => {
        const concertDoc = doc(firestore, 'concerts', concertId);

        try {
            await deleteDoc(concertDoc);
        } catch (error) {
            console.error('Error removing concert: ', error);
        }
    };

    const startEditConcert = (concert) => {
        setEditConcertId(concert.id);
        setEditFields({
            name: concert.name,
            description: concert.description,
            date: new Date(concert.date),
            location: concert.location,
            venue: concert.venue,
            image: concert.image,
            featured: concert.featured,
        });
    };

    const cancelEditConcert = () => {
        setEditConcertId(null);
        setEditFields({});
    };

    const updateConcertField = async (field, value) => {
        const concertDoc = doc(firestore, 'concerts', editConcertId);

        try {
            await updateDoc(concertDoc, {
                [field]: value
            });
            alert(`${field} updated successfully!`);
            setEditFields((prev) => ({ ...prev, [field]: value }));
        } catch (error) {
            console.error(`Error updating ${field}: `, error);
            alert(`Failed to update ${field}.`);
        }
    };

    return (
        <div>
            <h1>Add New Concert</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Concert Name" />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
                <DatePicker selected={date} onChange={(date) => setDate(date)} />
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
                <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Venue" />
                <input type="file" onChange={(event) => handleImageUpload(event, setImage)} disabled={uploading} />
                {uploading && <p>Uploading image...</p>}
                <label>
                    <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                    Featured
                </label>
                <button type="submit" disabled={uploading}>Add Concert</button>
            </form>
            <h2>Current Concerts</h2>
            <ul>
                {concerts.map((concert) => (
                    <li key={concert.id}>
                        {editConcertId === concert.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editFields.name}
                                    onChange={(e) => setEditFields({ ...editFields, name: e.target.value })}
                                    placeholder="Concert Name"
                                />
                                <button onClick={() => updateConcertField('name', editFields.name)}>Update Name</button>

                                <textarea
                                    value={editFields.description}
                                    onChange={(e) => setEditFields({ ...editFields, description: e.target.value })}
                                    placeholder="Description"
                                />
                                <button onClick={() => updateConcertField('description', editFields.description)}>Update Description</button>

                                <DatePicker selected={editFields.date} onChange={(date) => setEditFields({ ...editFields, date })} />
                                <button onClick={() => updateConcertField('date', editFields.date.toISOString())}>Update Date</button>

                                <input type="text" value={editFields.location} onChange={(e) => setEditFields({ ...editFields, location: e.target.value })} placeholder="Location" />
                                <button onClick={() => updateConcertField('location', editFields.location)}>Update Location</button>

                                <input type="text" value={editFields.venue} onChange={(e) => setEditFields({ ...editFields, venue: e.target.value })} placeholder="Venue" />
                                <button onClick={() => updateConcertField('venue', editFields.venue)}>Update Venue</button>

                                <input type="file" onChange={(event) => handleImageUpload(event, (url) => setEditFields({ ...editFields, image: url }))} disabled={uploading} />
                                <button onClick={() => updateConcertField('image', editFields.image)}>Update Image</button>

                                <label>
                                    <input
                                        type="checkbox"
                                        checked={editFields.featured}
                                        onChange={(e) => setEditFields({ ...editFields, featured: e.target.checked })}
                                    />
                                    Featured
                                </label>
                                <button onClick={() => updateConcertField('featured', editFields.featured)}>Update Featured</button>

                                <button onClick={cancelEditConcert}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                {concert.name} - {concert.date}
                                <button onClick={() => startEditConcert(concert)}>Edit</button>
                                <button onClick={() => removeConcert(concert.id)}>Remove</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CreateConcert;
