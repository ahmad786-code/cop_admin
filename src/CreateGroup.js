// import React, { useState, useEffect } from 'react';
// import { firestore, database } from './firebase'; // adjust the path as necessary
// import { collection, getDocs, addDoc, updateDoc, doc, arrayUnion } from 'firebase/firestore';

// const CreateGroup = () => {
//     const [groupName, setGroupName] = useState('');
//     const [users, setUsers] = useState([]);
//     const [selectedUsers, setSelectedUsers] = useState([]);
//     const [error, setError] = useState('');
//     const [isLoading, setIsLoading] = useState(false);


//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const usersCollection = collection(firestore, 'users');
//                 const snapshot = await getDocs(usersCollection);
//                 const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//                 setUsers(usersList);
//             } catch (error) {
//                 setError('Failed to fetch users');
//                 console.error(error);
//             }
//         };
//         fetchUsers();
//     }, []);

//     const handleCreateGroup = async () => {
//         setIsLoading(true);
//         setError('');
//         try {
//             const groupData = {
//                 groupName,
//                 createdAt: new Date().toISOString(),
//                 createdBy: selectedUsers,
//                 members: selectedUsers,
//                 chatImage: "",
//                 latestMessageText: 'Welcome to the group!',
//                 updatedAt: new Date().toISOString(),
//             };
            
//             // Add the group to Firestore
//             const groupsCollection = collection(firestore, 'groups');
//             const newGroupRef = await addDoc(groupsCollection, groupData);

//             // Update each selected user's document to include the new group
//             const userUpdates = selectedUsers.map(async (userId) => {
//                 const userRef = doc(firestore, 'users', userId);
//                 await updateDoc(userRef, {
//                     groups: arrayUnion(newGroupRef.id)
//                 });
//             });
//             await Promise.all(userUpdates);

//             console.log('Group created with ID:', newGroupRef.id);
//             alert('Group created successfully!');
//             setGroupName('');
//             setSelectedUsers([]);
//             setIsLoading(false);
//         } catch (error) {
//             setError('Error creating group');
//             console.error(error);
//             setIsLoading(false);
//         }
//     };

   
//         return (
//             <div>
//                 <h1>Create Group</h1>
//                 <input 
//                     type="text" 
//                     value={groupName} 
//                     onChange={(e) => setGroupName(e.target.value)} 
//                     placeholder="Group Name" 
//                 />
//                 <div>
//                     <h2>Select Users</h2>
//                     {users.map(user => (
//                         <div key={user.id}>
//                             <input
//                                 type="checkbox"
//                                 value={user.id}
//                                 checked={selectedUsers.includes(user.id)}
//                                 onChange={(e) => {
//                                     const id = user.id;
//                                     setSelectedUsers(prev => 
//                                         e.target.checked ? [...prev, id] : prev.filter(uid => uid !== id)
//                                     );
//                                 }}
//                             />
//                             {user.userName}
//                         </div>
//                     ))}
//                 </div>
//                 {error && <p style={{ color: 'red' }}>{error}</p>}
//                 <button onClick={handleCreateGroup} disabled={isLoading}>
//                     {isLoading ? 'Creating...' : 'Create Group'}
//                 </button>
//             </div>
//         );
   
// };

// export default CreateGroup;
// import React, { useState, useEffect } from 'react';
// import { firestore } from './firebase'; // adjust the path as necessary
// import { collection, getDocs, addDoc, updateDoc, doc, arrayUnion } from 'firebase/firestore';

// const CreateGroup = () => {
//     const [groupName, setGroupName] = useState('');
//     const [users, setUsers] = useState([]);
//     const [selectedUsers, setSelectedUsers] = useState([]);
//     const [error, setError] = useState('');
//     const [isLoading, setIsLoading] = useState(false);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const usersCollection = collection(firestore, 'users');
//                 const snapshot = await getDocs(usersCollection);
//                 const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//                 // Filter users with hasParticipatePhoto === true
//                 const filteredUsers = usersList.filter(user => user.hasParticipatePhoto);
//                 setUsers(filteredUsers);
//             } catch (error) {
//                 setError('Failed to fetch users');
//                 console.error(error);
//             }
//         };
//         fetchUsers();
//     }, []);

