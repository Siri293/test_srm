import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Clock, BookOpen, Target, Edit2, Trash2, Filter } from 'lucide-react';
import SessionModal from './SessionModal';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [filterSubject, setFilterSubject] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sessionsRes, subjectsRes] = await Promise.all([
        axios.get('/api/sessions/'),
        axios.get('/api/subjects/')
      ]);
      
      setSessions(sessionsRes.data);
      setSubjects(subjectsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = () => {
    setEditingSession(null);
    setModalOpen(true);
  };

  const handleEditSession = (session) => {
    setEditingSession(session);
    setModalOpen(true);
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this study session?')) {
      return;
    }

    try {
      await axios.delete(`/api/sessions/${sessionId}`);
      setSessions(sessions.filter(s => s.id !== sessionId));
      toast.success('Session deleted successfully');
    } catch (error) {
      console.error('Failed to delete session:', error);
      toast.error('Failed to delete session');
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingSession(null);
  };

  const handleSessionSaved = (savedSession) => {
    if (editingSession) {
      // Update existing session
      setSessions(sessions.map(s => s.id === savedSession.id ? savedSession : s));
    } else {
      // Add new session
      setSessions([savedSession, ...sessions]);
    }
    handleModalClose();
  };

  const filteredSessions = filterSubject 
    ? sessions.filter(session => session.subject_id === parseInt(filterSubject))
    : sessions;

  const getFocusLevelColor = (level) => {
    if (level >= 8) return 'text-green-600 bg-green-100';
    if (level >= 6) return 'text-yellow-600 bg-yellow-100';
    if (level >= 4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Study Sessions</h2>
          <p className="text-gray-600">Track and manage your study sessions</p>
        </div>
        <button
          onClick={handleCreateSession}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Log Session
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No study sessions yet</h3>
          <p className="text-gray-500 mb-6">Start logging your study time to track your progress</p>
          <button
            onClick={handleCreateSession}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200 inline-flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Log Your First Session
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredSessions.map((session) => {
              const subject = subjects.find(s => s.id === session.subject_id);
              return (
                <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Subject Color */}
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: subject?.color || '#3B82F6' }}
                      ></div>
                      
                      {/* Session Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900">
                            {session.subject_name}
                          </h3>
                          {session.topic && (
                            <span className="text-sm text-gray-500">
                              • {session.topic}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{session.time_spent} hours</span>
                          </div>
                          
                          {session.focus_level && (
                            <div className="flex items-center">
                              <Target className="h-4 w-4 mr-1" />
                              <span 
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getFocusLevelColor(session.focus_level)}`}
                              >
                                Focus: {session.focus_level}/10
                              </span>
                            </div>
                          )}
                          
                          <span>{new Date(session.timestamp).toLocaleDateString()}</span>
                        </div>
                        
                        {session.notes && (
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                            {session.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditSession(session)}
                        className="text-gray-400 hover:text-gray-600 p-2"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="text-gray-400 hover:text-red-600 p-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Session Modal */}
      <SessionModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSave={handleSessionSaved}
        session={editingSession}
        subjects={subjects}
      />
    </div>
  );
};

export default Sessions;