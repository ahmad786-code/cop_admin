import React, { useState } from 'react'
 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { firestore } from './firebase'; // Adjusted import based on your setup
import { collection, addDoc } from 'firebase/firestore';
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

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const storage = getStorage();
        const fileRef = storageRef(storage, `concerts/${file.name}`);
        setUploading(true);

        try {
            const snapshot = await uploadBytes(fileRef, file);
            const imageUrl = await getDownloadURL(snapshot.ref);
            setImage(imageUrl);
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
                venue  // Include venue in document
            });
            console.log("Document written with ID: ", docRef.id);
            alert("Concert added successfully!");

            // Reset all fields
            setName('');
            setDescription('');
            setDate(new Date());
            setLocation('');
            setVenue('');  // Reset venue
            setImage(null);
            setFeatured(false);
        } catch (e) {
            console.error("Error adding document: ", e);
            alert("Failed to add concert.");
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
                <input type="file" onChange={handleImageUpload} disabled={uploading} />
                {uploading && <p>Uploading image...</p>}
                <label>
                    <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                    Featured
                </label>
                <button type="submit" disabled={uploading}>Add Concert</button>
            </form>
        </div>
    )
}

export default CreateConcert