//     const handleCreateGroup = async () => {
//         setIsLoading(true);
//         setError('');
//         try {
//             const groupData = {
//                 groupName,
//                 createdAt: new Date().toISOString(),
//                 createdBy: selectedUsers,
//                 members: selectedUsers,
//                 chatImage: "",
//                 latestMessageText: 'Welcome to the group!',
//                 updatedAt: new Date().toISOString(),
//             };
            
//             // Add the group to Firestore
//             const groupsCollection = collection(firestore, 'groups');
//             const newGroupRef = await addDoc(groupsCollection, groupData);

//             // Update each selected user's document to include the new group
//             const userUpdates = selectedUsers.map(async (userId) => {
//                 const userRef = doc(firestore, 'users', userId);
//                 await updateDoc(userRef, {
//                     groups: arrayUnion(newGroupRef.id)
//                 });
//             });
//             await Promise.all(userUpdates);

//             console.log('Group created with ID:', newGroupRef.id);
//             alert('Group created successfully!');
//             setGroupName('');
//             setSelectedUsers([]);
//             setIsLoading(false);
//         } catch (error) {
//             setError('Error creating group');
//             console.error(error);
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div>
//             <h1>Create Group</h1>
//             <input 
//                 type="text" 
//                 value={groupName} 
//                 onChange={(e) => setGroupName(e.target.value)} 
//                 placeholder="Group Name" 
//             />
//             <div>
//                 <h2>Select Users</h2>
//                 {users.map(user => (
//                     <div key={user.id}>
//                         <input
//                             type="checkbox"
//                             value={user.id}
//                             checked={selectedUsers.includes(user.id)}
//                             onChange={(e) => {
//                                 const id = user.id;
//                                 setSelectedUsers(prev => 
//                                     e.target.checked ? [...prev, id] : prev.filter(uid => uid !== id)
//                                 );
//                             }}
//                         />
//                         {user.userName}
//                     </div>
//                 ))}
//             </div>
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//             <button onClick={handleCreateGroup} disabled={isLoading}>
//                 {isLoading ? 'Creating...' : 'Create Group'}
//             </button>
//         </div>
//     );
// };

// export default CreateGroup;

