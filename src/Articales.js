import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { firestore } from './firebase'; // Adjust the path as necessary
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const Articles = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [image, setImage] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [editArticleId, setEditArticleId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDate, setEditDate] = useState(new Date());
  const [editIsFeatured, setEditIsFeatured] = useState(false);
  const [editImage, setEditImage] = useState(null);

  useEffect(() => {
    const articlesCollection = collection(firestore, 'articles');

    const unsubscribe = onSnapshot(articlesCollection, (snapshot) => {
      const articlesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setArticles(articlesList);
    });

    return () => unsubscribe();
  }, []);

  const handleImageUpload = async (event, setImageFunc) => {
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

    if (!name || !description || !image) {
      alert("Please complete all fields and upload an image for the article.");
      return;
    }

    setUploading(true);

    try {
      const docRef = await addDoc(collection(firestore, 'articles'), {
        name,
        description,
        date: date.toISOString(),
        image,
        isFeatured
      });
      console.log("Document written with ID: ", docRef.id);
      alert("Article added successfully!");

      setName('');
      setDescription('');
      setDate(new Date());
      setImage(null);
      setIsFeatured(false);
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Failed to add article.");
    }

    setUploading(false);
  };

  const removeArticle = async (articleId) => {
    const articleDoc = doc(firestore, 'articles', articleId);

    try {
      await deleteDoc(articleDoc);
    } catch (error) {
      console.error('Error removing article: ', error);
    }
  };

  const startEditArticle = (article) => {
    setEditArticleId(article.id);
    setEditName(article.name);
    setEditDescription(article.description);
    setEditDate(new Date(article.date));
    setEditIsFeatured(article.isFeatured);
    setEditImage(article.image);
  };

  const cancelEditArticle = () => {
    setEditArticleId(null);
    setEditName('');
    setEditDescription('');
    setEditDate(new Date());
    setEditIsFeatured(false);
    setEditImage(null);
  };

  const updateArticleField = async (field, value) => {
    if (!editArticleId) return;

    const articleDoc = doc(firestore, 'articles', editArticleId);

    try {
      await updateDoc(articleDoc, {
        [field]: value
      });
      alert("Article updated successfully!");
    } catch (error) {
      console.error(`Error updating article ${field}: `, error);
      alert(`Failed to update article ${field}.`);
    }
  };

  return (
    <div>
      <h1>Add New Article</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Article Name" required />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
        <DatePicker selected={date} onChange={(date) => setDate(date)} />
        <input type="file" onChange={(event) => handleImageUpload(event, setImage)} disabled={uploading} required />
        {uploading ? <p>Uploading image...</p> : <button type="submit">Add Article</button>}
        <label>
          <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
          Featured Article
        </label>
      </form>
      <h2>Current Articles</h2>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>
            {editArticleId === article.id ? (
              <div>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Article Name"
                  onBlur={() => updateArticleField('name', editName)}
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description"
                  onBlur={() => updateArticleField('description', editDescription)}
                />
                <DatePicker 
                  selected={editDate} 
                  onChange={(date) => {
                    setEditDate(date);
                    updateArticleField('date', date.toISOString());
                  }} 
                />
                <input 
                  type="file" 
                  onChange={(event) => handleImageUpload(event, setEditImage)} 
                  disabled={uploading} 
                />
                <label>
                  <input
                    type="checkbox"
                    checked={editIsFeatured}
                    onChange={(e) => {
                      setEditIsFeatured(e.target.checked);
                      updateArticleField('isFeatured', e.target.checked);
                    }}
                  />
                  Featured Article
                </label>
                <button onClick={cancelEditArticle}>Cancel</button>
              </div>
            ) : (
              <div>
                {article.name} - {article.date}
                <button onClick={() => startEditArticle(article)}>Edit</button>
                <button onClick={() => removeArticle(article.id)}>Remove</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Articles;
