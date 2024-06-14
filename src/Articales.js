import React, {useEffect, useState} from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { firestore } from './firebase'; 
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const Articales = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [image, setImage] = useState(null);
    const [isFeatured, setIsFeatured] = useState(false);
    const [uploading, setUploading] = useState(false);


    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            alert("Please select a file.");
            return;
        }

        const storage = getStorage();
        const fileRef = storageRef(storage, `articles/${file.name}`);
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
        
        // Simple validation
        if (!name || !description || !image) {
            alert("Please complete all fields and upload an image for the article.");
            return;
        }

        setUploading(true); // Indicate that data processing is starting

        try {
            const docRef = await addDoc(collection(firestore, 'articles'), {
                name,
                description,
                date: date.toISOString(),
                image,
                isFeatured  // Save whether the article is featured
            });
            console.log("Document written with ID: ", docRef.id);
            alert("Article added successfully!");

            // Reset all fields after successful submission
            setName('');
            setDescription('');
            setDate(new Date());
            setImage(null);
            setIsFeatured(false);
        } catch (e) {
            console.error("Error adding document: ", e);
            alert("Failed to add article.");
        }

        setUploading(false); // Reset uploading state
    };

  return (
    <div>
    <h1>Add New Article</h1>
    <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Article Name" required />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
        <DatePicker selected={date} onChange={(date) => setDate(date)} />
        <input type="file" onChange={handleImageUpload} disabled={uploading} required />
        {uploading ? <p>Uploading image...</p> : <button type="submit">Add Article</button>}
        <label>
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
            Featured Article
        </label>
    </form>
</div>
  )
}

export default Articales