import React, { useState, useEffect } from 'react';
import { firestore } from './firebase'; // Adjust the path as necessary
import { collection, getDocs, addDoc, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CreateGroup = () => {
    const [groupName, setGroupName] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [groupPhoto, setGroupPhoto] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(firestore, 'users');
                const snapshot = await getDocs(usersCollection);
                const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Filter users with hasParticipatePhoto === true
                const filteredUsers = usersList.filter(user => user.hasParticipatePhoto);
                setUsers(filteredUsers);
            } catch (error) {
                setError('Failed to fetch users');
                console.error(error);
            }
        };

        const fetchGroups = async () => {
            try {
                const groupsCollection = collection(firestore, 'groups');
                const snapshot = await getDocs(groupsCollection);
                const groupsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setGroups(groupsList);
            } catch (error) {
                setError('Failed to fetch groups');
                console.error(error);
            }
        };

        fetchUsers();
        fetchGroups();
    }, []);

    const handleCreateGroup = async () => {
        setIsLoading(true);
        setError('');
        try {
            const groupData = {
                groupName,
                createdAt: new Date().toISOString(),
                createdBy: selectedUsers,
                members: selectedUsers,
                chatImage: groupPhoto || "",
                latestMessageText: 'Welcome to the group!',
                updatedAt: new Date().toISOString(),
            };

            // Add the group to Firestore
            const groupsCollection = collection(firestore, 'groups');
            const newGroupRef = await addDoc(groupsCollection, groupData);

            // Update each selected user's document to include the new group
            const userUpdates = selectedUsers.map(async (userId) => {
                const userRef = doc(firestore, 'users', userId);
                await updateDoc(userRef, {
                    groups: arrayUnion(newGroupRef.id)
                });
            });
            await Promise.all(userUpdates);

            console.log('Group created with ID:', newGroupRef.id);
            alert('Group created successfully!');
            setGroupName('');
            setSelectedUsers([]);
            setIsLoading(false);
        } catch (error) {
            setError('Error creating group');
            console.error(error);
            setIsLoading(false);
        }
    };

    const handleAddUserToGroup = async (userId) => {
        if (!selectedGroup) return;

        try {
            const groupRef = doc(firestore, 'groups', selectedGroup.id);
            await updateDoc(groupRef, {
                members: arrayUnion(userId)
            });

            const userRef = doc(firestore, 'users', userId);
            await updateDoc(userRef, {
                groups: arrayUnion(selectedGroup.id)
            });

            alert('User added to group successfully!');
        } catch (error) {
            setError('Error adding user to group');
            console.error(error);
        }
    };

    const handleRemoveUserFromGroup = async (userId) => {
        if (!selectedGroup) return;

        try {
            const groupRef = doc(firestore, 'groups', selectedGroup.id);
            await updateDoc(groupRef, {
                members: arrayRemove(userId)
            });

            const userRef = doc(firestore, 'users', userId);
            await updateDoc(userRef, {
                groups: arrayRemove(selectedGroup.id)
            });

            alert('User removed from group successfully!');
        } catch (error) {
            setError('Error removing user from group');
            console.error(error);
        }
    };

    const handleUpdateGroupName = async () => {
        if (!selectedGroup || !groupName) return;

        try {
            const groupRef = doc(firestore, 'groups', selectedGroup.id);
            await updateDoc(groupRef, {
                groupName,
                updatedAt: new Date().toISOString()
            });

            alert('Group name updated successfully!');
        } catch (error) {
            setError('Error updating group name');
            console.error(error);
        }
    };

    const handlePickGroupPhoto = (event) => {
        if (event.target.files.length > 0) {
            setGroupPhoto(event.target.files[0]);
        }
    };

    const handleUploadGroupPhoto = async () => {
        if (!groupPhoto || !selectedGroup) return;

        setIsLoading(true);

        try {
            const storage = getStorage();
            const storageRef = ref(storage, `groupPhotos/${selectedGroup.id}`);

            await uploadBytes(storageRef, groupPhoto);
            const downloadURL = await getDownloadURL(storageRef);

            const groupRef = doc(firestore, 'groups', selectedGroup.id);
            await updateDoc(groupRef, {
                chatImage: downloadURL,
                updatedAt: new Date().toISOString()
            });

            alert('Group photo updated successfully!');
        } catch (error) {
            setError('Error uploading group photo');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Create Group</h1>
            <input 
                type="text" 
                value={groupName} 
                onChange={(e) => setGroupName(e.target.value)} 
                placeholder="Group Name" 
            />
            <div>
                <h2>Select Users</h2>
                {users.map(user => (
                    <div key={user.id}>
                        <input
                            type="checkbox"
                            value={user.id}
                            checked={selectedUsers.includes(user.id)}
                            onChange={(e) => {
                                const id = user.id;
                                setSelectedUsers(prev => 
                                    e.target.checked ? [...prev, id] : prev.filter(uid => uid !== id)
                                );
                            }}
                        />
                        {user.userName}
                    </div>
                ))}
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={handleCreateGroup} disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Group'}
            </button>

            <h1>Existing Groups</h1>
            <div>
                {groups.map(group => (
                    <div key={group.id}>
                        <h2>{group.groupName}</h2>
                        <button onClick={() => setSelectedGroup(group)}>Select</button>
                    </div>
                ))}
            </div>

            {selectedGroup && (
                <div>
                    <h1>Manage Group: {selectedGroup.groupName}</h1>
                    <input 
                        type="text" 
                        value={groupName} 
                        onChange={(e) => setGroupName(e.target.value)} 
                        placeholder="New Group Name" 
                    />
                    <button onClick={handleUpdateGroupName}>Update Group Name</button>
                    <div>
                        <h2>Group Members</h2>
                        {selectedGroup.members.map(userId => {
                            const user = users.find(user => user.id === userId);
                            return (
                                <div key={userId}>
                                    {user ? user.userName : 'Unknown User'}
                                    <button onClick={() => handleRemoveUserFromGroup(userId)}>Remove</button>
                                </div>
                            );
                        })}
                    </div>
                    <div>
                        <h2>Add User to Group</h2>
                        {users.filter(user => !selectedGroup.members.includes(user.id)).map(user => (
                            <div key={user.id}>
                                {user.userName}
                                <button onClick={() => handleAddUserToGroup(user.id)}>Add</button>
                            </div>
                        ))}
                    </div>
                    <div>
                        <input type="file" onChange={handlePickGroupPhoto} />
                        {groupPhoto && <img src={URL.createObjectURL(groupPhoto)} alt="Group Photo" style={{ width: 100, height: 100 }} />}
                        <button onClick={handleUploadGroupPhoto} disabled={isLoading}>
                            {isLoading ? 'Uploading...' : 'Upload Group Photo'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateGroup;
