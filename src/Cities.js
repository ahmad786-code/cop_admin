import React, { useEffect, useState } from 'react'
import { firestore } from './firebase';
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const Cities = () => {
    const [cityName, setCityName] = useState('');
    const [cities, setCities] = useState([]);
    const [editCityId, setEditCityId] = useState(null);
    const [editCityName, setEditCityName] = useState('');

    useEffect(() => {
        const citiesCollection = collection(firestore, 'cities');

        const unsubscribe = onSnapshot(citiesCollection, (snapshot) => {
            const citiesList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCities(citiesList);
        });

        return () => unsubscribe();
    }, []);

    const addCity = async () => {
        if (cityName.trim() === '') return;

        const citiesCollection = collection(firestore, 'cities');

        try {
            await addDoc(citiesCollection, { name: cityName });
            setCityName('');
        } catch (error) {
            console.error('Error adding city: ', error);
        }
    };

    const removeCity = async (cityId) => {
        const cityDoc = doc(firestore, 'cities', cityId);

        try {
            await deleteDoc(cityDoc);
        } catch (error) {
            console.error('Error removing city: ', error);
        }
    };

    const startEditCity = (cityId, currentName) => {
        setEditCityId(cityId);
        setEditCityName(currentName);
    };

    const cancelEditCity = () => {
        setEditCityId(null);
        setEditCityName('');
    };

    const updateCity = async () => {
        if (editCityName.trim() === '') return;

        const cityDoc = doc(firestore, 'cities', editCityId);

        try {
            await updateDoc(cityDoc, { name: editCityName });
            cancelEditCity();
        } catch (error) {
            console.error('Error updating city: ', error);
        }
    };

    return (
        <div>
            <h1>Add City</h1>
            <input
                type="text"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                placeholder="City Name"
            />
            <button onClick={addCity}>Add City</button>
            <h2>Current Cities</h2>
            <ul>
                {cities.map((city) => (
                    <li key={city.id}>
                        {editCityId === city.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editCityName}
                                    onChange={(e) => setEditCityName(e.target.value)}
                                />
                                <button onClick={updateCity}>Update</button>
                                <button onClick={cancelEditCity}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                {city.name}
                                <button onClick={() => startEditCity(city.id, city.name)}>Edit</button>
                                <button onClick={() => removeCity(city.id)}>Remove</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Cities