import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Chat() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [selectedPersonId, setSelectedPersonId] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [userName, setUserName] = useState('');
    const [people, setPeople] = useState([]);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const navigate = useNavigate();

    const logout = () => {
        navigate('/');
    };

    const selectedPerson = people.find(person => person.id === selectedPersonId);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setPeople(prevPeople =>
            prevPeople.map(person =>
                person.id === selectedPersonId
                    ? { ...person, text: [...person.text, [newMessage, 2, time]] }
                    : person
            )
        );

        setNewMessage('');
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await axios.get('http://localhost:5000/api/users/process-name', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const { firstName, lastName } = userResponse.data;
                setUserName(`${firstName} ${lastName}`);
        
                const peopleResponse = await axios.get('http://localhost:5000/api/users/people-list', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setPeople(peopleResponse.data.people);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <div className="px-9 py-5 border-b" style={{ borderBottom: '0.8px solid #DBDDE1' }}>
                <div className="text-right pb-1 flex items-center justify-end space-x-3">
                    <i className="fa-regular fa-circle-user fa-2x" style={{ color: '#475467' }}></i>
                    <span className='text-[#1F384C]'>{userName}</span>
                    <i
                        className="fa-solid fa-angle-down cursor-pointer"
                        style={{ color: '#475467' }}
                        onClick={toggleDropdown}
                    ></i>
                </div>
                {isDropdownOpen && (
                    <div className="absolute right-9 w-48 bg-white border border-gray-300 shadow-lg rounded-md">
                        <ul>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" style={{ color: '#FF3742' }}>
                                <button onClick={logout}>
                                    <i className="fa-solid fa-arrow-right-from-bracket me-2"></i>
                                    Log Out
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
            <div className="flex flex-grow">
                <div className="w-1/3 border-r flex flex-col border-gray-300">
                    <div className="relative text-gray-500 border-b p-3">
                        <input
                            type="text"
                            className="border border-gray-300 rounded-lg w-full pl-12 py-2 focus:outline-none focus:ring-gray-300 text-sm md:pl-12 md:text-base"
                            placeholder="Search"
                        />
                        <i className="fa-solid fa-magnifying-glass absolute top-1/2 left-8 transform -translate-y-1/2 md:text-sm"></i>
                    </div>
                    {people.map(person => (
                        <div
                            key={person.id}
                            className={`flex items-center space-x-3 p-5 cursor-pointer ${selectedPersonId === person.id ? 'bg-gray-200' : ''} hover:bg-gray-100`}
                            onClick={() => setSelectedPersonId(person.id)}
                        >
                            <div className="relative">
                                <i className="fa-regular fa-circle-user fa-2x text-[#475467]"></i>
                                {person.status === 'Online' && (
                                    <div className="absolute right-0 top-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                )}
                            </div>
                            <span className="text-[#344054]">{person.name}</span>
                        </div>
                    ))}
                </div>
                <div className="w-2/3 flex flex-col">
                    <div className="flex flex-col flex-grow">
                        {selectedPerson ? (
                            <div className="flex flex-col flex-grow">
                                <div className="flex items-center border-b p-2">
                                    <div className="relative">
                                        <i className="fa-regular fa-circle-user fa-2x text-[#475467]"></i>
                                        {selectedPerson.status === 'Online' && (
                                            <div className="absolute right-0 top-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                        )}
                                    </div>
                                    <div className="pl-4">
                                        <div className="text-[#344054]">{selectedPerson.name}</div>
                                        {selectedPerson.status === 'Online' && (
                                            <div className="text-tiny text-gray-500">{selectedPerson.status}</div>
                                        )}
                                    </div>
                                </div>
                                {selectedPerson.text.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center">
                                        <i className="fa-regular fa-message fa-6x pb-5 text-gray-300"></i>
                                        <div className="text-[20px] text-gray-500">
                                            You haven't started chatting yet
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col space-y-2 px-8 py-1">
                                        {selectedPerson.text.map(([text, sender, time], index) => (
                                            <div key={index} className={`flex ${sender === 1 ? 'justify-start' : 'justify-end'} p-2`}>
                                                {sender === 1 && (
                                                    <div className="flex items-center">
                                                        <i className="fa-regular fa-circle-user fa-2x mr-2 text-[#475467]"></i>
                                                        <div className='flex flex-col items-start'>
                                                            <div className='bg-gray-200 text-[#344054] p-3 rounded-lg max-w-xs'>
                                                                {text}
                                                            </div>
                                                            <div className='text-xs text-gray-500'>
                                                                <i className="fa-solid fa-check-double px-2 text-blue-600"></i>
                                                                {time}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {sender === 2 && (
                                                    <div>
                                                        <div className='flex flex-col items-end'>
                                                            <div className='bg-blue-100 text-[#344054] p-3 rounded-lg max-w-xs'>
                                                                {text}
                                                            </div>
                                                            <div className='text-xs text-gray-500'>
                                                                <i className="fa-solid fa-check-double px-2 text-blue-600"></i>
                                                                {time}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-auto p-3 flex">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="border border-gray-300 rounded-3xl px-4 focus:outline-none focus:ring-[#26B7CD] w-full"
                                        placeholder="Type your message"
                                    />
                                    <button
                                        className="px-2 text-gray-400 hover:text-[#475467] transition-colors duration-200"
                                        onClick={handleSendMessage}
                                    >
                                        <i className="fa-solid fa-paper-plane"></i>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                                <i className="fa-regular fa-message fa-6x pb-5 text-gray-300"></i>
                                <div className="text-[20px] text-gray-500">No chats here yet…</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;