import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

function Chat() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [selectedPersonName, setSelectedPersonName] = useState(null);
    const [people, setPeople] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }

                const userResponse = await axios.get('http://localhost:5000/api/users/process-name', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const { firstName, lastName } = userResponse.data;
                setUserName(`${firstName} ${lastName}`);

                const peopleResponse = await axios.get('http://localhost:5000/api/users/people-list', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setPeople(peopleResponse.data.people);
            } catch (error) {
                console.error('Error fetching user data:', error);
                localStorage.clear();
                alert('Session expired. Please log in again.');
                navigate('/');
            }
        };

        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        if (selectedPersonName) {
            socket.emit('joinRoom', { sender: userName, receiver: selectedPersonName });

            const fetchMessages = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/api/messages/getMessages', {
                        params: {
                            sender: userName,
                            receiver: selectedPersonName
                        }
                    });
                    setMessages(response.data.messages);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            };

            fetchMessages();
        }
    }, [selectedPersonName, userName]);

    useEffect(() => {
        socket.on('receiveMessage', (data) => {
            console.log('Received message:', data);
            setMessages(prevMessages => [...prevMessages, data]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, []);

    const toggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem('token');

            if (token) {
                await axios.post('http://localhost:5000/api/users/logout', {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            localStorage.clear();
            navigate('/');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const handleSendMessage = () => {
        if (!selectedPersonName || !newMessage.trim()) return;
        socket.emit('sendMessage', { sender: userName, receiver: selectedPersonName, message: newMessage });
        setNewMessage('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const filteredPeople = people.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedPerson = people.find(person => person.name === selectedPersonName);

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
            <div className="flex flex-row h-full">
                <div className="w-1/3 border-r flex flex-col border-gray-300">
                    <div className="relative text-gray-500 border-b p-3">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 rounded-lg w-full pl-12 py-2 focus:outline-none focus:ring-gray-300 text-sm md:pl-12 md:text-base"
                            placeholder="Search"
                        />
                        <i className="fa-solid fa-magnifying-glass absolute top-1/2 left-8 transform -translate-y-1/2 md:text-sm"></i>
                    </div>
                    {filteredPeople.map(person => (
                        <div
                            key={person.name}
                            className={`flex items-center space-x-3 p-5 cursor-pointer ${selectedPersonName === person.name ? 'bg-gray-200' : ''} hover:bg-gray-100`}
                            onClick={() => setSelectedPersonName(person.name)}
                        >
                            <div className="relative">
                                <i className="fa-regular fa-circle-user fa-2x text-[#475467]"></i>
                                {person.status === 'online' && (
                                    <div className="absolute right-0 top-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                )}
                            </div>
                            <span className="text-[#344054]">{person.name}</span>
                        </div>
                    ))}
                </div>
                <div className="w-2/3 flex flex-col flex-auto h-full">
                    <div className="flex flex-col">
                        {selectedPersonName ? (
                            <div className="flex flex-col h-full">
                                <div className="flex items-center border-b p-2">
                                    <div className="relative">
                                        <i className="fa-regular fa-circle-user fa-2x text-[#475467]"></i>
                                        {selectedPerson?.status === 'online' && (
                                            <div className="absolute right-0 top-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                        )}
                                    </div>
                                    <div className="pl-4">
                                        <div className="text-[#344054]">{selectedPerson?.name}</div>
                                        {selectedPerson?.status === 'online' && (
                                            <div className="text-tiny text-gray-500">{selectedPerson?.status}</div>
                                        )}
                                    </div>
                                </div>
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center text-center h-full space-y-2 px-8 py-1 min-h-[70.5vh] max-h-[70.5vh]">
                                        <i className="fa-regular fa-message fa-6x pb-5 text-gray-300"></i>
                                        <div className="text-[20px] text-gray-500">
                                            You haven't started chatting yet
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col h-full space-y-2 px-8 py-1 min-h-[70.5vh] max-h-[70.5vh] overflow-y-auto">
                                        {messages.map((message, index) => (
                                            <div key={index} className={`flex ${message.sender === userName ? 'justify-end' : 'justify-start'} p-2`}>
                                                {message.sender !== userName && (
                                                    <div className="flex items-center">
                                                        <i className="fa-regular fa-circle-user fa-2x mr-2 text-[#475467]"></i>
                                                        <div className='flex flex-col items-start'>
                                                            <div className={`bg-${message.status === 'seen' ? '[#344054]' : 'gray-200'} text-[#344054] p-3 rounded-lg max-w-xs`}>
                                                                {message.message}
                                                            </div>
                                                            <div className='text-xs text-gray-500'>
                                                                <i className="fa-solid fa-check-double px-2 text-blue-600"></i>
                                                                {new Date(message.time).toLocaleTimeString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {message.sender === userName && (
                                                    <div>
                                                        <div className='flex flex-col items-end'>
                                                        <div className={`bg-${message.status === 'seen' ? '[#344054]' : 'gray-200'} text-[#344054] p-3 rounded-lg max-w-xs`}>
                                                                {message.message}
                                                            </div>
                                                            <div className='text-xs text-gray-500'>
                                                                <i className="fa-solid fa-check-double px-2 text-blue-600"></i>
                                                                {new Date(message.time).toLocaleTimeString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-auto p-3 flex">
                                    <div className="relative w-full">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            className="flex border border-gray-300 rounded-3xl px-4 focus:outline-none focus:ring-[#26B7CD] w-full"
                                            placeholder="Type your message"
                                        />
                                    </div>
                                    <button
                                        className="px-2 text-gray-400 hover:text-[#475467] transition-colors duration-200"
                                        onClick={handleSendMessage}
                                    >
                                        <i className="fa-solid fa-paper-plane"></i>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full min-h-[88vh] max-h-[100vh]">
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